import { NextRequest, NextResponse } from 'next/server';
import { recordUsage } from '@/lib/inventory-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, qty, purpose, notes } = body;

    const result = await recordUsage(itemId, qty, purpose, notes);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
