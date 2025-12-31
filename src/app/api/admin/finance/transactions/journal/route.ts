import { NextRequest, NextResponse } from 'next/server';
import { recordJournalEntry } from '@/lib/finance-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, description, entries } = body;

    // Validate Balance
    const totalDebit = entries.reduce((sum: number, e: any) => sum + (e.debit || 0), 0);
    const totalCredit = entries.reduce((sum: number, e: any) => sum + (e.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 1) { // Allow slight rounding diff
      return NextResponse.json({ success: false, error: `Journal not balanced. Dr: ${totalDebit}, Cr: ${totalCredit}` }, { status: 400 });
    }

    await recordJournalEntry({
      date: date || new Date().toISOString(),
      refId: `JE-${Date.now()}`,
      description: description,
      category: 'LIABILITY', // General/Adjustment
      entries,
      status: 'posted'
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
