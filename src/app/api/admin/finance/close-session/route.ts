
import { NextResponse } from 'next/server';
import { closeSessionFinance } from '@/lib/inventory-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, shuttlecockUsedQty, courtFee, coachFee, shuttlecockItemId } = body;

    if (!eventId || shuttlecockUsedQty === undefined || !courtFee || !shuttlecockItemId) {
      return NextResponse.json({ success: false, error: 'Missing Required Fields' }, { status: 400 });
    }

    const result = await closeSessionFinance(
      eventId,
      shuttlecockUsedQty,
      courtFee,
      coachFee || 0,
      shuttlecockItemId
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error closing session:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
