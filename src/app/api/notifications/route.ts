'use server';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

// GET: Ambil Notifikasi User
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        console.log("Fetching notifications for:", session.user.id);

        // Remove orderBy to prevent Index Errors or Invalid Argument on some SDK versions
        const snapshot = await db.collection("notifications")
            .where("userId", "==", session.user.id)
            .limit(20)
            .get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Manual Sort
        notifications.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({ success: true, data: notifications });
    } catch (error: any) {
        console.error("Notification API Error:", error);
        return NextResponse.json({ error: "Gagal memuat notifikasi: " + error.message }, { status: 500 });
    }
}

// PUT: Tandai Semua Sudah Dibaca
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const snapshot = await db.collection("notifications")
            .where("userId", "==", session.user.id)
            .where("isRead", "==", false)
            .get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { isRead: true });
        });
        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Gagal update notifikasi" }, { status: 500 });
    }
}
