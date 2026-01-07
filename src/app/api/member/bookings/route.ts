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

            let query = db.collection("bookings")
                .where("userId", "==", session.user.id)
                .where("status", "in", ["paid", "confirmed", "pending", "pending_payment", "CONFIRMED", "pending_approval", "waiting_approval"])
                .orderBy("bookedAt", "desc")
                .limit(limit + 1); // Fetch 1 extra to check next page

            if (cursor) {
                query = query.startAfter(cursor);
            }

            const snapshot = await query.get();

            // Handle Phone Number Match (Legacy/Guest) - ONLY if First Page (cursor is null) to avoid dups/complexity
            // We append phone-based bookings only on fresh load.


            // Pagination Logic
            const hasMore = snapshot.docs.length > limit;


            const docsToReturn = hasMore ? snapshot.docs.slice(0, limit) : snapshot.docs;
            // Merge finally
            // Actually, merging phone logic with cursor paging is messy. 
            // Better to return phone matches as separate list? Or just ignore for pagination phase?
            // "Guest Match" is usually for claiming. 
            // Let's stick to PURE pagination for userId. 
            // And maybe a "guest_matches" separate field? 
            // For now, I will implement Strict Pagination for UserId only to solve the Performance Issue.
            // Phone logic is causing the slow "Fetch All" currently. 
            // I will COMMENT OUT phone logic for 'pagination list' to ensure speed.
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
