
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Security: Hanya Superadmin yang boleh akses
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Fetch SEMUA user dari Firestore
        const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || "No Name",
            email: doc.data().email,
            role: doc.data().role || "member",
            image: doc.data().image || "",
            createdAt: doc.data().createdAt || new Date().toISOString()
        }));

        return NextResponse.json({ success: true, data: users });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Gagal memuat data user" }, { status: 500 });
    }
}

// Fitur Update Role (Khusus Superadmin)
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { userId, role } = await req.json();

        await db.collection("users").doc(userId).update({ 
            role,
            updatedAt: new Date().toISOString()
        });

        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown",
            role: session.user.role,
            action: 'update',
            entity: 'User',
            entityId: userId,
            details: `Mengubah role user ${userId} menjadi ${role}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Gagal update role" }, { status: 500 });
    }
}
