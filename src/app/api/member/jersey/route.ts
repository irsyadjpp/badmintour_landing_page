import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { size, customName, clubName, senderName, senderPhone } = body;

    if (!size || !customName || !senderName || !senderPhone) {
      return NextResponse.json({ error: "Data tidak lengkap (Nama/WA/Size/Custom Name wajib)" }, { status: 400 });
    }

    const orderData = {
      size,
      customName,
      clubName: clubName || "-",
      senderName,
      senderPhone,
      orderedAt: new Date().toISOString(),
      status: "pending", // pending, processing, shipped
      season: "Season 1 - 2026",
      isMember: !!session?.user?.id,
      userId: session?.user?.id || null
    };

    // SKENARIO 1: MEMBER (Login) -> Simpan di User Profile & Orders Collection
    if (session?.user?.id) {
        await db.collection("users").doc(session.user.id).update({
            jerseyOrder: orderData
        });
    }

    // SKENARIO 2: PUBLIC / ALL -> Simpan ke Central Orders Collection
    // Gunakan senderPhone + timestamp sebagai ID unik sederhana
    const orderId = `ORD-${Date.now()}-${senderPhone.slice(-4)}`;
    await db.collection("jersey_orders").doc(orderId).set(orderData);

    return NextResponse.json({ success: true, message: "Pesanan berhasil disimpan", orderId });

  } catch (error) {
    console.error("[JERSEY_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET tetap cek session untuk menampilkan status "Claimed" bagi member
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    // Jika tidak login, kembalikan null order (bukan error 401)
    if (!session?.user?.id) return NextResponse.json({ order: null });

    try {
        const doc = await db.collection("users").doc(session.user.id).get();
        const data = doc.data();
        return NextResponse.json({ order: data?.jerseyOrder || null });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
