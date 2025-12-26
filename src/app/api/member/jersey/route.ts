import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

// 1. POST: Simpan Order Baru
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    // Generate Order ID Unik (JSY-YYYYMMDD-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `JSY-${dateStr}-${randomSuffix}`;

    // Identifikasi User (Member atau Guest)
    const userId = session?.user?.id || "public-guest";
    const userEmail = session?.user?.email || "guest@badmintour.com";

    const orderData = {
      orderId: orderId,
      userId: userId,
      type: session ? 'MEMBER' : 'GUEST',
      
      // Data Barang
      fullName: body.fullName,
      backName: body.backName,
      size: body.size,
      quantity: body.quantity,
      senderPhone: body.senderPhone,
      
      // Status & System
      status: "pending", // pending -> paid -> processing -> shipped
      totalPrice: (Math.max(0, body.quantity - 1)) * 150000, // Rumus: (Qty - 1) * 150k
      orderedAt: new Date().toISOString(),
      pickupStatus: "pending"
    };

    // Simpan ke Firestore
    await db.collection("jersey_orders").doc(orderId).set(orderData);

    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      message: "Order berhasil disimpan" 
    });

  } catch (error) {
    console.error("Order Jersey Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// 2. GET: Ambil Order User Login (Untuk Member Dashboard)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const snapshot = await db.collection("jersey_orders")
            .where("userId", "==", session.user.id)
            .orderBy("orderedAt", "desc")
            .get();

        const orders = snapshot.docs.map(doc => doc.data());
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
    }
}
