
import { NextResponse } from 'next/server';
import { addNewInventoryItem } from '@/lib/inventory-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, unit, initialStock, initialAvgCost } = body;

    if (!name || !category || !unit) {
      return NextResponse.json({ success: false, error: 'Missing Required Fields' }, { status: 400 });
    }

    const newItem = await addNewInventoryItem(
      name,
      category,
      unit,
      parseInt(initialStock) || 0,
      parseInt(initialAvgCost) || 0
    );

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
