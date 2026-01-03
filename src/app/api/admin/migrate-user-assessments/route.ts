import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    console.log(`[Manual Migration] Starting for user ${userId}`);

    let migratedCount = 0;
    const batch = db.batch();

    // Find all bookings for this user
    const bookingsSnap = await db.collection('bookings')
      .where('userId', '==', userId)
      .get();

    console.log(`[Manual Migration] Found ${bookingsSnap.size} bookings`);

    for (const bookingDoc of bookingsSnap.docs) {
      const booking = bookingDoc.data();
      const eventId = booking.eventId;

      if (!eventId) continue;

      // Find assessments for this session
      const assessmentsSnap = await db.collection('assessments')
        .where('sessionId', '==', eventId)
        .get();

      console.log(`[Manual Migration] Found ${assessmentsSnap.size} assessments for event ${eventId}`);

      for (const assessmentDoc of assessmentsSnap.docs) {
        const assessment = assessmentDoc.data();

        console.log(`[Manual Migration] Assessment ${assessmentDoc.id}: playerId=${assessment.playerId}, target=${userId}`);

        // If playerId doesn't match, migrate it
        if (assessment.playerId !== userId) {
          batch.update(assessmentDoc.ref, {
            playerId: userId,
            migratedAt: new Date(),
            oldPlayerId: assessment.playerId
          });
          migratedCount++;
          console.log(`[Manual Migration] ✅ Queued migration for ${assessmentDoc.id}`);
        } else {
          console.log(`[Manual Migration] ⏭️  Already matched, skipping`);
        }
      }
    }

    if (migratedCount > 0) {
      await batch.commit();
      console.log(`[Manual Migration] ✅ Committed ${migratedCount} migrations`);
    } else {
      console.log(`[Manual Migration] ℹ️  No migrations needed`);
    }

    return NextResponse.json({
      success: true,
      message: `Migrated ${migratedCount} assessments`,
      migratedCount,
      userId
    });

  } catch (error: any) {
    console.error('[Manual Migration Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
