import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // Cek Role Admin/Superadmin
    if (!["admin", "superadmin"].includes(session?.user?.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const snapshot = await db.collection("jersey_orders").orderBy("createdAt", "desc").get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id, // Order ID
      ...doc.data()
    }));

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
