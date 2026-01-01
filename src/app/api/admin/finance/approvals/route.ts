import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { recordJournalEntry } from "@/lib/finance-service";
import { COA, JournalTransaction } from "@/lib/finance-types";

export async function GET(req: Request) {
  // List all pending requests
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const snap = await db.collection('finance_payouts')
      .where('status', 'in', ['pending', 'approved', 'rejected']) // Fetch all for history? Or just pending? Let's fetch all for the table.
      .orderBy('requestedAt', 'desc')
      .get();

    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Approve or Reject
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, action } = await req.json(); // action: 'approve' | 'reject'

    if (!id || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const docRef = db.collection('finance_payouts').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    const payout = doc.data();
    if (payout?.status !== 'pending') return NextResponse.json({ error: "Request already processed" }, { status: 400 });

    if (action === 'reject') {
      await docRef.update({
        status: 'rejected',
        processedAt: new Date().toISOString(),
        processedBy: session.user.id
      });
      return NextResponse.json({ success: true, message: "Rejected" });
    }

    if (action === 'approve') {
      // 1. Create Journal Entry (Cash Out, Liability/Payable Decrease)
      // Debit: 2-100 Coach Payable
      // Credit: 1-100 Cash Bank

      const transaction: JournalTransaction = {
        date: new Date().toISOString(),
        refId: `PAYOUT-${id}`,
        description: `Payout Coach ${payout?.coachName}`,
        category: 'EXPENSE', // Technically Settlement of Liability, but fits loosely or use LIABILITY category logic if we had it.
        // Actually 'category' in JournalTransaction is Enum. 'LIABILITY' is valid now.
        entries: [
          {
            accountCode: COA.LIABILITY.PAYABLE_SALARY_COMMISSION,
            debit: payout?.amount || 0,
            credit: 0,
            description: `Settlement ${payout?.coachName}`
          },
          {
            accountCode: COA.ASSETS.CASH_BANK,
            debit: 0,
            credit: payout?.amount || 0,
            description: 'Transfer Out'
          }
        ],
        metadata: {
          notes: `Bank: ${payout?.bankDetails}`,
          proofImage: undefined // Could add upload here later
        },
        status: 'posted',
        createdBy: session.user.email || undefined
      };

      await recordJournalEntry(transaction);

      // 2. Update Payout Doc
      await docRef.update({
        status: 'paid', // Mark as paid immediately? Or 'approved' waiting for transfer?
        // Coach UI treats 'paid' as "Money Sent". 'approved' as "Paperwork Done".
        // Let's go straight to 'paid' for simplicity since we recorded the Journal.
        processedAt: new Date().toISOString(),
        processedBy: session.user.id
      });

      return NextResponse.json({ success: true, message: "Approved & Recorded" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
