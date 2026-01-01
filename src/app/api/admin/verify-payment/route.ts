import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Pastikan yang akses adalah Admin atau Host
        if (!session || (session.user.role !== 'admin' && session.user.role !== 'host' && session.user.role !== 'superadmin')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { bookingId, action, rejectionReason } = await req.json(); // action: 'approve' | 'reject'

        if (action === 'approve') {
            await db.collection("bookings").doc(bookingId).update({
                status: 'paid', // Member bisa lihat tiket
                verifiedAt: new Date().toISOString(),
                verifiedBy: session.user.name
            });
        } else if (action === 'reject') {
            await db.collection("bookings").doc(bookingId).update({
                status: 'payment_rejected', // Member harus upload ulang
                rejectionReason: rejectionReason || "Bukti tidak valid",
                verifiedAt: new Date().toISOString()
            });
        }

        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown User",
            role: session.user.role || "Unknown",
            action: 'verify',
            entity: 'Transaction',
            entityId: bookingId,
            details: `Melakukan aksi ${action.toUpperCase()} pada transaksi ${bookingId}`
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: "Gagal memproses verifikasi" }, { status: 500 });
    }
}
