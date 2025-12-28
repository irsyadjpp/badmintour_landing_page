
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Security: Hanya Superadmin yang boleh lihat logs
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Ambil 50 log terakhir
        const snapshot = await db.collection("audit_logs")
            .orderBy("createdAt", "desc")
            .limit(50)
            .get();

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, data: logs });

    } catch (error) {
        return NextResponse.json({ error: "Gagal memuat audit logs" }, { status: 500 });
    }
}
