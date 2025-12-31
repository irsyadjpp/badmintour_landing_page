import { NextRequest, NextResponse } from 'next/server';
import { recordJournalEntry } from '@/lib/finance-service';
import { COA } from '@/lib/finance-types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, sourceAccount, targetAccount, amount, adminFee, adminFeeAccount, reference } = body;

    const entries = [];

    // 1. Debit Target (Receive Money)
    entries.push({
      accountCode: targetAccount,
      debit: amount,
      credit: 0,
      description: `Transfer In`
    });

    // 2. Debit Admin Fee (If any)
    if (adminFee > 0) {
      entries.push({
        accountCode: adminFeeAccount || COA.COGS.GATEWAY_FEE,
        debit: adminFee,
        credit: 0,
        description: `Transfer Fee`
      });
    }

    // 3. Credit Source (Send Money + Fee)
    entries.push({
      accountCode: sourceAccount,
      debit: 0,
      credit: amount + (adminFee || 0),
      description: `Transfer Out`
    });

    await recordJournalEntry({
      date: date || new Date().toISOString(),
      refId: `TRF-${Date.now()}`,
      description: `Transfer ${reference ? `(${reference})` : ''}`,
      category: 'ASSET', // Internal movement
      entries,
      metadata: { notes: reference },
      status: 'posted'
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
