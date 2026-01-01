import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumber, nickname } = body;

    // Validasi sederhana
    if (!phoneNumber) {
        return NextResponse.json({ error: "Nomor HP wajib diisi" }, { status: 400 });
    }

    // 1. CEK DUPLIKASI (Pairing Logic)
    // Pastikan nomor HP belum dipakai oleh User ID lain
    const duplicateCheck = await db.collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();

    let isDuplicate = false;
    duplicateCheck.forEach(doc => {
        if (doc.id !== session.user.id) {
            isDuplicate = true;
        }
    });

    if (isDuplicate) {
        return NextResponse.json({ 
            error: "Nomor WhatsApp ini sudah terhubung dengan akun lain." 
        }, { status: 409 });
    }

    // 2. UPDATE PROFILE (Lakukan Pairing)
    await db.collection("users").doc(session.user.id).update({
        phoneNumber: phoneNumber,
        nickname: nickname || session.user.nickname, // Update nickname sekalian jika ada
        updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
        success: true, 
        message: "Profile updated. Akun berhasil ditautkan." 
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
