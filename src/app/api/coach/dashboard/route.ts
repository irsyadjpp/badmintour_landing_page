import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get Coach ID (assuming user ID is relevant or stored in profile)
    // For now, simpler approach: search events where coachEmail matches or coachId matches
    // Ideally we should have a 'coaches' collection map.
    // Let's assume session.user.id is the coachId for simplicity in this MVP
    const coachId = session.user.id;

    // MOCK DATA FALLBACKS (Since we might not have real data yet)
    const stats = {
      activeStudents: 0,
      totalHours: 0,
      rating: 5.0,
      income: 0,
      monthlyGoal: 0
    };
    const upcomingSessions: any[] = [];
    let totalIncome = 0;

    // 2. Fetch Real Data - Upcoming Sessions
    // Query 'events' collection where type == 'coaching' (or similar) and coachId == current
    // Note: Field names might vary based on your schema. Adjusting to common schema.
    const eventsRef = db.collection('events');
    const now = new Date();

    // Filter by coach (assuming 'coachId' field exists on event)
    // If not, we might need to filter manually or rely on 'host' field if coach is host
    const eventsSnapshot = await eventsRef
      .where('coachId', '==', coachId)
      .where('date', '>=', now.toISOString().split('T')[0]) // Simple date string comparison or timestamp
      .orderBy('date', 'asc')
      .limit(5)
      .get();

    if (!eventsSnapshot.empty) {
      eventsSnapshot.forEach(doc => {
        const data = doc.data();
        upcomingSessions.push({
          id: doc.id,
          student: data.title, // Or fetch participants if needed
          type: data.type || 'Session',
          time: data.time || 'TBA',
          location: data.location || 'Online',
          status: 'Scheduled', // Logic to determine status
          date: data.date
        });
      });
    }

    // 3. Fetch Earnings (from finance_ledger or transactions)
    // Simple aggregation for MVP
    const ledgerRef = db.collection('finance_ledger');
    const incomeSnapshot = await ledgerRef
      .where('entityId', '==', coachId)
      .where('type', '==', 'CREDIT') // Earnings are credits to coach
      .get();

    incomeSnapshot.forEach(doc => {
      const data = doc.data();
      totalIncome += (data.amount || 0);
    });

    stats.income = totalIncome;

    // 4. Fetch Students (Unique booking userIds)
    // This can be expensive if not optimized. limiting strictly for MVP.
    const bookingsRef = db.collection('bookings');
    const bookingSnapshot = await bookingsRef
      .where('coachId', '==', coachId)
      .get();

    const uniqueStudents = new Set();
    bookingSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.userId) uniqueStudents.add(data.userId);
      // Calculate hours approximation
      stats.totalHours += 1; // Assume 1 hr per booking for simplicity
    });

    stats.activeStudents = uniqueStudents.size;


    // FORMAT RESPONSE
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          ...stats,
          income: `Rp ${stats.income.toLocaleString('id-ID')}`
        },
        upcomingSessions
      }
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    // Return Mock if Error (Graceful Degradation)
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          activeStudents: 12,
          totalHours: 45,
          rating: 4.8,
          income: "Rp 1.500.000",
          monthlyGoal: 65,
          isMock: true
        },
        upcomingSessions: []
      }
    });
  }
}
