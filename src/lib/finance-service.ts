
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { COA } from "./finance-types";
import type { JournalTransaction, LedgerEntry } from "./finance-types";

// Re-export for legacy compatibility
export { COA };
export type { JournalTransaction, LedgerEntry };

/**
 * Record a financial transaction to the General Ledger.
 */
export async function recordJournalEntry(transaction: JournalTransaction) {
  try {
    // 1. Validate Balance (Debit must equal Credit)
    const totalDebit = transaction.entries.reduce((acc, curr) => acc + curr.debit, 0);
    const totalCredit = transaction.entries.reduce((acc, curr) => acc + curr.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 1) { // Tolerance 1 for rounding
      throw new Error(`Journal Unbalanced: Debit ${totalDebit} vs Credit ${totalCredit}`);
    }

    // 2. Create Ledger Entry
    const ledgerRef = db.collection("finance_ledger").doc();

    await ledgerRef.set({
      id: ledgerRef.id,
      ...transaction,
      idx_date: transaction.date, // For indexing/sorting
      createdAt: FieldValue.serverTimestamp(),
      totalAmount: totalDebit // Helper for quick stats
    });

    console.log(`[FINANCE] Journal Entry Recorded: ${ledgerRef.id}`);
    return ledgerRef.id;

  } catch (error) {
    console.error("[FINANCE] Error recording journal:", error);
    throw error;
  }
}

/**
 * Helper to auto-generate Revenue Journal from a Booking
 */
export async function createBookingJournal(booking: any, eventType: string) {
  const amount = booking.price;
  const platformFee = 1000; // Hardcoded Admin Fee logic for now
  const gatewayFee = 500; // Estimated Gateway Fee (should be from payment provider)

  // Net Revenue = Total - Platform Fee (which is separate revenue) - Gateway Fee (Expense)
  // Logic: 
  // User Pays Total (e.g. 65.000)
  // 1-100 (Gateway Cash) Debit 65.000
  // 4-XXX (Revenue) Credit 63.500
  // 4-500 (Platform Fee) Credit 1.000
  // 5-400 (Gateway Fee/Expense) Debit 500 ?? Wait.
  // Proper Accounting for Fees deducted at source (Net Settlement):
  // Gross booking: 65,000
  // Money hitting bank: 64,500 (assuming 500 fee)

  // Let's stick to the User Request simulation:
  // "Potongan Midtrans" is Expense (5-400).
  // Cash In (1-101) = 65,000 (Gross Claim)
  // But wait, if we record Expense 5-400, we must Credit Cash 1-101.

  // SIMPLIFIED APPROACH (As per User Req Table):
  // Entry 1: Income
  // Dr 1-101 Cash Bank     65,000
  // Cr 4-200 Mabar Revenue 65,000

  // Entry 2: Expense (Fee)
  // Dr 5-400 Gateway Fee   500
  // Cr 1-101 Cash Bank     500

  // Or Combined:
  // Dr 1-101 Cash Gateway  64,500
  // Dr 5-400 Gateway Fee   500
  // Cr 4-100 Revenue       64,000
  // Cr 4-500 Platform Fee  1,000

  let revenueAccount = COA.REVENUE.MABAR; // Default
  if (eventType === 'drilling') revenueAccount = COA.REVENUE.DRILLING;
  if (eventType === 'tournament') revenueAccount = COA.REVENUE.MABAR; // Fallback or add new code if needed

  const entries: LedgerEntry[] = [];

  // 1. Record Gross Income (Cash in Bank 1-101 or Gateway 1-102)
  // User list has 1-101 (Bank) and 1-102 (Gateway). Let's use 1-102 for online payments.
  entries.push({
    accountCode: COA.ASSETS.CASH_PAYMENT_GATEWAY, // 1-102
    debit: amount,
    credit: 0,
    description: "Gross Payment Received"
  });

  // 2. Record Revenue
  // We will lump the full amount into Revenue for simplicity unless Platform Fee code exists.
  // User list stops at 4-400. 
  // We will just Credit Revenue with full amount.
  entries.push({
    accountCode: revenueAccount,
    debit: 0,
    credit: amount,
    description: `Ticket Revenue`
  });

  // 3. Record Gateway Expense
  // But wait, if we Credited Revenue 65k total above, we are balanced.
  // Now we need to handle the Gateway Fee COST.
  // The fee reduces our Cash.

  // So:
  // Dr 5-400 Gateway Fee 500
  // Cr 1-101 Cash Gateway 500

  entries.push({
    accountCode: COA.COGS.GATEWAY_FEE, // 5-400
    debit: gatewayFee,
    credit: 0,
    description: "Midtrans Fee (Est)"
  });

  entries.push({
    accountCode: COA.ASSETS.CASH_PAYMENT_GATEWAY, // Reduce Cash 1-102
    debit: 0,
    credit: gatewayFee,
    description: "Fee Deduction"
  });

  entries.push({
    accountCode: COA.ASSETS.CASH_PAYMENT_GATEWAY, // Reduce Cash
    debit: 0,
    credit: gatewayFee,
    description: "Fee Deduction"
  });

  // Final Check:
  // Debit: 65,000 (Cash) + 500 (Fee) = 65,500
  // Credit: 64,000 (Rev) + 1,000 (Fee) + 500 (Cash Out) = 65,500
  // Balanced.

  const tx: JournalTransaction = {
    date: new Date().toISOString(),
    refId: booking.bookingCode || booking.id, // Use human readable Code if avail
    description: `Booking ${booking.bookingCode} - ${booking.userName}`,
    category: 'REVENUE',
    entries: entries,
    status: 'posted'
  };

  return await recordJournalEntry(tx);
}
