import { NextRequest, NextResponse } from 'next/server';
import { performOpname } from '@/lib/inventory-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, actualQty, reason } = body;

    const result = await performOpname(itemId, actualQty, reason);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
