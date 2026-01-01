import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: My Students (List of unique students who booked this coach - derived from recent 50 sessions)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const coachId = session.user.id;

    // 1. Get recent sessions (events) by this coach
    const eventsSnapshot = await db.collection('events')
      .where('coachId', '==', coachId)
      .orderBy('date', 'desc')
      .limit(50)
      .get();

    if (eventsSnapshot.empty) return NextResponse.json({ data: [] });

    const eventIds = eventsSnapshot.docs.map(doc => doc.id);

    // 2. Batched Query for Bookings (chunk by 10)
    // Firestore 'in' limit is 10.
    const studentMap = new Map();
    const chunks = [];
    for (let i = 0; i < eventIds.length; i += 10) {
      chunks.push(eventIds.slice(i, i + 10));
    }

    // Parallel fetch for speed
    await Promise.all(chunks.map(async (chunk) => {
      const bookingsSnapshot = await db.collection('bookings')
        .where('eventId', 'in', chunk)
        .where('status', 'in', ['confirmed', 'paid'])
        .get();

      bookingsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.userId && !studentMap.has(data.userId)) {
          studentMap.set(data.userId, {
            id: data.userId,
            name: data.userName || 'Unknown',
            email: data.userEmail,
            image: data.userImage,
            lastSession: data.eventDate || null,
            level: 'Common' // Mock default, real app would fetch user profile
          });
        }
      });
    }));

    const students = Array.from(studentMap.values());

    return NextResponse.json({ data: students });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
