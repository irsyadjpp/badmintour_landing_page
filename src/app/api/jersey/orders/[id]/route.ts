import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

// GET: Ambil Detail Pesanan
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const docRef = db.collection("jersey_orders").doc(params.id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
        }

        const data = docSnap.data();

        // Security Check: Hanya Admin/Superadmin ATAU Pemilik Pesanan yang boleh lihat
        const isAdmin = session.user.role === 'admin' || session.user.role === 'superadmin';
        if (!isAdmin && data?.userId !== session.user.id) {
            return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: { id: docSnap.id, ...data } });
    } catch (error) {
        return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
    }
}

// PUT: Update Pesanan
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const docRef = db.collection("jersey_orders").doc(params.id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        const existingData = docSnap.data();
        const isAdmin = session.user.role === 'admin' || session.user.role === 'superadmin';

        // Security Check
        if (!isAdmin && existingData?.userId !== session.user.id) {
            return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
        }

        // Filter data yang boleh diupdate
        const updateData: any = {
            customName: body.customName,
            number: body.number,
            size: body.size,
            sleeveType: body.sleeveType,
            address: body.address,
            phone: body.phone,
            updatedAt: new Date().toISOString()
        };

        // Hanya Admin yang boleh ubah status & resi
        if (isAdmin) {
            if (body.status) updateData.status = body.status;
            if (body.resi) updateData.resi = body.resi;
        }

        await docRef.update(updateData);

        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown User",
            role: session.user.role || "Unknown",
            action: 'update',
            entity: 'JerseyOrder',
            entityId: params.id,
            details: `Update data pesanan Jersey. Status: ${body.status || 'No Change'}`
        });

        return NextResponse.json({ success: true, message: "Pesanan diperbarui" });

    } catch (error) {
        return NextResponse.json({ error: "Gagal update" }, { status: 500 });
    }
}
