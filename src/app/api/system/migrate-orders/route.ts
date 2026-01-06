import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Auth Check (Superadmin & Admin)
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    console.log("[MIGRATION] Starting Jersey Orders Migration...");

    // 2. Fetch Old Orders
    const snapshot = await db.collection("jersey_orders").get();
    if (snapshot.empty) {
      return NextResponse.json({ message: "No jersey orders found to migrate." });
    }

    let count = 0;
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      const data = doc.data();

      // 3. Transform Data
      const newOrderRef = db.collection("orders").doc(doc.id); // Keep same ID

      const newOrderData = {
        id: doc.id,
        type: 'jersey',
        userId: data.userId || 'guest',
        userName: data.fullName || 'Guest',
        userPhone: data.senderPhone || '',

        // Unified Item Structure
        items: [
          {
            name: 'Jersey Custom Season 1',
            quantity: data.quantity || 1,
            price: 150000,
            variant: `${data.size} - ${data.backName}`,
            metadata: {
              size: data.size,
              backName: data.backName
            }
          }
        ],

        totalPrice: data.totalPrice,
        status: data.status, // paid, pending

        // Specific/Legacy Metadata
        metadata: {
          orderedAt: data.orderedAt,
          season: data.season,
          pickupStatus: data.pickupStatus,
          originalCollection: 'jersey_orders'
        },

        createdAt: data.orderedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      batch.set(newOrderRef, newOrderData);
      count++;
    });

    // 4. Commit
    await batch.commit();

    console.log(`[MIGRATION] Successfully migrated ${count} jersey orders.`);

    return NextResponse.json({
      success: true,
      migrated: count,
      message: "Migration completed. Please verify data in 'orders' collection."
    });

  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
