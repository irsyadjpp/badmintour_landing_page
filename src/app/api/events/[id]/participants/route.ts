'use server';
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    // Ambil booking yang statusnya PAID untuk event ini
    const bookingsSnap = await db.collection("bookings")
        .where("eventId", "==", eventId)
        .where("status", "in", ["paid", "CONFIRMED"]) // Consider both paid and confirmed statuses
        .get();

    const participants = bookingsSnap.docs.map(doc => ({
        id: doc.data().userId, // Add user ID for profile link
        name: doc.data().userName || doc.data().guestName || "Member",
        avatar: doc.data().userImage || "", // URL foto profil
        joinedAt: doc.data().bookedAt
    }));

    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat peserta" }, { status: 500 });
  }
}
