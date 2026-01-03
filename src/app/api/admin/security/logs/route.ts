import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit') || '50';
    const limit = parseInt(limitParam);

    const logsSnapshot = await db.collection("audit_logs")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: logs });

  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
