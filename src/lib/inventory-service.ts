
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { recordJournalEntry } from "./finance-service";
import { COA, JournalTransaction, TxBreakdownItem } from "./finance-types";

// --- TYPES ---
export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: 'consumable' | 'asset';
  stock: number;
  unit: string;
  avgCost: number; // For Inventory: Avg Cost. For Asset: Acquisition Cost.

  // Asset Specifics
  purchaseDate?: string;
  usefulLife?: number; // Months
  residualValue?: number; // IDR
  location?: string;
  condition?: 'new' | 'used' | 'damaged';
  supplier?: string;

  lastRestockDate: string;
};

export type UsagePurpose = 'session' | 'sales' | 'maintenance' | 'gift' | 'loss';

// --- SERVICES ---

/**
 * ADD NEW INVENTORY ITEM (Basic)
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
    sku: `SKU-${Date.now()}`,
    category,
    unit,
    stock: initialStock,
    avgCost: initialAvgCost,
    lastRestockDate: new Date().toISOString()
  };

  await newItemRef.set(newItem);
  return newItem;
}

/**
 * REGISTER NEW ASSET (Capex)
 */
export async function registerAsset(
  name: string,
  category: string, // Equipment, Electronic, Furniture
  purchaseDate: string,
  price: number,
  usefulLife: number, // Months
  residualValue: number,
  location: string,
  condition: 'new' | 'used',
  proofImage?: string
) {
  const newItemRef = db.collection("inventory").doc();
  const newItem: InventoryItem = {
    id: newItemRef.id,
    name,
    sku: `AST-${Date.now()}`,
    category: 'asset',
    stock: 1, // Assets are usually tracked individually or small qty
    unit: 'Unit',
    avgCost: price, // Acquisition Cost
    purchaseDate,
    usefulLife,
    residualValue,
    location,
    condition,
    lastRestockDate: new Date().toISOString()
  };

  await newItemRef.set(newItem);

  // Journal Entry: Debit Fixed Asset, Credit Cash/Payable
  const entries = [
    {
      accountCode: COA.ASSETS.FIXED_ASSET_EQUIPMENT, // 1-401
      debit: price,
      credit: 0,
      description: `Asset Purchase: ${name}`
    },
    {
      accountCode: COA.ASSETS.CASH_BANK, // 1-101 (Assume Cash for now, or make dynamic)
      debit: 0,
      credit: price,
      description: "Asset Payment"
    }
  ];

  await recordJournalEntry({
    date: purchaseDate,
    refId: `AST-${newItemRef.id}`,
    description: `Capex: ${name}`,
    category: 'ASSET',
    entries,
    metadata: { proofImage },
    status: 'posted'
  });

  return newItem;
}

/**
 * RESTOCK ITEM (Purchase Inventory)
 */
export async function restockInventory(
  itemId: string,
  qty: number,
  unitPrice: number,
  shippingCost: number,
  source: string = 'Purchase',
  sourceOfFund: 'cash' | 'payable' | 'reimburse' = 'cash',
  supplier: string = '',
  notes: string = '',
  proofImage: string = ''
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

    // Weighted Average Calculation
    const oldValuation = currentStock * currentAvg;
    const newValuation = oldValuation + totalLandedCost;
    const newTotalQty = currentStock + qty;
    const newAvgCost = newTotalQty > 0 ? newValuation / newTotalQty : 0;

    // 1. Update Inventory
    await itemRef.update({
      stock: newTotalQty,
      avgCost: newAvgCost,
      lastRestockDate: new Date().toISOString(),
      supplier: supplier, // Update latest supplier
      history: FieldValue.arrayUnion({
        date: new Date().toISOString(),
        qtyIn: qty,
        unitPrice: unitPrice,
        shipping: shippingCost,
        finalLandedCost: landedCostPerUnit,
        source,
        supplier,
        notes
      })
    });

    // 2. Journal Entry
    let creditAccount = COA.ASSETS.CASH_BANK; // 1-101
    if (sourceOfFund === 'payable') creditAccount = COA.LIABILITY.PAYABLE_SALARY_COMMISSION; // Placeholder for AP
    if (sourceOfFund === 'reimburse') creditAccount = COA.LIABILITY.PAYABLE_REIMBURSEMENT; // 2-103

    const entries = [
      {
        accountCode: COA.ASSETS.INVENTORY_GOODS, // 1-301
        debit: totalLandedCost,
        credit: 0,
        description: `Restock ${currentData.name}`
      },
      {
        accountCode: creditAccount,
        debit: 0,
        credit: totalLandedCost,
        description: `Payment via ${sourceOfFund}`
      }
    ];

    await recordJournalEntry({
      date: new Date().toISOString(),
      refId: `PUR-${Date.now()}`,
      description: `Purchase: ${currentData.name} (${qty} ${currentData.unit})`,
      category: 'ASSET',
      entries,
      metadata: {
        notes: `Landed Cost: ${landedCostPerUnit}/unit. ${notes}`,
        proofImage,
        breakdown: [
          { item: currentData.name, qty, cost: unitPrice },
          { item: "Shipping", qty: 1, cost: shippingCost }
        ] as TxBreakdownItem[]
      },
      status: 'posted'
    });

    return { success: true };

  } catch (error) {
    console.error("RESTOCK ERROR:", error);
    throw error;
  }
}

/**
 * CONSUME INVENTORY (Internal Usage for Session)
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
 * USAGE / STOCK OUT (Manual Form)
 */
export async function recordUsage(
  itemId: string,
  qty: number,
  purpose: UsagePurpose,
  notes: string = ''
) {
  const itemRef = db.collection("inventory").doc(itemId);
  const itemDoc = await itemRef.get();
  if (!itemDoc.exists) throw new Error("Item not found");

  const data = itemDoc.data() as InventoryItem;
  if (data.stock < qty) throw new Error(`Insufficient stock. Available: ${data.stock}`);

  const totalValue = qty * data.avgCost; // Cost of Goods Sold/Used

  // Update Stock
  await itemRef.update({
    stock: FieldValue.increment(-qty)
  });

  // Determine Expense Account based on purpose
  let expenseAccount = COA.COGS.SHUTTLECOCK_COST; // Default
  if (purpose === 'sales') expenseAccount = COA.COGS.SHUTTLECOCK_COST; // COGS
  if (purpose === 'maintenance') expenseAccount = COA.OPEX.MAINTENANCE; // 6-XXX
  if (purpose === 'gift') expenseAccount = COA.OPEX.MARKETING; // 6-XXX (Promotion)
  if (purpose === 'loss') expenseAccount = COA.OPEX.OTHER;

  const entries = [
    {
      accountCode: expenseAccount,
      debit: totalValue,
      credit: 0,
      description: `Usage: ${purpose} - ${data.name}`
    },
    {
      accountCode: COA.ASSETS.INVENTORY_GOODS, // 1-301
      debit: 0,
      credit: totalValue,
      description: "Inventory Reduction"
    }
  ];

  await recordJournalEntry({
    date: new Date().toISOString(),
    refId: `USE-${Date.now()}`,
    description: `Usage: ${data.name} (${qty} ${data.unit})`,
    category: 'EXPENSE',
    entries,
    metadata: { notes: `${purpose}: ${notes}` },
    status: 'posted'
  });

  return { success: true };
}

/**
 * STOCK OPNAME (Adjustment)
 */
export async function performOpname(
  itemId: string,
  actualQty: number,
  reason: string
) {
  const itemRef = db.collection("inventory").doc(itemId);
  const itemDoc = await itemRef.get();
  const data = itemDoc.data() as InventoryItem;

  const systemQty = data.stock;
  const variance = actualQty - systemQty;
  const varianceValue = Math.abs(variance) * data.avgCost;

  if (variance === 0) return { success: true, message: "No variance" };

  // Update Stock
  await itemRef.update({ stock: actualQty });

  // Record Journal for Variance
  // If Variance < 0 (Missing), Dr Expense (Loss), Cr Inventory
  // If Variance > 0 (Found), Dr Inventory, Cr Other Income
  const entries = [];

  if (variance < 0) { // LOSS
    entries.push({
      accountCode: COA.OPEX.OTHER, // Adjust to Loss account
      debit: varianceValue,
      credit: 0,
      description: `Stock Opname Loss: ${data.name}`
    });
    entries.push({
      accountCode: COA.ASSETS.INVENTORY_GOODS,
      debit: 0,
      credit: varianceValue,
      description: "Inventory Deduction"
    });
  } else { // GAIN
    entries.push({
      accountCode: COA.ASSETS.INVENTORY_GOODS,
      debit: varianceValue,
      credit: 0,
      description: "Inventory Addition"
    });
    entries.push({
      accountCode: COA.OPEX.OTHER, // Or Other Income
      debit: 0,
      credit: varianceValue,
      description: `Stock Opname Gain: ${data.name}`
    });
  }

  await recordJournalEntry({
    date: new Date().toISOString(),
    refId: `OPN-${Date.now()}`,
    description: `Opname: ${data.name} (Var: ${variance})`,
    category: 'EXPENSE', // or ADJUSTMENT
    entries,
    metadata: { notes: `Reason: ${reason}` },
    status: 'posted'
  });

  return { success: true };
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
