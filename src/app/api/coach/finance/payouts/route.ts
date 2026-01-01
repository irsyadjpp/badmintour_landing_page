import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { PayoutRequest } from "@/lib/finance-types";

export async function GET(req: Request) {
  // List my payouts
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'COACH') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const snap = await db.collection('finance_payouts')
      .where('coachId', '==', session.user.id)
      .orderBy('requestedAt', 'desc')
      .get();

    const payouts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: payouts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Request a payout
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'COACH') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { amount, bankDetails, notes } = await req.json();

    if (!amount || amount < 10000) {
      return NextResponse.json({ error: "Minimum withdrawal is Rp 10.000" }, { status: 400 });
    }

    // Optional: Check balance again before allowing request. 
    // We'll trust the UI check + Admin review for now, or implement strict check if we had shared logic.

    const newPayout: Omit<PayoutRequest, 'id'> = {
      coachId: session.user.id,
      coachName: session.user.name || "Coach",
      amount: Number(amount),
      status: 'pending',
      bankDetails: bankDetails || "Default Bank",
      notes: notes || "",
      requestedAt: new Date().toISOString()
    };

    const docRef = await db.collection('finance_payouts').add(newPayout);

    return NextResponse.json({ success: true, message: "Request submitted", data: { id: docRef.id } });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
