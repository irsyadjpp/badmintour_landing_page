
import { NextResponse } from 'next/server';
import { restockInventory } from '@/lib/inventory-service'; // Assumes Updated

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, qty, unitPrice, shippingCost } = body;

    if (!itemId || !qty || !unitPrice) {
      return NextResponse.json({ success: false, error: 'Missing Data' }, { status: 400 });
    }

    const res = await restockInventory(itemId, qty, unitPrice, shippingCost || 0);

    return NextResponse.json({ success: true, data: res });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
