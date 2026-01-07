import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      eventId,
      teamA, // Array of { userId, name, avatar }
      teamB,
      scores, // Array of { A: number, B: number }
      winner, // 'A' or 'B'
      durationSeconds
    } = body;

    if (!eventId || !teamA || !teamB || !scores || !winner) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const matchData = {
      eventId,
      teamA,
      teamB,
      scores,
      winner,
      durationSeconds: durationSeconds || 0,
      createdAt: new Date().toISOString(),
      createdBy: session.user.id,
      createdByName: session.user.name
    };

    const docRef = await db.collection("matches").add(matchData);

    // Optional: Update User Stats (Win/Loss) could go here or in a background trigger

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || "Host",
      role: session.user.role || "host",
      action: 'create',
      entity: 'Match',
      entityId: docRef.id,
      details: `Match recorded for Event ${eventId}`
    });

    return NextResponse.json({ success: true, id: docRef.id });

  } catch (error) {
    console.error("Create Match Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  try {
    const snapshot = await db.collection("matches")
      .where("eventId", "==", eventId)
      .orderBy("createdAt", "desc")
      .get();

    const matches = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: matches });

  } catch (error) {
    // console.error("Get Matches Error:", error); 
    // Ignore indexing error for now or handle gracefully
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
