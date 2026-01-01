import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST: Request Substitute
export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const sessionId = params.id;
    const { reason } = await req.json();

    // 1. Get Event Details
    const eventDoc = await db.collection('events').doc(sessionId).get();
    if (!eventDoc.exists) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const eventData = eventDoc.data();

    if (eventData?.coachId !== session.user.id) {
      return NextResponse.json({ error: "Not your session" }, { status: 403 });
    }

    // 2. Create Substitution Request
    const subRequest = {
      originalCoachId: session.user.id,
      originalCoachName: session.user.name,
      eventId: sessionId,
      eventTitle: eventData.title,
      eventDate: eventData.date,
      reason: reason || 'Emergency',
      status: 'pending', // pending -> approved -> assigned
      createdAt: new Date().toISOString()
    };

    await db.collection('substitution_requests').add(subRequest);

    // Optional: Notify Admins (Logic skipped for MVP)

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
