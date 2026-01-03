import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    console.log(`[Assessment Migration] Starting for user ${userId}`);

    // 1. Get user's bookings
    const bookingsSnap = await db.collection('bookings')
      .where('userId', '==', userId)
      .get();

    if (bookingsSnap.empty) {
      return NextResponse.json({ message: 'No bookings found', migratedCount: 0 });
    }

    let migratedCount = 0;
    const updates: any[] = [];

    // 2. For each booking, check if there's an assessment with mismatched playerId
    for (const bookingDoc of bookingsSnap.docs) {
      const booking = bookingDoc.data();
      const eventId = booking.eventId;

      if (!eventId) continue;

      // Find assessments for this session
      const assessmentsSnap = await db.collection('assessments')
        .where('sessionId', '==', eventId)
        .get();

      for (const assessmentDoc of assessmentsSnap.docs) {
        const assessment = assessmentDoc.data();

        // If playerId doesn't match current userId, migrate it
        if (assessment.playerId !== userId) {
          updates.push({
            id: assessmentDoc.id,
            oldPlayerId: assessment.playerId,
            newPlayerId: userId,
            sessionId: eventId
          });

          await assessmentDoc.ref.update({
            playerId: userId,
            migratedAt: new Date(),
            oldPlayerId: assessment.playerId // Keep track of old ID
          });

          migratedCount++;
        }
      }
    }

    console.log(`[Assessment Migration] Migrated ${migratedCount} assessments for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} assessments`,
      migratedCount,
      details: updates
    });

  } catch (error: any) {
    console.error('[Assessment Migration Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
