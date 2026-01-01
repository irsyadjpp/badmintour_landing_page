import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin'; // Ensure correct import logic from previous fix (exports db as adminDb)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: List Modules (Filtered by Coach if 'mine=true', else all for Admin)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const mine = searchParams.get('mine');

    let query: FirebaseFirestore.Query = adminDb.collection('coaching_modules');

    // If 'mine=true', filter by logged-in coach
    if (mine === 'true') {
      query = query.where('coachId', '==', session.user.id);
    }
    // Else if Admin, can see all? Or if Coach, can see public library?
    // For now, let's allow fetching all if not 'mine', or refine logic later.

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const modules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ data: modules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create New Module
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Role check
    const allowedRoles = ['coach', 'admin', 'superadmin'];
    if (!session || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, level, drills, durationMinutes, tags, description } = body;

    if (!title || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newModule = {
      coachId: session.user.id,
      coachName: session.user.name || 'Unknown Coach',
      title,
      level,
      drills: drills || [],
      durationMinutes: parseInt(durationMinutes) || 60,
      tags: tags || [],
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await adminDb.collection('coaching_modules').add(newModule);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
