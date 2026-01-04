import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'coach') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;
    const body = await req.json();
    const { bookingId, isCheckedIn, notes } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    // Update the booking document
    const updateData: any = {
      checkInAt: isCheckedIn ? admin.firestore.FieldValue.serverTimestamp() : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // If marking as absent (isCheckedIn = false) AND notes provided
    if (!isCheckedIn && notes) {
      updateData.absenceReason = notes;
    }
    // If checking in, remove absence reason
    else if (isCheckedIn) {
      updateData.absenceReason = admin.firestore.FieldValue.delete();
    }

    await adminDb.collection('bookings').doc(bookingId).update(updateData);

    return NextResponse.json({ success: true });

    // [New] AUDIT LOG
    const { logActivity } = await import('@/lib/audit-logger');
    await logActivity({
      userId: session.user.id,
      userName: session.user.name,
      role: session.user.role,
      action: 'update',
      entity: 'Booking',
      entityId: bookingId,
      details: `Coach ${session.user.name} marked check-in status: ${isCheckedIn}`
    });

  } catch (error: any) {
    console.error("Check-in Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
