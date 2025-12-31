import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await db.collection('finance_coa').orderBy('code', 'asc').get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true, data: [] });
    }

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
