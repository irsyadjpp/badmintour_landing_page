
// src/app/api/admin/jersey/scan/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Cek Permission (Hanya Host, Admin, Superadmin yang boleh scan)
    const allowedRoles = ["host", "admin", "superadmin"];
    if (!session || !allowedRoles.includes(session.user?.role as string)) {
        return NextResponse.json({ success: false, error: "Unauthorized. Hanya Host/Admin yang boleh scan." }, { status: 403 });
    }

    const { qrData } = await req.json(); // qrData diharapkan berisi Order ID (misal: JSY-2025...)

    if (!qrData) {
        return NextResponse.json({ success: false, error: "QR Code tidak valid." }, { status: 400 });
    }

    // 2. Cari Order di Database
    const orderRef = db.collection("jersey_orders").doc(qrData);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
        return NextResponse.json({ success: false, error: "Order tidak ditemukan dalam sistem." }, { status: 404 });
    }

    const orderData = orderDoc.data();

    // 3. Cek Status (Mencegah Double Claim)
    if (orderData?.pickupStatus === 'picked_up') {
        return NextResponse.json({ 
            success: false, 
            error: "Order ini SUDAH DIAMBIL sebelumnya.",
            detail: {
                pickedUpAt: orderData.pickedUpAt,
                scannedByName: orderData.scannedByName
            }
        }, { status: 400 });
    }

    // 4. Update Database (Collecting Important Data)
    const pickupData = {
        pickupStatus: 'picked_up',
        status: 'completed', // Update status utama juga
        pickedUpAt: new Date().toISOString(),
        scannedByUserId: session.user.id,
        scannedByName: session.user.name,
        scannedByRole: session.user.role,
        pickupLocation: "Official Booth / GOR" // Bisa dibuat dinamis jika Host punya lokasi
    };

    await orderRef.update(pickupData);

    return NextResponse.json({ 
        success: true, 
        message: "Verifikasi Berhasil! Jersey diserahkan.",
        data: {
            ...orderData, // Kembalikan data order untuk ditampilkan di UI
            ...pickupData
        }
    });

  } catch (error) {
    console.error("Scan Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
