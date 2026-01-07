import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { eventId, guestName, guestPhone } = body;

        // Tentukan Identitas: Member atau Guest
        let userId = "guest";
        let userName = guestName;
        let userPhone = guestPhone;
        let userType = "GUEST";

        if (session?.user?.id) {
            // Jika Login
            const userDoc = await db.collection("users").doc(session.user.id).get();
            const userData = userDoc.data();

            userId = session.user.id;
            userName = session.user.name || "Member";
            userPhone = userData?.phoneNumber || ""; // Ambil HP dari profile jika ada
            userType = "MEMBER";
        } else {
            // Jika Guest (Validasi Wajib)
            if (!guestName || !guestPhone) {
                return NextResponse.json({ error: "Nama dan No WA wajib diisi untuk tamu." }, { status: 400 });
            }
        }

        const eventRef = db.collection("events").doc(eventId);

        // TRANSAKSI BOOKING
        await db.runTransaction(async (t) => {
            const eventDoc = await t.get(eventRef);
            if (!eventDoc.exists) throw "Event tidak ditemukan";

            const eventData = eventDoc.data();

            if (eventData?.registeredCount >= eventData?.quota) {
                throw "Slot Penuh";
            }

            // Generate Booking ID
            // Jika Guest, ID-nya pakai kombinasi Event+HP biar unik dan bisa ditrack
            const uniqueKey = session?.user?.id || guestPhone;
            const bookingId = `BK-${eventId}-${uniqueKey.replace(/[^a-zA-Z0-9]/g, "")}`;

            const bookingRef = db.collection("bookings").doc(bookingId);
            const bookingDoc = await t.get(bookingRef);

            if (bookingDoc.exists) throw "Anda sudah terdaftar di event ini";

            // Simpan Data Booking
            t.set(bookingRef, {
                id: bookingId,
                eventId,
                eventTitle: eventData?.title,
                eventDate: eventData?.date,

                userId,      // "guest" atau "user_id_asli"
                userName,
                phoneNumber: userPhone, // KUNCI PAIRING NANTI
                type: userType,

                status: "CONFIRMED",
                bookedAt: new Date().toISOString(),
                ticketCode: `TIC-${Date.now()}`.slice(0, 12),
                attendance: false
            });

            // Update Counter Event
            t.update(eventRef, {
                registeredCount: FieldValue.increment(1)
            });

            // Update Dashboard Aggregates
            const statsRef = db.collection("aggregates").doc("dashboard_stats");
            t.set(statsRef, {
                totalBookings: FieldValue.increment(1),
                // Increment revenue only if paid (but here it is CONFIRMED, usually manual transfer or free)
                // We'll increment booking count for now.
                lastUpdated: new Date().toISOString()
            }, { merge: true });
        });

        return NextResponse.json({
            success: true,
            message: session?.user?.id ? "Booking Berhasil!" : "Booking Tamu Berhasil! Silahkan datang tepat waktu.",
            isGuest: !session?.user?.id
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error || "Booking Failed" }, { status: 400 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    try {
        // MODE LIST: Return ALL Active Bookings with Event Details (untuk Dashboard List)
        // MODE LIST: Return Bookings with Pagination
        if (mode === 'list') {
            const limit = parseInt(searchParams.get('limit') || '20');
            const cursor = searchParams.get('cursor'); // expects ISO Date String of last item

            // 1. Fetch by User ID
            const userIdQuery = db.collection("bookings")
                .where("userId", "==", session.user.id)
                .where("status", "in", ["paid", "confirmed", "pending", "pending_payment", "CONFIRMED", "pending_approval", "waiting_approval"])
                .orderBy("bookedAt", "desc")
                .limit(limit + 5); // Fetch extra buffer

            // 2. Fetch by Phone (Link Orphaned Bookings)
            let phoneQueryPromise = Promise.resolve({ empty: true, docs: [] } as any);

            // Get Phone from Session or DB
            let userPhone = (session.user as any).phoneNumber;
            if (!userPhone) {
                // Fallback fetch if not in session yet (auth.ts fix pending propagation)
                const uDoc = await db.collection("users").doc(session.user.id).get();
                userPhone = uDoc.data()?.phoneNumber;
            }

            if (userPhone && (cursor === null || cursor === undefined || cursor === '')) {
                // Formatting Check (08 vs 62)
                let clean = userPhone.replace(/\D/g, '');
                if (clean.startsWith('0')) clean = '62' + clean.slice(1);
                const p62 = clean;
                const p08 = '0' + clean.slice(2);

                // Only run this "Guest Sync" on the first page load to avoid cursor complexity
                // and because recent bookings are most relevant.
                // Note: Removed orderBy to avoid Index Requirement. Sorted in memory later.
                phoneQueryPromise = db.collection("bookings")
                    .where("guestPhone", "in", [p62, p08])
                    .limit(10) // Check last 10 guest bookings
                    .get();
            }

            const [userIdSnap, phoneSnap] = await Promise.all([userIdQuery.get(), phoneQueryPromise]);

            // 3. MERGE & DEDUPLICATE
            const allDocs = new Map();

            userIdSnap.docs.forEach(doc => allDocs.set(doc.id, doc));
            phoneSnap.docs.forEach(doc => {
                // Only add if not exist (userId query takes precedence)
                if (!allDocs.has(doc.id)) {
                    allDocs.set(doc.id, doc);
                }
            });

            // Convert to Array and Sort manually
            let sortedDocs = Array.from(allDocs.values()).sort((a, b) => {
                const dateA = a.data().bookedAt;
                const dateB = b.data().bookedAt;
                return (dateB > dateA) ? 1 : -1; // Descending
            });

            // Apply Pagination Slice
            // Note: Cursor logic won't work perfectly with mixed sources if we don't fetch all. 
            // But since phone query is only typically small/recent, this hybrid Approach is "Good Enough" for UX.
            // Ideally we'd migrate the data.

            const hasMore = sortedDocs.length > limit;
            const docsToReturn = hasMore ? sortedDocs.slice(0, limit) : sortedDocs;
            // Providing a separate 'sync' endpoint is better.

            // 3b. Fetch Assessments & Reviews (Batch Optimization)
            const [assessmentsSnapshot, reviewsSnapshot] = await Promise.all([
                db.collection("assessments").where("playerId", "==", session.user.id).get(),
                db.collection("reviews").where("reviewerId", "==", session.user.id).get()
            ]);

            const assessmentMap = new Set();
            assessmentsSnapshot.forEach(doc => { const data = doc.data(); if (data.sessionId) assessmentMap.add(data.sessionId); });

            const reviewMap = new Set();
            reviewsSnapshot.forEach(doc => { const data = doc.data(); if (data.bookingId) reviewMap.add(data.bookingId); });

            const bookingsWithDetails = await Promise.all(docsToReturn.map(async (doc) => {
                const booking = doc.data();
                // Optimization: Fetch event only if needed? 
                // We likely need it for title/time.
                // Could be optimized by storing event details in booking.

                let event = null;
                if (booking.eventId) {
                    const eventSnap = await db.collection("events").doc(booking.eventId).get();
                    event = eventSnap.exists ? eventSnap.data() : null;
                }

                return {
                    id: doc.id,
                    ticketCode: booking.ticketCode,
                    status: booking.status,
                    totalPrice: booking.totalPrice || event?.price || 0,
                    createdAt: booking.bookedAt?.toDate?.() || null, // Ensure Date object
                    bookedAtString: booking.bookedAt, // For Cursor
                    hasAssessment: assessmentMap.has(booking.eventId),
                    hasReviewed: reviewMap.has(doc.id),
                    event: {
                        id: booking.eventId,
                        title: event?.title || booking.eventTitle || "Unknown Event",
                        date: event?.date || booking.eventDate || null,
                        time: event?.time || "",
                        location: event?.location || "",
                        coach: event?.coachNickname || event?.coachName || "",
                        curriculum: event?.curriculum || "",
                        moduleId: event?.moduleId || null,
                        moduleTitle: event?.moduleTitle || null,
                        type: event?.type || (event?.title?.toLowerCase().includes('drilling') ? 'drilling' : 'mabar'),
                    }
                };
            }));

            const lastItem = bookingsWithDetails[bookingsWithDetails.length - 1];
            const nextCursor = hasMore && lastItem ? lastItem.bookedAtString : null;

            return NextResponse.json({
                success: true,
                data: bookingsWithDetails,
                meta: {
                    hasMore,
                    cursor: nextCursor
                }
            });
        }

        // DEFAULT MODE: Return Single Active Booking (untuk Dashboard Widget)
        // Ambil booking user yang belum lewat tanggalnya (Opsional logic tanggal)
        const snapshot = await db.collection("bookings")
            .where("userId", "==", session.user.id)
            .orderBy("bookedAt", "desc")
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ success: true, active: null });
        }

        const booking = snapshot.docs[0].data();

        // Ambil detail eventnya juga biar lengkap (Join)
        const eventDoc = await db.collection("events").doc(booking.eventId).get();
        if (!eventDoc.exists) {
            return NextResponse.json({ success: true, active: null });
        }
        const eventData = eventDoc.data();

        return NextResponse.json({
            success: true,
            active: {
                id: booking.ticketCode,
                event: eventData?.title,
                date: eventData?.date,
                time: eventData?.time,
                location: eventData?.location,
                court: eventData?.courts,
                status: booking.status
            }
        });
    } catch (error) {
        console.error("GET Bookings Error: ", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
