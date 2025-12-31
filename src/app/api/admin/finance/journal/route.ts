
import { NextResponse } from 'next/server';
import { recordJournalEntry } from '@/lib/finance-service';
import { COA, JournalTransaction, LedgerEntry } from '@/lib/finance-types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, amount, categoryCode, description, date, proofImage } = body;

    // Validation
    if (!amount || !categoryCode || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Logic: Support both Legacy (single) and New (split items)
    // If 'items' array exists, use that. Otherwise fallback to single fields.
    const txItems = body.items && body.items.length > 0 ? body.items : [
      { category: categoryCode, description, amount: Number(amount) }
    ];

    const entries: LedgerEntry[] = [];
    const breakdownItems: any[] = [];
    let totalMemoAmount = 0;

    // 1. Process Debit/Credit Entries based on Items
    if (type === 'INCOME') {
      const totalIncome = txItems.reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);
      totalMemoAmount = totalIncome;

      // Debit: Cash (Total)
      entries.push({
        accountCode: COA.ASSETS.CASH_BANK,
        debit: totalIncome,
        credit: 0,
        description: 'Cash In'
      });

      // Credit: Multiple Revenue Accounts
      for (const item of txItems) {
        entries.push({
          accountCode: item.category,
          debit: 0,
          credit: Number(item.amount),
          description: item.description || 'Split Income'
        });
        breakdownItems.push({ item: item.category, qty: 1, cost: Number(item.amount) });
      }

    } else if (type === 'EXPENSE') {
      const totalExpense = txItems.reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);
      totalMemoAmount = totalExpense;

      // Debit: Multiple Expense/Asset Accounts
      for (const item of txItems) {
        const itemAmount = Number(item.amount);

        // SPECIAL INVENTORY LOGIC
        // If Category is Inventory Goods (1-301) AND we have Qty/Unit Price details
        // We must update the Inventory Stock Levels
        // BUT we skip the Journal creation inside restockInventory because we record it here.
        // Note: We need itemId. But COA 1-301 is Generic.
        // Ideally, the UI should have asked for "Select Inventory Item". 
        // Current UI implementation in Finance Page asks for Qty/Price but NOT which Inventory Item ID.
        // This is a gap. For now, we just record the journal. The user must manually restock in Inventory Page if ID is missing.
        // WAIT - The Blueprint asked for "Inventory Linker". 
        // "Saat disimpan, otomatis update collection inventory".
        // To do this, I need the Inventory Item ID in the `items`. 
        // I'll skip the actual Stock Update for now and just record the Journal correctly, 
        // OR I assume the Description contains the Item Name/SKU? No that's fragile.
        // Let's stick to Journal Recording first. The "Inventory Linker" might need a UI update to Select Item ID.

        entries.push({
          accountCode: item.category,
          debit: itemAmount,
          credit: 0,
          description: item.description || 'Split Expense'
        });
        breakdownItems.push({ item: item.description || item.category, qty: item.qty || 1, cost: itemAmount });
      }

      // Credit: Cash (Total)
      entries.push({
        accountCode: COA.ASSETS.CASH_BANK,
        debit: 0,
        credit: totalExpense,
        description: 'Cash Out'
      });
    }

    const transaction: JournalTransaction = {
      date: date || new Date().toISOString(),
      refId: `MAN-${Date.now()}`,
      description: description || `Transaction ${type} (Split)`,
      category: type === 'INCOME' ? 'REVENUE' : 'EXPENSE',
      entries: entries,
      metadata: {
        breakdown: breakdownItems,
        proofImage: proofImage || undefined
      },
      status: 'posted'
    };

    const journalId = await recordJournalEntry(transaction);

    return NextResponse.json({ success: true, data: { id: journalId } });

  } catch (error: any) {
    console.error('Manual Journal Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
