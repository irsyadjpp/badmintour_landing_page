import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Wajib Login" }, { status: 401 });

    const { eventId } = await req.json();
    const userRef = db.collection("users").doc(session.user.id);
    const eventRef = db.collection("events").doc(eventId);

    // GUNAKAN TRANSACTION (Penting untuk mencegah rebutan slot / Race Condition)
    await db.runTransaction(async (t) => {
        const eventDoc = await t.get(eventRef);
        if (!eventDoc.exists) throw "Event tidak ditemukan";

        const eventData = eventDoc.data();
        
        // 1. Cek Kuota
        if (eventData?.registeredCount >= eventData?.quota) {
            throw "Slot Penuh";
        }

        // 2. Cek apakah user sudah join
        const bookingId = `BK-${eventId}-${session.user.id}`;
        const bookingRef = db.collection("bookings").doc(bookingId);
        const bookingDoc = await t.get(bookingRef);

        if (bookingDoc.exists) throw "Anda sudah terdaftar di event ini";

        // 3. Eksekusi Booking
        t.set(bookingRef, {
            id: bookingId,
            eventId,
            userId: session.user.id,
            userName: session.user.name,
            status: "CONFIRMED", // Asumsi langsung confirm (Bayar di tempat/Potong saldo nanti)
            bookedAt: new Date().toISOString(),
            ticketCode: `TIC-${Date.now()}` // Kode untuk QR Scanner
        });

        // 4. Update Event (Increment Count)
        t.update(eventRef, {
            registeredCount: FieldValue.increment(1)
        });
    });

    return NextResponse.json({ success: true, message: "Berhasil Join Mabar!" });

  } catch (error) {
    return NextResponse.json({ error: error || "Booking Failed" }, { status: 400 });
  }
}
