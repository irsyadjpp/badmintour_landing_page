import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

// 1. GET ALL ORDERS (MEMBER + GUEST)
export async function GET(req: Request) {
  try {
    const allOrders: any[] = [];

    // A. Ambil dari GUEST (Collection: jersey_orders)
    const guestSnapshot = await db.collection("jersey_orders").get();
    guestSnapshot.forEach((doc) => {
      allOrders.push({
        id: doc.id,
        type: 'GUEST',
        ...doc.data()
      });
    });

    // B. Ambil dari MEMBER (Collection: users -> field jerseyOrder)
    // Note: Idealnya query where('jerseyOrder', '!=', null), tapi di Firestore perlu index. 
    // Untuk simpel, kita ambil user yang punya field jerseyOrder.
    const memberSnapshot = await db.collection("users").get();
    memberSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.jerseyOrder) {
        allOrders.push({
          id: `MEM-${doc.id}`, // Fake ID untuk tabel
          realUserId: doc.id,  // ID asli untuk update
          type: 'MEMBER',
          ...data.jerseyOrder
        });
      }
    });

    // Sort by Date (Terbaru diatas)
    allOrders.sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());

    return NextResponse.json({ success: true, data: allOrders });

  } catch (error) {
    console.error("[ADMIN_JERSEY_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2. UPDATE STATUS PESANAN
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, type, status, realUserId } = body; // id = docId, type = GUEST/MEMBER

        if (!status) return NextResponse.json({ error: "Status required" }, { status: 400 });

        if (type === 'GUEST') {
            await db.collection("jersey_orders").doc(id).update({ status });
        } else if (type === 'MEMBER' && realUserId) {
            // Update field nested di dalam user
            await db.collection("users").doc(realUserId).update({
                "jerseyOrder.status": status
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_JERSEY_UPDATE]", error);
        return NextResponse.json({ error: "Update Failed" }, { status: 500 });
    }
}
