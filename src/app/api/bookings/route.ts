import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { logActivity } from "@/lib/audit-logger";

export async function POST(req: Request) {
  let bookingId = "";
  let eventTitle = "";
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
        userName = session.user.name;
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
        eventTitle = eventData?.title || "";
        
        if (eventData?.registeredCount >= eventData?.quota) {
            throw "Slot Penuh";
        }

        // Generate Booking ID
        // Jika Guest, ID-nya pakai kombinasi Event+HP biar unik dan bisa ditrack
        const uniqueKey = session?.user?.id || guestPhone; 
        bookingId = `BK-${eventId}-${uniqueKey.replace(/[^a-zA-Z0-9]/g, "")}`;
        
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

    await logActivity({
      userId: userId,
      userName: userName,
      role: session?.user?.role || 'guest',
      action: 'create',
      entity: 'Booking',
      entityId: bookingId,
      details: `Booking tiket untuk event: ${eventTitle}`
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
