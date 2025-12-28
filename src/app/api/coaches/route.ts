import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
    try {
        // Ambil user dengan role 'coach'
        const snapshot = await db.collection("users")
            .where("role", "==", "coach")
            .get();

        const coaches = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || "Tanpa Nama",
            email: doc.data().email
        }));

        return NextResponse.json({ success: true, data: coaches });
    } catch (error) {
        return NextResponse.json({ error: "Gagal memuat data coach" }, { status: 500 });
    }
}
