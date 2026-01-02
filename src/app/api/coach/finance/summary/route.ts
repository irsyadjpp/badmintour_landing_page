import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { COA } from "@/lib/finance-types";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'coach') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachId = session.user.id;
    // In a real app, strict filtering by coachId in metadata is required.
    // For Phase 1, we might need to assume how we link ledger to coach.
    // We look for Journal Entries where account matches COACH_FEE and metadata includes coachId.

    // 1. Calculate Total Earned (Gross)
    // Query finance_ledger where entries contain '5-300' (COACH_FEE)
    // Optimization: Create a composite index or just fetch recent docs if filtering is hard.
    // For MVP, since we don't have many records, we'll fetch all '5-300' entries and filter JS side.
    // Ideally: db.collection('finance_ledger').where('metadata.recipientId', '==', coachId).get()

    const ledgerSnapshot = await db.collection('finance_ledger')
      // .where('metadata.recipientId', '==', coachId) // Future optimization
      .orderBy('date', 'desc')
      .get();

    let totalEarned = 0;
    const transactions: any[] = [];

    ledgerSnapshot.docs.forEach(doc => {
      const data = doc.data();
      // Check if this transaction relates to the Coach
      // This logic depends on how we decided to store 'recipient' in metadata.
      // Current assumption: metadata.breakdown[].recipient might store it, or metadata.sessionId -> session -> coachId.
      // For now, let's look for a generic marker or just return 0 if no explicit link found.
      // BUT, to allow testing, let's assume if the description contains the Coach Name (from session) it matches.
      // Robust way: We will enforce 'metadata.relatedUsers' array in future.

      // Temporary Logic for Demo:
      // Filter locally if we find a matching breakdown item
      const isRelated = data.metadata?.breakdown?.some((item: any) => item.recipient === session.user.name || item.recipient === coachId)
        || data.description.includes(session.user.name || 'Unknown');

      if (isRelated) {
        // Find the amount credited/debited to Coach Fee
        const feeEntry = data.entries.find((e: any) => e.accountCode === COA.COGS.COACH_FEE);
        if (feeEntry) {
          totalEarned += (feeEntry.debit || 0); // 5-300 Debit = Expense for Company = Earning for Coach
          transactions.push({
            id: doc.id,
            date: data.date,
            description: data.description,
            amount: feeEntry.debit,
            type: 'EARNING'
          });
        }
      }
    });

    // 2. Calculate Payouts (Withdrawals)
    const payoutsSnapshot = await db.collection('finance_payouts')
      .where('coachId', '==', coachId)
      .get();

    let totalPaid = 0;
    let pendingClearance = 0;

    payoutsSnapshot.docs.forEach(doc => {
      const p = doc.data();
      if (p.status === 'paid') {
        totalPaid += p.amount;
        transactions.push({
          id: doc.id,
          date: p.requestedAt,
          description: 'Withdrawal Processed',
          amount: -p.amount,
          type: 'WITHDRAWAL',
          status: 'paid'
        });
      } else if (p.status === 'pending' || p.status === 'approved') {
        pendingClearance += p.amount;
        transactions.push({
          id: doc.id,
          date: p.requestedAt,
          description: 'Withdrawal Pending',
          amount: -p.amount,
          type: 'WITHDRAWAL',
          status: p.status
        });
      }
    });

    const availableBalance = totalEarned - totalPaid - pendingClearance; // Pending is deducted from available? Or just blocked? Usually Available = Earned - Paid. Pending is subset of Available that is locked. 
    // Let's say Available = (Earned - Paid) - PendingRequests. 
    // So user cannot double withdraw.

    // Sort combined transactions
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: {
        balance: availableBalance,
        totalEarned,
        pendingClearance, // Shown separately
        history: transactions
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
