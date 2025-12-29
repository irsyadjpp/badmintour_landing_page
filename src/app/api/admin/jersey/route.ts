import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // Security: Cek Role
    if (!["admin", "superadmin"].includes(session?.user?.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Ambil semua order
    const snapshot = await db.collection("jersey_orders").orderBy("orderedAt", "desc").get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Endpoint untuk update status (Opsional, untuk fitur dropdown action di admin)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!["admin", "superadmin"].includes(session?.user?.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // Prepare update data dynamic
    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.fullName) updateData.fullName = body.fullName;
    if (body.senderName) updateData.senderName = body.senderName; // Support legacy field
    if (body.backName) updateData.backName = body.backName;
    if (body.size) updateData.size = body.size;
    if (body.senderPhone) updateData.senderPhone = body.senderPhone;

    await db.collection("jersey_orders").doc(body.id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
