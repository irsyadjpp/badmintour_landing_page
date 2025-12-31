
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    // In a real app, filters (startDate, endDate) would be passed here.
    // For MVP, we fetch ALL and aggregate (or limit to current month).

    const snapshot = await db.collection("finance_ledger")
      .orderBy("idx_date", "desc")
      .limit(500) // Safety limit for MVP
      .get();

    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalOpex = 0;

    // Breakdown by Category
    const breakdown: Record<string, number> = {};

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const entries = data.entries || [];

      entries.forEach((entry: any) => {
        const code = entry.accountCode || '';
        const amount = (entry.credit || 0) + (entry.debit || 0); // Simplified magnitude

        // REVENUE (4-XXX) - Normal Balance Credit
        if (code.startsWith('4-')) {
          // For Revenue, Credit adds, Debit subtracts
          const val = (entry.credit || 0) - (entry.debit || 0);
          totalRevenue += val;
        }
        // COGS (5-XXX) - Normal Balance Debit
        else if (code.startsWith('5-')) {
          const val = (entry.debit || 0) - (entry.credit || 0);
          totalCOGS += val;
        }
        // OPEX (6-XXX) - Normal Balance Debit
        else if (code.startsWith('6-')) {
          const val = (entry.debit || 0) - (entry.credit || 0);
          totalOpex += val;
        }
      });
    });

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalOpex;

    return NextResponse.json({
      success: true,
      data: {
        revenue: totalRevenue,
        cogs: totalCOGS,
        opex: totalOpex,
        grossProfit,
        netProfit,
        period: "All Time (Last 500 Trx)"
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
