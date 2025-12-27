import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

// GET: Ambil Data Profile User yang Sedang Login
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const doc = await db.collection("users").doc(session.user.id).get();
        if (!doc.exists) return NextResponse.json({ empty: true });
        
        return NextResponse.json({ success: true, data: doc.data() });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

// PUT: Update Profile & Pairing Account Logic
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumber, name, nickname, domicile } = body;

    // Validasi
    if (!phoneNumber) {
        return NextResponse.json({ error: "Nomor WhatsApp wajib diisi untuk pairing akun." }, { status: 400 });
    }

    // --- LOGIKA PAIRING: CEK DUPLIKASI ---
    // Cari apakah nomor HP ini sudah dipakai user LAIN
    const duplicateCheck = await db.collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();

    let isDuplicate = false;
    duplicateCheck.forEach(doc => {
        // Jika ketemu doc dengan No HP sama, TAPI ID-nya beda dengan user yang login sekarang
        if (doc.id !== session.user.id) {
            isDuplicate = true;
        }
    });

    if (isDuplicate) {
        return NextResponse.json({ 
            success: false,
            error: "GAGAL PAIRING: Nomor WhatsApp ini sudah tertaut dengan akun Google lain." 
        }, { status: 409 });
    }

    // --- UPDATE & PAIRING ---
    await db.collection("users").doc(session.user.id).update({
        phoneNumber: phoneNumber, // Field kunci pairing
        name: name || session.user.name,
        nickname: nickname || session.user.nickname,
        domicile: domicile || "",
        updatedAt: new Date().toISOString(),
        isProfileComplete: true
    });

    return NextResponse.json({ 
        success: true, 
        message: "Profile berhasil disimpan. Akun Google Anda sekarang tertaut dengan WhatsApp ini." 
    });

  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
