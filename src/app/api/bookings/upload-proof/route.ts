import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { bookingId, imageBase64 } = await req.json();

        if (!bookingId || !imageBase64) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        // Update Booking: Simpan bukti & Ubah status jadi 'verification_pending'
        await db.collection("bookings").doc(bookingId).update({
            paymentProof: imageBase64,
            status: 'verification_pending',
            uploadedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true, message: "Bukti berhasil diupload. Tunggu verifikasi admin." });

    } catch (error) {
        return NextResponse.json({ error: "Gagal upload bukti" }, { status: 500 });
    }
}
