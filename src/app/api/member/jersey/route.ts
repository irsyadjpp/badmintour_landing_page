import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { size, customName, clubName } = body;

    if (!size || !customName) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Simpan ke sub-collection 'orders' atau langsung di profile user
    // Di sini kita simpan di profile user agar mudah dicek (One Jersey per User)
    await db.collection("users").doc(session.user.id).update({
      jerseyOrder: {
        size,
        customName,
        clubName: clubName || "-",
        orderedAt: new Date().toISOString(),
        status: "pending", // pending, processing, shipped
        season: "Season 1 - 2026"
      }
    });

    return NextResponse.json({ success: true, message: "Pesanan jersey berhasil disimpan" });

  } catch (error) {
    console.error("[JERSEY_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Cek status pesanan saat ini
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const doc = await db.collection("users").doc(session.user.id).get();
        const data = doc.data();
        
        return NextResponse.json({ order: data?.jerseyOrder || null });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
