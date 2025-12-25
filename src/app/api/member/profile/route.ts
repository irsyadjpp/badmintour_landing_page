import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    // 1. Cek Sesi Login
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil Data dari Body Request
    const data = await req.json();
    const { phoneNumber, domicile, jerseySize, skillLevel, fullName } = data;

    // 3. Validasi Sederhana
    if (!fullName || !phoneNumber) {
      return NextResponse.json({ error: "Nama dan No WA wajib diisi" }, { status: 400 });
    }

    // 4. Update Firestore
    // Kita gunakan ID user dari session (pastikan di authOptions session callback mengembalikan ID)
    // Jika session.user.id tidak ada, fallback cari by email (opsional, tapi lebih aman pakai ID)
    const userId = session.user.id; 
    
    if (userId) {
        await db.collection("users").doc(userId).set({
            name: fullName, // Update display name juga
            phoneNumber,
            domicile,
            jerseySize,
            skillLevel,
            updatedAt: new Date().toISOString(),
            isProfileComplete: true
        }, { merge: true }); // Merge agar data lain (email, role) tidak hilang
    
        return NextResponse.json({ success: true, message: "Profil berhasil disimpan" });
    } else {
        return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

  } catch (error) {
    console.error("[PROFILE_API_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handler untuk mengambil data profil saat halaman dimuat
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const doc = await db.collection("users").doc(session.user.id).get();
        if (!doc.exists) return NextResponse.json({ empty: true });
        
        return NextResponse.json(doc.data());
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
