import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch Events that are potential for payroll
    // Criteria: Type IN ['drilling', 'private'], Status != 'cancelled'
    // In real app, we should check if date < now
    const eventsSnapshot = await adminDb.collection('events')
      .where('type', 'in', ['drilling', 'private']) // Only coaching events
      .orderBy('date', 'desc')
      .get();

    const events = eventsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    const unpaidSessions = [];

    for (const event of events) {
      // @ts-ignore
      if (event.isCoachPaid) continue; // Skip if already paid

      // 2. Fetch Attendees (Bookings) to calculate Fee
      // Only count 'CHECKED IN' users!
      if (!event.id) continue;

      const bookingsSnapshot = await adminDb.collection('bookings')
        .where('sessionId', '==', event.id)
        .where('status', '==', 'confirmed')
        .get();

      const attendees = bookingsSnapshot.docs
        .map((doc: any) => doc.data())
        .filter((b: any) => !!b.checkInAt); // MUST be checked in

      if (attendees.length === 0) continue; // Skip if no attendees (no fee to pay)

      // 3. Calculate Fee
      let calculatedFee = 0;
      // @ts-ignore
      const price = parseInt(event.price) || 0;

      // @ts-ignore
      if (event.type === 'drilling') {
        // Flat Fee per Head logic (Example: 50.000 per head or 40%)
        // Let's assume 40% of Ticket Price goes to Coach per head
        const feePerHead = price * 0.4;
        calculatedFee = feePerHead * attendees.length;
      }
      // @ts-ignore
      else if (event.type === 'private') {
        // 80% Split
        const totalRevenue = price * attendees.length; // Usually price is total for private? assume per pax for now
        calculatedFee = totalRevenue * 0.8;
      }

      unpaidSessions.push({
        id: event.id,
        // @ts-ignore
        title: event.title,
        // @ts-ignore
        date: event.date,
        // @ts-ignore
        coachName: event.coachName || 'Unknown',
        // @ts-ignore
        coachId: event.coachId || 'unknown',
        attendeesCount: attendees.length,
        // @ts-ignore
        type: event.type,
        price: price,
        calculatedFee: Math.round(calculatedFee),
        status: 'pending'
      });
    }

    return NextResponse.json({ success: true, data: unpaidSessions });

  } catch (error: any) {
    console.error("Payroll Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
