import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const bookingId = params.bookingId;

    // 1. Fetch Booking to get sessionId (eventId) and userId (playerId)
    const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get();

    if (!bookingDoc.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingDoc.data();

    // Security Check: Only allow if booking belongs to user or user is Admin/Coach
    if (booking?.userId !== session.user.id && !['admin', 'coach', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sessionId = booking?.eventId;
    const playerId = booking?.userId;

    // 2. Fetch Assessment matching sessionId AND playerId
    const assessmentSnapshot = await adminDb.collection('assessments')
      .where('sessionId', '==', sessionId)
      .where('playerId', '==', playerId)
      .limit(1)
      .get();

    if (assessmentSnapshot.empty) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const assessmentDoc = assessmentSnapshot.docs[0];
    const assessmentData = assessmentDoc.data();

    // 3. Optional: Fetch Event Title for context
    let eventTitle = 'Coaching Session';
    const eventDoc = await adminDb.collection('events').doc(sessionId).get();
    if (eventDoc.exists) {
      eventTitle = eventDoc.data()?.title || eventTitle;
    }

    return NextResponse.json({
      data: assessmentData,
      eventTitle
    });

  } catch (error: any) {
    console.error("Fetch Report Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
