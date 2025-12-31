import { NextRequest, NextResponse } from 'next/server';
import { recordJournalEntry } from '@/lib/finance-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, targetAccount, sourceName, categoryAccount, amount, proofImage, notes } = body;

    const entries = [
      {
        accountCode: targetAccount, // Debit Cash (Money In)
        debit: amount,
        credit: 0,
        description: `Received from ${sourceName}`
      },
      {
        accountCode: categoryAccount, // Credit Revenue/Equity
        debit: 0,
        credit: amount,
        description: notes || `Income from ${sourceName}`
      }
    ];

    await recordJournalEntry({
      date: date || new Date().toISOString(),
      refId: `INC-${Date.now()}`,
      description: `Income: ${sourceName}`,
      category: 'REVENUE',
      entries,
      metadata: { proofImage, notes },
      status: 'posted'
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
