import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> } // Updated type
) {
  try {
    const params = await props.params; // Await params
    const sessionId = params.id;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID Required' }, { status: 400 });
    }

    // 1. Fetch Confirmed Bookings for this Event
    // We query the 'bookings' collection where eventId == sessionId AND status == 'confirmed' (or 'paid')
    const bookingsSnapshot = await adminDb.collection('bookings')
      .where('eventId', '==', sessionId)
      .where('status', 'in', ['confirmed', 'paid'])
      .get();

    if (bookingsSnapshot.empty) {
      return NextResponse.json({ data: [] });
    }

    // 2. Fetch Assessments for this Session (to check who is already assessed)
    const assessmentsSnapshot = await adminDb.collection('assessments')
      .where('sessionId', '==', sessionId)
      .get();

    const assessedPlayerIds = new Set<string>();
    assessmentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.playerId) assessedPlayerIds.add(data.playerId);
    });

    // 3. Process Participants Data
    // Ideally, we might want to fetch User details if not fully compliant in booking
    // For now, assuming booking contains snapshot of user details (name, email)
    // If not, we have to fetch `users` docs. Let's do that for safety to get latest Image/Name.

    const participantsPromises = bookingsSnapshot.docs.map(async (doc) => {
      const booking = doc.data();
      const userId = booking.userId;

      let userName = booking.userName || booking.guestName || 'Guest';
      let userImage = booking.userImage || '';
      let nickname = '';
      let level = 'Beginner';

      // Option: Fetch latest user profile
      if (userId) {
        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          userName = userData?.name || userName;
          userImage = userData?.image || userImage;
          nickname = userData?.nickname || '';
          level = userData?.level || level;
        }
      }

      return {
        bookingId: doc.id,
        bookingCode: booking.bookingCode,
        userId: userId,
        userName,
        userImage,
        nickname,
        level,
        hasAssessment: assessedPlayerIds.has(userId),
        status: booking.status,
        checkInAt: booking.checkInAt ? booking.checkInAt.toDate() : null
      };
    });

    const participants = await Promise.all(participantsPromises);

    return NextResponse.json({ data: participants });

  } catch (error: any) {
    console.error("Fetch Participants Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
