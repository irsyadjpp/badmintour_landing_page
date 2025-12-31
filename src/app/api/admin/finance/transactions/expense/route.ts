import { NextRequest, NextResponse } from 'next/server';
import { recordJournalEntry } from '@/lib/finance-service';
import { COA } from '@/lib/finance-types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, sourceAccount, payee, totalAmount, details, proofImage, status } = body;

    // Validate Total Split
    const splitTotal = details.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    if (splitTotal !== totalAmount) {
      return NextResponse.json({ success: false, error: 'Total split amount does not match total payout' }, { status: 400 });
    }

    const entries = [];

    // Credit Source (Cash Out)
    entries.push({
      accountCode: sourceAccount,
      debit: 0,
      credit: totalAmount,
      description: `Payment to ${payee}`
    });

    // Debit Expenses (Split)
    details.forEach((item: any) => {
      entries.push({
        accountCode: item.coaCode,
        debit: item.amount,
        credit: 0,
        description: item.description
      });
    });

    await recordJournalEntry({
      date: date || new Date().toISOString(),
      refId: `EXP-${Date.now()}`,
      description: `Expense: ${payee}`,
      category: 'EXPENSE',
      entries,
      metadata: { proofImage, notes: `Payee: ${payee}` },
      status: status || 'posted'
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
