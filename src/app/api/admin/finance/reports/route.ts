import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { COA } from "@/lib/finance-types";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate'); // ISO String
    const endDate = searchParams.get('endDate'); // ISO String

    let query = db.collection('finance_ledger').orderBy('idx_date', 'desc');

    if (startDate) query = query.where('idx_date', '>=', startDate);
    if (endDate) query = query.where('idx_date', '<=', endDate);

    const snapshot = await query.get();

    // Aggregation Buckets
    const report = {
      revenue: { total: 0, breakdown: {} as Record<string, number> },
      cogs: { total: 0, breakdown: {} as Record<string, number> },
      opex: { total: 0, breakdown: {} as Record<string, number> },
      netProfit: 0
    };

    // Helper to get Account Name from COA Code
    // We construct a reverse lookup map manually or just iterate standard keys
    // For simplicity, we'll try to find the key in COA object
    const getAccountName = (code: string) => {
      for (const section of Object.values(COA)) {
        // section is like { CASH_BANK: '1-100', ... }
        for (const [key, val] of Object.entries(section)) {
          if (val === code) return key.replace(/_/g, ' ');
        }
      }
      return code;
    };

    // Chart Data Aggregation (Daily)
    const dailyStats: Record<string, { date: string, revenue: number, expenses: number, profit: number }> = {};

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const entries = data.entries || [];
      const dateKey = (data.idx_date || data.date || '').split('T')[0]; // YYYY-MM-DD

      if (!dateKey) return;

      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { date: dateKey, revenue: 0, expenses: 0, profit: 0 };
      }

      entries.forEach((entry: any) => {
        const code = entry.accountCode;
        if (!code) return;

        const debit = Number(entry.debit) || 0;
        const credit = Number(entry.credit) || 0;

        // REVENUE (4-xxx) - Credit Normal
        if (code.startsWith('4')) {
          const net = credit - debit;
          report.revenue.total += net;
          report.revenue.breakdown[code] = (report.revenue.breakdown[code] || 0) + net;
          dailyStats[dateKey].revenue += net;
        }

        // COGS (5-xxx) - Debit Normal
        else if (code.startsWith('5')) {
          const net = debit - credit;
          report.cogs.total += net;
          report.cogs.breakdown[code] = (report.cogs.breakdown[code] || 0) + net;
          dailyStats[dateKey].expenses += net;
        }

        // OPEX (6-xxx) - Debit Normal
        else if (code.startsWith('6')) {
          const net = debit - credit;
          report.opex.total += net;
          report.opex.breakdown[code] = (report.opex.breakdown[code] || 0) + net;
          dailyStats[dateKey].expenses += net;
        }
      });
    });

    report.netProfit = report.revenue.total - report.cogs.total - report.opex.total;

    // Calculate Daily Profit & Sort
    const chartData = Object.values(dailyStats).map(day => ({
      ...day,
      profit: day.revenue - day.expenses
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Enhance breakdown with names
    const enhanceBreakdown = (breakdown: Record<string, number>) => {
      return Object.entries(breakdown).map(([code, amount]) => ({
        code,
        name: getAccountName(code),
        amount
      })).sort((a, b) => b.amount - a.amount);
    };

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          revenue: report.revenue.total,
          cogs: report.cogs.total,
          opex: report.opex.total,
          netProfit: report.netProfit
        },
        chartData, // Time-series data
        details: {
          revenue: enhanceBreakdown(report.revenue.breakdown),
          cogs: enhanceBreakdown(report.cogs.breakdown),
          opex: enhanceBreakdown(report.opex.breakdown)
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
