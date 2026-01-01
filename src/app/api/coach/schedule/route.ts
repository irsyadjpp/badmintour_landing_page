import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

// GET: Ambil Jadwal Coach
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doc = await db.collection("coach_schedules").doc(session.user.id).get();
    return NextResponse.json({ success: true, data: doc.exists ? doc.data() : null });
}

// POST: Simpan Jadwal
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "coach") {
        return NextResponse.json({ error: "Hanya untuk Coach" }, { status: 403 });
    }

    const { schedule } = await req.json(); // Array of { day: 'Mon', active: true, start: '09:00', end: '17:00' }

    await db.collection("coach_schedules").doc(session.user.id).set({
        schedule,
        updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: "Jadwal berhasil disimpan" });
}
