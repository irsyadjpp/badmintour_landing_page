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

    // 1. Get Coach ID
    const coachId = session.user.id;

    // Fetch User Profile for Nickname
    const userDoc = await db.collection('users').doc(coachId).get();
    const userData = userDoc.data();
    const nickname = userData?.nickname || session.user.name?.split(' ')[0] || 'Coach';

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

    // 33. Filter by coach OR assistant
    // Run two queries because Firestore OR queries across different fields are tricky in older SDKs
    // Query A: Head Coach
    const headCoachPromise = eventsRef
      .where('coachId', '==', coachId)
      .where('date', '>=', now.toISOString().split('T')[0])
      .orderBy('date', 'asc')
      .limit(5)
      .get();

    // Query B: Assistant Coach
    const assistantCoachPromise = eventsRef
      .where('assistantCoachIds', 'array-contains', coachId)
      .where('date', '>=', now.toISOString().split('T')[0])
      .orderBy('date', 'asc')
      .limit(5)
      .get();

    const [headEvents, assistantEvents] = await Promise.all([headCoachPromise, assistantCoachPromise]);

    const sessionMap = new Map();

    // Helper to process docs
    const processDoc = (doc: any, role: string) => {
      const data = doc.data();
      if (!sessionMap.has(doc.id)) {
        sessionMap.set(doc.id, {
          id: doc.id,
          student: data.title,
          type: data.type || 'Session',
          time: data.time || 'TBA',
          location: data.location || 'Online',
          status: 'Scheduled',
          date: data.date,
          role: role // 'Head' or 'Assistant'
        });
      }
    };

    headEvents.forEach(doc => processDoc(doc, 'Head Coach'));
    assistantEvents.forEach(doc => processDoc(doc, 'Assistant'));

    // Convert map to array and sort
    upcomingSessions.push(...Array.from(sessionMap.values())
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5) // Limit total to 5
    );

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

    // 5. Fetch PAST Sessions (for History Tab)
    const pastSessions: any[] = []; // Explicitly declare array

    // Query A: Head Coach
    const pastHeadPromise = eventsRef
      .where('coachId', '==', coachId)
      .where('date', '<', now.toISOString().split('T')[0])
      .orderBy('date', 'desc')
      .limit(10)
      .get();

    // Query B: Assistant Coach
    const pastAssistantPromise = eventsRef
      .where('assistantCoachIds', 'array-contains', coachId)
      .where('date', '<', now.toISOString().split('T')[0])
      .orderBy('date', 'desc')
      .limit(10)
      .get();

    const [pastHead, pastAssistant] = await Promise.all([pastHeadPromise, pastAssistantPromise]);

    const pastSessionMap = new Map();
    const processPastDoc = (doc: any, role: string) => {
      const data = doc.data();
      if (!pastSessionMap.has(doc.id)) {
        pastSessionMap.set(doc.id, {
          id: doc.id,
          student: data.title,
          type: data.type || 'Session',
          time: data.time || 'TBA',
          location: data.location || 'Online',
          status: 'Completed',
          date: data.date,
          role: role
        });
      }
    };

    pastHead.forEach(doc => processPastDoc(doc, 'Head Coach'));
    pastAssistant.forEach(doc => processPastDoc(doc, 'Assistant'));

    pastSessions.push(...Array.from(pastSessionMap.values())
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Descending
      .slice(0, 10));

    // FORMAT RESPONSE
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          nickname: nickname
        },
        stats: {
          ...stats,
          income: `Rp ${stats.income.toLocaleString('id-ID')}`
        },
        upcomingSessions,
        pastSessions
      }
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    // Return Error for Debugging
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString() // Capture full error including index link
    });
  }
}
