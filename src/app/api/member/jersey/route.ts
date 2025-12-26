import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    // Destructure field baru
    const { 
        size, 
        backName, // Nama Punggung (Max 12 Char)
        fullName, // Nama Lengkap Pemesan
        senderPhone,
        quantity 
    } = body;

    // Validasi Kelengkapan
    if (!size || !backName || !fullName || !senderPhone) {
      return NextResponse.json({ error: "Data tidak lengkap. Nama Lengkap, Nama Punggung, WA, dan Size wajib diisi." }, { status: 400 });
    }

    // Validasi Server-Side untuk Nama Punggung (Double Check)
    if (backName.length > 12 || !/^[A-Z\s]+$/.test(backName)) {
        return NextResponse.json({ error: "Format Nama Punggung salah (Max 12 Huruf, A-Z)." }, { status: 400 });
    }

    const orderData = {
      size,
      backName,      // Field khusus cetak jersey
      senderName: fullName, // Field admin/logistik
      clubName: 'BADMINTOUR',
      senderPhone,
      quantity: quantity || 1,
      orderedAt: new Date().toISOString(),
      status: "pending",
      season: "Season 1 - 2026",
      isMember: !!session?.user?.id,
      userId: session?.user?.id || null
    };

    // SKENARIO 1: MEMBER (Login) -> Update Profile
    if (session?.user?.id) {
        await db.collection("users").doc(session.user.id).update({
            jerseyOrder: orderData
        });
    }

    // SKENARIO 2: PUBLIC / ALL -> Simpan ke Central Orders
    // Gunakan senderPhone sebagai unik ID sementara jika guest
    const orderId = `ORD-${Date.now()}-${senderPhone.slice(-4)}`;
    await db.collection("jersey_orders").doc(orderId).set(orderData);

    return NextResponse.json({ success: true, message: "Pesanan berhasil disimpan", orderId });

  } catch (error) {
    console.error("[JERSEY_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    // Jika tidak login, kembalikan null order
    if (!session?.user?.id) {
        return NextResponse.json({ order: null });
    }

    try {
        const doc = await db.collection("users").doc(session.user.id).get();
        const data = doc.data();
        
        return NextResponse.json({ order: data?.jerseyOrder || null });
    } catch (error) {
        console.error("[JERSEY_GET_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
