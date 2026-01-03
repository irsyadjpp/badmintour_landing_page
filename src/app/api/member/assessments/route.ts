
import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get('bookingId');

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get the Booking to find EventID (SessionID) and verify ownership
    const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingDoc.data();

    // Security Check: Ensure the user requesting is the owner of the booking
    // UNLESS the user is an admin/coach (but this is member API)
    // Note: booking.userId might be string match.
    if (booking?.userId !== session.user.id) {
      // Optional: Allow if admin? For now strict.
      return NextResponse.json({ error: 'Unauthorized Access to this booking' }, { status: 403 });
    }

    const sessionId = booking?.eventId;
    const playerId = booking?.userId;

    if (!sessionId || !playerId) {
      return NextResponse.json({ error: 'Invalid Booking Data' }, { status: 500 });
    }

    // 2. Fetch Assessment
    const snapshot = await adminDb.collection('assessments')
      .where('sessionId', '==', sessionId)
      .where('playerId', '==', playerId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ data: null });
    }

    const doc = snapshot.docs[0];
    const assessmentData = { id: doc.id, ...doc.data() };

    // Format for MemberReportView if needed? 
    // The view expects: date, coachName, moduleTitle, level, totalScore, scores, notes, aiFeedback.
    // We should return raw data and map it in client, or map it here.
    // Let's pass raw.

    return NextResponse.json({ data: assessmentData });

  } catch (error: any) {
    console.error("Member Assessment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
