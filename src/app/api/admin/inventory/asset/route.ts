import { NextRequest, NextResponse } from 'next/server';
import { registerAsset } from '@/lib/inventory-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, purchaseDate, price, usefulLife, residualValue, location, condition, proofImage } = body;

    const result = await registerAsset(
      name,
      category,
      purchaseDate,
      price,
      usefulLife,
      residualValue,
      location,
      condition,
      proofImage
    );

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
