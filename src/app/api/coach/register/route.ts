import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { specialty, experience, rate, bio, certificateUrl } = body;

    // Validasi
    if (!specialty || !experience || !rate) {
        return NextResponse.json({ error: "Mohon lengkapi data keahlian." }, { status: 400 });
    }

    // Cek apakah sudah pernah daftar
    const existingApp = await db.collection("coach_applications")
        .where("userId", "==", session.user.id)
        .where("status", "==", "pending")
        .get();

    if (!existingApp.empty) {
        return NextResponse.json({ error: "Aplikasi Anda sedang ditinjau." }, { status: 409 });
    }

    // Simpan Aplikasi
    const appId = `APP-${Date.now()}`;
    await db.collection("coach_applications").doc(appId).set({
        id: appId,
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        userImage: session.user.image,
        specialty,
        experience, // String: "5 Tahun"
        rate,       // Number: 150000
        bio,
        certificateUrl: certificateUrl || "https://placeholder.co/certificate.pdf", // Simulasi URL
        status: "pending", // pending, approved, rejected
        appliedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
        success: true, 
        message: "Pendaftaran berhasil! Tunggu verifikasi Admin." 
    });

  } catch (error) {
    console.error("Coach Reg Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
