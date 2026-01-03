
import { NextResponse } from 'next/server';
import { addNewInventoryItem } from '@/lib/inventory-service';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // [New] Audit Log
    const session = await getServerSession(authOptions);
    if (session) {
      const { logActivity } = await import('@/lib/audit-logger');
      await logActivity({
        userId: session.user.id,
        userName: session.user.name,
        role: session.user.role,
        action: 'create',
        entity: 'Inventory',
        entityId: newItem.id,
        details: `Created new Item: ${name} (${initialStock} ${unit})`
      });
    }

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
