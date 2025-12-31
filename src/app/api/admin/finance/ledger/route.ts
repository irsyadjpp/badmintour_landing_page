
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Simple Admin Check
    if (!session?.user?.id || session.user.role !== 'admin') {
      // Allow 'host' or 'coach' if needed? For now strict admin.
      if (session?.user?.role !== 'superadmin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const snapshot = await db.collection("finance_ledger")
      .orderBy("idx_date", "desc")
      .limit(50)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("API_FINANCE_LEDGER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
