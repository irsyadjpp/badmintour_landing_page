import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    // Generate Order ID (Format: JSY-YYYYMMDD-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `JSY-${dateStr}-${randomSuffix}`;

    // Tentukan User ID (Jika login pakai ID, jika guest pakai 'public-guest')
    const userId = session?.user?.id || "public-guest";
    const userName = session?.user?.name || body.fullName || "Guest";

    const orderData = {
      orderId: orderId,
      userId: userId,
      userName: userName,
      userEmail: session?.user?.email || body.email || "-",
      items: body.items, // Array of { size, customName, quantity }
      totalPrice: body.totalPrice,
      status: "paid", // Asumsi langsung paid untuk MVP
      paymentMethod: "QRIS", // Mock
      createdAt: new Date().toISOString(),
      pickupStatus: "pending", // pending, picked_up
      whatsapp: body.whatsapp
    };

    // Simpan ke Firestore Collection 'jersey_orders'
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

// Tambahan: GET Method untuk mengambil order spesifik user (dipakai di Dashboard Member)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const snapshot = await db.collection("jersey_orders")
            .where("userId", "==", session.user.id)
            .orderBy("createdAt", "desc")
            .get();

        const orders = snapshot.docs.map(doc => doc.data());
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}
