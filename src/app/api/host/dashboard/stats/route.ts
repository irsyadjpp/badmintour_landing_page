
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'host' && session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch Events created by this host (or all if admin)
    // Filter by hostId is tricky depending on how we store it. Assuming 'hostId' field exists.
    // For now, let's just fetch ALL active events if role is host, 
    // real implementation might need .where('hostId', '==', session.user.id)

    let eventsQuery = db.collection('events');
    // if (session.user.role === 'host') {
    //     eventsQuery = eventsQuery.where('hostId', '==', session.user.id);
    // }
    // NOTE: Temporarily fetching ALL events to ensure data visibility 
    // until 'hostId' is strictly enforced on all legacy events.

    const eventsSnap = await eventsQuery.where('date', '>=', new Date().toISOString().split('T')[0]).get();

    const events = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Calculate Stats
    const activeEvents = events.length;
    let totalParticipants = 0;

    // We can't easily sum all participants across all events without a huge read cost
    // So for "Total Participants" let's just use the 'bookedSlot' sum from events 
    // (assuming bookedSlot is maintained correctly on event doc)
    events.forEach((e: any) => {
      totalParticipants += (e.bookedSlot || 0);
    });

    // 3. Revenue Today
    // Fetch bookings for TODAY
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // This query might need an index: bookings where created_at >= today
    // Let's safe-guard with try-catch or just return 0 if index missing
    let revenueToday = 0;

    // Simplified: Just returning explicit 0 for now until we have robust transaction ledger
    // Or we can try fetching bookings created today.
    // const todayBookings = await db.collection('bookings')
    //     .where('createdAt', '>=', today)
    //     .get();

    // todayBookings.docs.forEach(doc => {
    //     const data = doc.data();
    //     if (data.status === 'paid' || data.status === 'confirmed') {
    //         revenueToday += (data.totalPrice || 0);
    //     }
    // });

    // 4. Occupancy Rate (Avg of active events)
    let totalSlots = 0;
    let totalBooked = 0;
    events.forEach((e: any) => {
      totalSlots += (e.quota || 0);
      totalBooked += (e.bookedSlot || 0);
    });

    const occupancyRate = totalSlots > 0 ? Math.round((totalBooked / totalSlots) * 100) : 0;

    // 5. Upcoming Events (Top 3)
    // Sort by date/time
    const upcoming = events
      .sort((a: any, b: any) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 3)
      .map((e: any) => ({
        id: e.id,
        title: e.title,
        type: e.type || 'Event',
        time: e.time,
        quota: `${e.bookedSlot || 0}/${e.quota || 0}`,
        status: (e.bookedSlot >= e.quota) ? "Full" : "Open"
      }));


    return NextResponse.json({
      success: true,
      data: {
        activeEvents,
        totalParticipants,
        revenueToday: `Rp ${revenueToday.toLocaleString('id-ID')}`, // Placeholder
        occupancyRate,
        upcomingEvents: upcoming
      }
    });

  } catch (error: any) {
    console.error("Host Dashboard Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
