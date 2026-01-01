import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch notes for a specific student
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const coachId = session.user.id;
    const studentId = params.id;

    const snapshot = await db.collection('coach_notes')
      .where('coachId', '==', coachId)
      .where('studentId', '==', studentId)
      .orderBy('createdAt', 'desc')
      .get();

    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ data: notes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add a new note
export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const { content, type } = await req.json(); // content: string, type: 'Technical' | 'Physical' | 'General'

    if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

    const newNote = {
      coachId: session.user.id,
      studentId: params.id,
      content,
      type: type || 'General',
      createdAt: new Date().toISOString(),
      coachName: session.user.name
    };

    const ref = await db.collection('coach_notes').add(newNote);

    return NextResponse.json({ success: true, id: ref.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
