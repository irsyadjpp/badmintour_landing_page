import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

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
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menghapus event" }, { status: 500 });
    }
}
