import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

// QR Token Rahasia (Bisa disimpan di ENV atau Database Config)
const VALID_QR_TOKEN = "GOR-WARTAWAN-2025"; 

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'host' && session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { qrToken, eventId, coordinates } = await req.json();

        // 1. Validasi QR Code
        if (qrToken !== VALID_QR_TOKEN) {
            return NextResponse.json({ error: "QR Code tidak valid atau lokasi salah." }, { status: 400 });
        }

        // 2. Simpan Log Absensi
        await db.collection("host_attendance").add({
            hostId: session.user.id,
            hostName: session.user.name,
            eventId: eventId || "General Check-in",
            checkInTime: new Date().toISOString(),
            coordinates: coordinates || null, // { lat: ..., lng: ... }
            status: "Present"
        });

        return NextResponse.json({ success: true, message: "Check-in berhasil! Selamat bertugas." });

    } catch (error) {
        return NextResponse.json({ error: "Gagal check-in" }, { status: 500 });
    }
}
