
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { recordJournalEntry } from "./finance-service";
import { COA, JournalTransaction, TxBreakdownItem } from "./finance-types";

// --- TYPES ---
export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: 'consumable' | 'asset'; // Consumable (Shuttlecock) vs Asset (Net/Tiang)
  stock: number;
  unit: string;
  avgCost: number; // Average Cost per Unit
  lastRestockDate: string;
};

// --- SERVICES ---

/**
 * ADD NEW INVENTORY ITEM
 */
export async function addNewInventoryItem(
  name: string,
  category: 'consumable' | 'asset',
  unit: string,
  initialStock: number = 0,
  initialAvgCost: number = 0
) {
  const newItemRef = db.collection("inventory").doc();
  const newItem: InventoryItem = {
    id: newItemRef.id,
    name,
    sku: `SKU-${Date.now()}`, // Simple auto-SKU
    category,
    unit,
    stock: initialStock,
    avgCost: initialAvgCost,
    lastRestockDate: new Date().toISOString()
  };

  await newItemRef.set(newItem);

  // If initial stock > 0, record opening balance journal
  if (initialStock > 0 && initialAvgCost > 0) {
    const totalValue = initialStock * initialAvgCost;
    const entries = [
      {
        accountCode: COA.ASSETS.INVENTORY_GOODS, // 1-301
        debit: totalValue,
        credit: 0,
        description: `Opening Balance ${name}`
      },
      {
        accountCode: COA.EQUITY.OWNER_CAPITAL, // 3-100
        debit: 0,
        credit: totalValue,
        description: "Opening Inventory Capital"
      }
    ];

    const tx: JournalTransaction = {
      date: new Date().toISOString(),
      refId: `INIT-${newItemRef.id}`,
      description: `Opening Balance ${name}`,
      category: 'ASSET',
      entries: entries,
      status: 'posted'
    };
    await recordJournalEntry(tx);
  }

  return newItem;
}

/**
 * RESTOCK ITEM (Purchase Inventory)
 * - Updates Stock Qty & Avg Cost (Weighted Average)
 * - Creates Journal Entry (Cr Cash, Dr Inventory)
 * - Supports Landed Cost (Price + Shipping)
 */
export async function restockInventory(
  itemId: string,
  qty: number,
  unitPrice: number,
  shippingCost: number, // Ongkir
  source: string = 'Purchase',
  skipJournal: boolean = false
) {
  try {
    const itemRef = db.collection("inventory").doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) throw new Error("Item not found");

    const currentData = itemDoc.data() as InventoryItem;
    const currentStock = currentData.stock || 0;
    const currentAvg = currentData.avgCost || 0;

    // Calculate Landed Cost
    const totalGoodsPrice = qty * unitPrice;
    const totalLandedCost = totalGoodsPrice + shippingCost;
    const landedCostPerUnit = totalLandedCost / qty;

    // Calculate New Weighted Average Cost
    // (OldValuation + NewTotalLandedCost) / TotalQty
    const oldValuation = currentStock * currentAvg;
    const newValuation = oldValuation + totalLandedCost;
    const newTotalQty = currentStock + qty;
    const newAvgCost = newTotalQty > 0 ? newValuation / newTotalQty : 0;

    // 1. Update Inventory
    await itemRef.update({
      stock: newTotalQty,
      avgCost: newAvgCost,
      lastRestockDate: new Date().toISOString(),
      history: FieldValue.arrayUnion({
        date: new Date().toISOString(),
        qtyIn: qty,
        unitPrice: unitPrice,
        shipping: shippingCost,
        finalLandedCost: landedCostPerUnit,
        source: source
      })
    });

    // 2. Create Journal Entry (Purchase) - OPTIONAL
    if (!skipJournal) {
      // Dr Inventory (Asset)
      // Cr Cash
      const entries = [
        {
          accountCode: COA.ASSETS.INVENTORY_GOODS, // 1-300
          debit: totalLandedCost,
          credit: 0,
          description: `Restock ${currentData.name} (+Ongkir)`
        },
        {
          accountCode: COA.ASSETS.CASH_BANK, // 1-100
          debit: 0,
          credit: totalLandedCost,
          description: "Cash Payment"
        }
      ];

      const tx: JournalTransaction = {
        date: new Date().toISOString(),
        refId: `RESTOCK-${Date.now()}`,
        description: `Restock ${currentData.name} (${qty} x ${unitPrice} + ${shippingCost})`,
        category: 'ASSET',
        entries: entries,
        metadata: {
          notes: `Landed Cost: ${landedCostPerUnit}/unit`,
          breakdown: [
            { item: currentData.name, qty: qty, cost: unitPrice }, // Base Price
            { item: "Shipping Cost", qty: 1, cost: shippingCost } // Ongkir
          ] as TxBreakdownItem[]
        },
        status: 'posted'
      };

      await recordJournalEntry(tx);
    }

    return { success: true, newStock: newTotalQty, newAvg: newAvgCost, totalCost: totalLandedCost, itemName: currentData.name };



  } catch (error) {
    console.error("RESTOCK ERROR:", error);
    throw error;
  }
}

/**
 * CONSUME INVENTORY (Usage in Session)
 * - Reduces Stock
 * - Returns Cost for COGS Calculation
 */
export async function consumeInventory(itemId: string, qty: number) {
  const itemRef = db.collection("inventory").doc(itemId);
  const itemDoc = await itemRef.get();

  if (!itemDoc.exists) throw new Error("Item not found");
  const data = itemDoc.data() as InventoryItem;

  if ((data.stock || 0) < qty) {
    throw new Error(`Insufficient stock for ${data.name}. Available: ${data.stock}`);
  }

  const costOfGoods = qty * data.avgCost;

  // Update Stock
  await itemRef.update({
    stock: FieldValue.increment(-qty)
  });

  return { cost: costOfGoods, itemName: data.name };
}


/**
 * CLOSE SESSION (Calculate COGS & Profit)
 */
export async function closeSessionFinance(
  eventId: string,
  shuttlecockUsedQty: number,
  courtFee: number,
  coachFee: number,
  shuttlecockItemId: string // ID of the Shuttlecock item in Inventory
) {
  // 1. Consume Inventory (Shuttlecock)
  const { cost: shuttlecockCost, itemName } = await consumeInventory(shuttlecockItemId, shuttlecockUsedQty);

  // 2. Create COGS Journal
  const entries = [];

  // Debit COGS - Shuttlecock
  entries.push({
    accountCode: COA.COGS.SHUTTLECOCK_COST, // 5-200
    debit: shuttlecockCost,
    credit: 0,
    description: `Used ${shuttlecockUsedQty} ${itemName}`
  });
  // Credit Inventory
  entries.push({
    accountCode: COA.ASSETS.INVENTORY_GOODS, // 1-301
    debit: 0,
    credit: shuttlecockCost,
    description: "Inventory Usage"
  });

  // Debit COGS - Court
  entries.push({
    accountCode: COA.COGS.COURT_RENTAL, // 5-100
    debit: courtFee,
    credit: 0,
    description: "Court Rental Fee"
  });
  // Credit Cash
  entries.push({
    accountCode: COA.ASSETS.CASH_BANK, // 1-101
    debit: 0,
    credit: courtFee,
    description: "Court Payment"
  });

  // Debit COGS - Coach (if any)
  if (coachFee > 0) {
    entries.push({
      accountCode: COA.COGS.COACH_FEE, // 5-300
      debit: coachFee,
      credit: 0,
      description: "Coach Function Fee"
    });
    entries.push({
      accountCode: COA.LIABILITY.PAYABLE_SALARY_COMMISSION, // 2-101 (Accrual)
      debit: 0,
      credit: coachFee,
      description: "Hutang Fee Coach"
    });
  }

  // Prepare Metadata Breakdown
  const breakdownItems: TxBreakdownItem[] = [
    { item: "Shuttlecock Usage", qty: shuttlecockUsedQty, cost: shuttlecockCost },
    { item: "Court Rental", qty: 1, cost: courtFee },
  ];
  if (coachFee > 0) {
    breakdownItems.push({ item: "Coach Fee", qty: 1, cost: coachFee, recipient: "Coach" });
  }

  const tx: JournalTransaction = {
    date: new Date().toISOString(),
    refId: `CLOSE-${eventId}`,
    description: `Session Closing Cost (Event ${eventId})`,
    category: 'EXPENSE',
    entries: entries,
    metadata: {
      sessionId: eventId,
      breakdown: breakdownItems
    },
    status: 'posted'
  };

  await recordJournalEntry(tx);

  // 3. Mark Event as Closed
  await db.collection("events").doc(eventId).update({
    status: 'completed',
    isFinancialClosed: true,
    financialClosedAt: new Date().toISOString()
  });

  return { success: true };
}
