import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await db.collection("orders").where('type', '==', 'jersey').count().get();
    const total = snapshot.data().count;
    const LIMIT = 20;

    return NextResponse.json({
      total,
      limit: LIMIT,
      remaining: Math.max(0, LIMIT - total),
      isSoldOut: total >= LIMIT
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
