'use server';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";
import { FieldValue } from 'firebase-admin/firestore';
import { createBookingJournal } from "@/lib/finance-service";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { eventId, guestName, guestPhone, partnerName } = await req.json(); // Added partnerName

        if (!eventId) {
            console.error("BOOKING_DEBUG: Missing eventId");
            return NextResponse.json({ error: "Event ID wajib diisi" }, { status: 400 });
        }

        // 1. Ambil Data Event
        const eventRef = db.collection("events").doc(eventId);
        const eventDoc = await eventRef.get();
        if (!eventDoc.exists) return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });

        const eventData = eventDoc.data();
        if ((eventData?.bookedSlot || 0) >= eventData?.quota) {
            console.error("BOOKING_DEBUG: Quota Full", eventData?.bookedSlot, eventData?.quota);
            return NextResponse.json({ error: "Kuota Penuh" }, { status: 400 });
        }

        // 2. Tentukan Data Peserta (Member vs Guest)
        let participantData: any = {};
        let loggerDetails = "";

        if (session) {
            // SCENARIO MEMBER
            participantData = {
                userId: session.user.id,
                userName: session.user.name,
                userEmail: session.user.email,
                userImage: session.user.image,
                userRole: session.user.role,
                type: 'member'
            };
            loggerDetails = `Member ${session.user.name} booking event`;
        } else {
            // SCENARIO GUEST OR UNLOGGED MEMBER
            if (!guestName || !guestPhone) {
                console.error("BOOKING_DEBUG: Missing Guest Data", { guestName, guestPhone });
                return NextResponse.json({ error: "Nama dan No. WhatsApp wajib diisi" }, { status: 400 });
            }

            // Cek apakah No. HP ini terdaftar (Member atau sudah pernah jadi Guest)
            const userCheckSnapshot = await db.collection("users").where("phoneNumber", "==", guestPhone).limit(1).get();

            if (!userCheckSnapshot.empty) {
                // LINK TO EXISTING ACCOUNT (Member or Previous Guest)
                const userDoc = userCheckSnapshot.docs[0];
                const userData = userDoc.data();

                participantData = {
                    userId: userDoc.id,
                    userName: userData.name || guestName, // Prefer DB name if available
                    userEmail: userData.email || "",
                    userImage: userData.image || "",
                    userRole: userData.role || 'guest',
                    type: userData.role === 'member' ? 'member' : 'guest',
                    guestPhone: guestPhone
                };
                loggerDetails = `${userData.role === 'member' ? 'Member' : 'Guest'} ${userData.name} (via Guest Form ${guestPhone}) booking event`;
            } else {
                // NEW GUEST -> CREATE SHADOW USER
                // Kita buatkan ID agar bisa ditautkan dengan Assessment / Coach
                const newGuestRef = db.collection("users").doc();
                await newGuestRef.set({
                    id: newGuestRef.id,
                    name: guestName,
                    phoneNumber: guestPhone,
                    role: 'guest', // Mark as guest
                    createdAt: new Date().toISOString(),
                    isShadow: true, // Marker bahwa ini akun otomatis
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=random` // Auto avatar
                });

                participantData = {
                    userId: newGuestRef.id,
                    userName: guestName,
                    userRole: 'guest',
                    type: 'guest',
                    guestPhone: guestPhone,
                    userImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=random`
                };
                loggerDetails = `New Guest ${guestName} (${guestPhone}) auto-registered & booked event`;
            }
        }

        // 2.2. SCENARIO TOURNAMENT ACCESS CONTROL
        if (eventData?.type === 'tournament') {
            const allowedTypes = eventData?.allowedUserTypes || ['member']; // Default member only
            if (participantData.type === 'guest' && !allowedTypes.includes('guest')) {
                return NextResponse.json({ error: "Maaf, Event ini khusus Member." }, { status: 403 });
            }
        }

        // 2.5. CEK DUPLIKASI (Anti Double Booking)
        // Cek apakah user/guest ini sudah terdaftar di event ID ini
        // 2.5. CEK DUPLIKASI (Anti Double Booking)
        // Cek apakah user/guest ini sudah terdaftar di event ID ini (Active Only)
        const existingBookingsSnapshot = await db.collection("bookings")
            .where("eventId", "==", eventId)
            .where(session ? "userId" : "guestPhone", "==", session ? session.user.id : (guestPhone || ''))
            .get();

        const hasActiveBooking = existingBookingsSnapshot.docs.some(doc => doc.data().status !== 'cancelled');

        if (hasActiveBooking) {
            console.error("BOOKING_DEBUG: Duplicate Booking", { eventId, user: session?.user?.id, phone: guestPhone });
            return NextResponse.json({
                error: session ? "Anda sudah terdaftar di event ini." : "Nomor WhatsApp ini sudah terdaftar di event ini."
            }, { status: 400 });
        }

        // 3. Simpan Booking (Atomic Transaction)
        const bookingRef = await db.runTransaction(async (t) => {
            const freshEventDoc = await t.get(eventRef);
            const currentBooked = freshEventDoc.data()?.bookedSlot || 0;

            if (currentBooked >= freshEventDoc.data()?.quota) {
                throw new Error("Kuota Penuh");
            }

            // Generate Custom Booking Code (e.g. BT-MAB-9X8Y)
            const cleanTitle = (eventData?.title || 'EVENT').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 3);
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            const bookingCode = `BT-${cleanTitle}-${randomSuffix}`;

            // Determine Status & Price
            const isSparring = eventData?.type === 'sparring';
            const bookingPrice = isSparring ? 0 : (eventData?.price || 0);

            let initialStatus = 'pending_payment';

            if (eventData?.type === 'tournament') {
                initialStatus = 'pending_approval'; // Tournament always needs approval first
            } else if (bookingPrice === 0) {
                initialStatus = 'paid'; // Auto-confirm if Free (Mabar, Drilling, Sparring)
            }

            // Create Booking Doc
            const newBookingRef = db.collection("bookings").doc();
            t.set(newBookingRef, {
                id: newBookingRef.id,
                bookingCode: bookingCode, // New readable ID
                eventId,
                eventTitle: eventData?.title,
                eventDate: eventData?.date,
                eventTime: eventData?.time,
                eventLocation: eventData?.location,
                price: bookingPrice,
                status: initialStatus,
                partnerName: partnerName || "", // Optional Partner
                ...participantData,
                createdAt: new Date().toISOString()
            });

            // Update Quota Event (+1)
            t.update(eventRef, {
                bookedSlot: FieldValue.increment(1)
            });

            return { id: newBookingRef.id, code: bookingCode };
        });

        // 4. Log Activity
        await logActivity({
            userId: session ? session.user.id : 'guest',
            userName: session ? (session.user.name || 'Unknown') : (guestName || 'Guest'),
            role: session ? (session.user.role || 'member') : 'guest',
            action: 'create',
            entity: 'Booking',
            entityId: bookingRef.id,
            details: loggerDetails
        });

        // 5. AUTO-JOURNAL (Financial Record)
        // Import dynamically or at top. Assuming import { createBookingJournal } from '@/lib/finance-service';
        try {
            const isSparring = eventData?.type === 'sparring';
            const finalPrice = isSparring ? 0 : (eventData?.price || 0);

            // Re-construct booking data for the journal helper
            const journalData = {
                id: bookingRef.id,
                bookingCode: bookingRef.code,
                price: finalPrice,
                userName: session ? (session.user.name || 'Unknown') : (guestName || 'Guest')
            };

            // Only record journal if price > 0
            if (finalPrice > 0) {
                await createBookingJournal(journalData, eventData?.type || 'mabar');
            }
        } catch (financeError) {
            console.error("AUTO-JOURNAL ERROR:", financeError);
            // Don't fail the request, just log error. 
            // In production, we'd want a retry mechanism or alert system.
        }

        return NextResponse.json({ success: true, bookingId: bookingRef.id, bookingCode: bookingRef.code, isGuest: !session });

    } catch (error: any) {
        console.error("BOOKING API ERROR:", error);
        return NextResponse.json({ error: error.message || "Gagal booking" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // Ambil booking user yang belum lewat tanggalnya (Opsional logic tanggal)
        // Untuk simpel, ambil booking terakhir
        const snapshot = await db.collection("bookings")
            .where("userId", "==", session.user.id)
            .orderBy("createdAt", "desc")
            .limit(10) // Ambil 10 booking terakhir
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ success: true, data: [] });
        }

        const bookings = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                event: data.eventTitle,
                date: data.eventDate,
                time: data.eventTime,
                location: data.eventLocation,
                status: data.status,
                price: data.price
            }
        });

        return NextResponse.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("GET Bookings Error: ", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
