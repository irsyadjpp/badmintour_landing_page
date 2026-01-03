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
    const { bookingId, isCheckedIn } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    // Update the booking document
    await adminDb.collection('bookings').doc(bookingId).update({
      checkInAt: isCheckedIn ? admin.firestore.FieldValue.serverTimestamp() : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

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
