import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { coachId, date, notes } = body;

    // 1. Validasi
    if (!coachId || !date) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

    // 2. Simpan Booking
    const bookingId = `CB-${Date.now()}`;
    await db.collection("coach_bookings").doc(bookingId).set({
        id: bookingId,
        coachId,
        studentId: session.user.id,
        studentName: session.user.name,
        date, // ISO String
        status: 'pending', // pending -> confirmed -> completed
        notes: notes || "",
        createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, bookingId });

  } catch (error) {
    return NextResponse.json({ error: "Booking Failed" }, { status: 500 });
  }
}
