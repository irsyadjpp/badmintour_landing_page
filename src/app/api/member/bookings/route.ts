import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ambil booking user yang belum lewat tanggalnya (Opsional logic tanggal)
    // Untuk simpel, ambil booking terakhir
    const snapshot = await db.collection("bookings")
        .where("userId", "==", session.user.id)
        .orderBy("bookedAt", "desc")
        .limit(1)
        .get();

    if (snapshot.empty) return NextResponse.json({ active: null });

    const booking = snapshot.docs[0].data();
    
    // Ambil detail eventnya juga biar lengkap (Join)
    const eventDoc = await db.collection("events").doc(booking.eventId).get();
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
}
