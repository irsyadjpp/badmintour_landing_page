import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    // Hanya Admin, Superadmin, atau Host pemilik event yang boleh hapus
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin' && session.user.role !== 'host')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        await db.collection("events").doc(params.id).delete();
        
        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown User",
            role: session.user.role || "Unknown",
            action: 'delete',
            entity: 'Event',
            entityId: params.id,
            details: `Menghapus event ID: ${params.id}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menghapus event" }, { status: 500 });
    }
}
