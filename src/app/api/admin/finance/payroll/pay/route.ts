import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { recordJournalEntry, COA } from '@/lib/finance-service';
import type { JournalTransaction } from '@/lib/finance-types';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, amount, coachId, coachName, description } = body;

    if (!sessionId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create Journal Entry (Expense)
    // Dr 5-100 (Coach Salary/Fee)
    // Cr 1-100 (Cash on Hand) -- Assuming paid immediately via Cash/Transfer

    // In a more complex system, we might Credit "2-200 Wages Payable" first, then settle later.
    // For simplicity: Cash Basis. Paid immediately.

    const tx: JournalTransaction = {
      date: new Date().toISOString(),
      refId: sessionId,
      description: description || `Coach Fee for Event ${sessionId}`,
      category: 'EXPENSE',
      status: 'posted',
      entries: [
        {
          accountCode: COA.COGS.COACH_FEE || '5-200', // Assuming 5-200 is Coach Fee
          debit: amount,
          credit: 0,
          description: `Fee for ${coachName}`
        },
        {
          accountCode: COA.ASSETS.CASH_BANK, // Defaulting to BCA for payout
          debit: 0,
          credit: amount,
          description: "Transfer Out"
        }
      ],
      metadata: {
        coachId: coachId,
        eventId: sessionId,
        type: 'PAYROLL_GENERATED',
        status: 'posted'
      }
    };

    await recordJournalEntry(tx);

    // 2. Update Event as Paid
    await adminDb.collection('events').doc(sessionId).update({
      isCoachPaid: true,
      coachFeePaidAt: new Date().toISOString(),
      coachFeeAmount: amount
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Payroll Pay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
