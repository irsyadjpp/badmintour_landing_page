
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const hostsRef = db.collection('users').where('roles', 'array-contains-any', ['host', 'admin', 'superadmin']);
    const snapshot = await hostsRef.get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true, data: [] });
    }

    const hosts = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || 'Unnamed Host',
      email: doc.data().email,
      image: doc.data().image
    }));

    return NextResponse.json({ success: true, data: hosts });
  } catch (error) {
    console.error("Error fetching hosts:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch hosts' }, { status: 500 });
  }
}
