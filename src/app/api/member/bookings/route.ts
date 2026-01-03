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
        if (mode === 'list') {
            // 1. Ambil Profile User untuk dapatkan No HP
            const userDoc = await db.collection("users").doc(session.user.id).get();
            const userData = userDoc.exists ? userDoc.data() : null;
            const userPhone = userData?.phoneNumber || "";

            // 2. Query Bookings by UserId (Standard)
            const bookingsByUserId = await db.collection("bookings")
                .where("userId", "==", session.user.id)
                .where("status", "in", ["paid", "confirmed", "pending", "pending_payment", "CONFIRMED", "pending_approval", "waiting_approval"])
                .get();

            // 3. Query Bookings by PhoneNumber (Legacy/Guest Match)
            // Handle multiple phone formats (08xx, 628xx, +628xx) to fix sync issues
            let bookingsByPhoneDocs: FirebaseFirestore.DocumentSnapshot[] = [];

            if (userPhone) {
                const cleanPhone = userPhone.replace(/\D/g, ''); // Remove non-digits
                const formats = new Set<string>();

                formats.add(userPhone); // Add exact profile phone
                formats.add(cleanPhone); // Add digits only

                if (cleanPhone.startsWith('0')) {
                    formats.add('62' + cleanPhone.substring(1));
                }
                if (cleanPhone.startsWith('62')) {
                    formats.add('0' + cleanPhone.substring(2));
                }
                // Determine uniqueness
                const uniqueFormats = Array.from(formats);

                const phoneQueries = uniqueFormats.map(phone =>
                    db.collection("bookings")
                        .where("phoneNumber", "==", phone)
                        .where("status", "in", ["paid", "confirmed", "pending", "pending_payment", "CONFIRMED", "pending_approval", "waiting_approval"])
                        .get()
                );

                const results = await Promise.all(phoneQueries);
                results.forEach(snap => {
                    snap.docs.forEach(doc => bookingsByPhoneDocs.push(doc));
                });
            }

            // 4. Merge & Deduplicate
            const uniqueDocs = new Map();
            bookingsByUserId.docs.forEach(doc => uniqueDocs.set(doc.id, doc));
            if (bookingsByPhoneDocs.length > 0) {
                bookingsByPhoneDocs.forEach(doc => uniqueDocs.set(doc.id, doc));
            }

            const allDocs = Array.from(uniqueDocs.values()).sort((a, b) => {
                // Approximate sort by time (newest first)
                const tA = a.data().bookedAt || "";
                const tB = b.data().bookedAt || "";
                return tB.localeCompare(tA);
            });

            // 3b. Fetch Assessments & Reviews (Batch Optimization)
            const [assessmentsSnapshot, reviewsSnapshot] = await Promise.all([
                db.collection("assessments").where("playerId", "==", session.user.id).get(),
                db.collection("reviews").where("reviewerId", "==", session.user.id).get()
            ]);

            const assessmentMap = new Set(); // Store sessionIds that have assessment
            assessmentsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.sessionId) assessmentMap.add(data.sessionId);
            });

            const reviewMap = new Set(); // Store bookingIds that are reviewed
            reviewsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.bookingId) reviewMap.add(data.bookingId);
            });

            const bookingsWithDetails = await Promise.all(allDocs.map(async (doc) => {
                const booking = doc.data();
                const eventSnap = await db.collection("events").doc(booking.eventId).get();
                const event = eventSnap.exists ? eventSnap.data() : null;

                return {
                    id: doc.id, // Booking ID
                    ticketCode: booking.ticketCode,
                    status: booking.status,
                    totalPrice: booking.totalPrice || event?.price || 0,
                    createdAt: booking.bookedAt?.toDate?.() || null,
                    hasAssessment: assessmentMap.has(booking.eventId), // Check if assessed
                    hasReviewed: reviewMap.has(doc.id), // Check if reviewed
                    event: {
                        id: booking.eventId,
                        title: event?.title || booking.eventTitle || "Unknown Event",
                        date: event?.date || booking.eventDate || null,
                        time: event?.time || "",
                        location: event?.location || "",
                        coach: event?.coachNickname || event?.coachName || "",
                        // Added for Curriculum Visibility
                        curriculum: event?.curriculum || "",
                        moduleId: event?.moduleId || null,
                        moduleTitle: event?.moduleTitle || null,
                        type: event?.type || (event?.title?.toLowerCase().includes('drilling') ? 'drilling' : 'mabar'),
                    }
                };
            }));

            return NextResponse.json({ success: true, data: bookingsWithDetails });
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
