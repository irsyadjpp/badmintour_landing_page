import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !["host", "admin", "superadmin"].includes(session.user?.role as string)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { ticketCode } = await req.json();

    // Cari booking berdasarkan ticketCode
    const snapshot = await db.collection("bookings").where("ticketCode", "==", ticketCode).limit(1).get();
    
    if (snapshot.empty) return NextResponse.json({ error: "Tiket Tidak Valid" }, { status: 404 });

    const bookingDoc = snapshot.docs[0];
    const bookingData = bookingDoc.data();

    if (bookingData.attendance === true) {
        return NextResponse.json({ error: "Tiket Sudah Dipakai (Double Scan)" }, { status: 400 });
    }

    // Update Kehadiran
    await bookingDoc.ref.update({ attendance: true, checkInTime: new Date().toISOString() });

    return NextResponse.json({ success: true, data: bookingData });
}
