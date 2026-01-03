import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Menggunakan absolute path agar lebih aman
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

// 1. POST: Simpan Order & Pairing Akun
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        // Destructure data dari form
        const {
            size,
            backName,
            fullName,
            senderPhone,
            quantity
        } = body;

        // Validasi Kelengkapan
        if (!size || !backName || !fullName || !senderPhone) {
            return NextResponse.json({ error: "Data tidak lengkap. Mohon isi semua field." }, { status: 400 });
        }

        // Validasi Format Nama Punggung (A-Z dan Spasi, Max 12)
        if (backName.length > 12 || !/^[A-Z\s]+$/.test(backName)) {
            return NextResponse.json({ error: "Format Nama Punggung salah (Max 12 Huruf Kapital, A-Z)." }, { status: 400 });
        }

        // CEK DUPLICATE ORDER BY PHONE
        const existingOrderQuery = await db.collection("jersey_orders")
            .where("senderPhone", "==", senderPhone)
            .limit(1)
            .get();

        if (!existingOrderQuery.empty) {
            return NextResponse.json({
                error: "Nomor WhatsApp ini sudah digunakan untuk pemesanan. Mohon gunakan nomor lain."
            }, { status: 400 });
        }

        // [NEW] LIMIT 20 PCS CHECK
        // Hitung total dokumen di collection 'jersey_orders'
        const totalOrdersSnap = await db.collection("jersey_orders").count().get();
        const totalOrders = totalOrdersSnap.data().count;

        if (totalOrders >= 20) {
            return NextResponse.json({
                error: "SOLD OUT! Kuota Pre-Order Jersey (20 Pcs) sudah terpenuhi."
            }, { status: 400 });
        }

        // Generate Order ID (Format: JSY-YYYYMMDD-XXXX)
        // Ini penting agar sesuai dengan QR Code generator di frontend
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = `JSY-${dateStr}-${randomSuffix}`;

        const orderData = {
            orderId,
            size,
            backName,
            fullName: fullName, // Use the provided fullName
            senderPhone,
            quantity: quantity || 1,
            totalPrice: (Math.max(0, (quantity || 1) - 1)) * 150000,
            orderedAt: new Date().toISOString(),
            status: ((Math.max(0, (quantity || 1) - 1)) * 150000) === 0 ? "paid" : "pending", // Auto-Paid if Free
            pickupStatus: "pending",
            season: "Season 1 - 2026",
            isMember: !!session?.user?.id,
            userId: session?.user?.id || "guest",
            type: session?.user?.id ? "MEMBER" : "GUEST"
        };

        // A. SIMPAN KE DATABASE PUSAT (jersey_orders)
        await db.collection("jersey_orders").doc(orderId).set(orderData);

        // B. LOGIKA PAIRING ACCOUNT (Khusus Member)
        // Jika user login, simpan No HP ke profile mereka untuk menautkan akun
        if (session?.user?.id) {
            const userRef = db.collection("users").doc(session.user.id);

            // Update data user:
            // 1. phoneNumber: Tautkan nomor WA ke akun Google ini
            // 2. jerseyOrder: Simpan history order terakhir (opsional)
            await userRef.update({
                phoneNumber: senderPhone, // <--- FITUR PAIRING DI SINI
                updatedAt: new Date().toISOString()
            });
        }

        // Log the activity
        await logActivity({
            userId: session?.user?.id || 'guest',
            userName: session?.user?.name || fullName,
            role: session?.user?.role || 'guest',
            action: 'create',
            entity: 'JerseyOrder',
            entityId: orderId,
            details: `Memesan Jersey Custom: ${backName}`
        });

        return NextResponse.json({
            success: true,
            message: "Pesanan berhasil disimpan & akun ditautkan.",
            orderId
        });

    } catch (error) {
        console.error("[JERSEY_ORDER_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// 2. GET: Ambil History Order Member
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    // Jika tidak login, return unauthorized/empty
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Ambil semua order milik user ini dari collection central
        const snapshot = await db.collection("jersey_orders")
            .where("userId", "==", session.user.id)
            .orderBy("orderedAt", "desc")
            .get();

        const orders = snapshot.docs.map(doc => doc.data());

        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error("[JERSEY_GET_ERROR]", error);
        return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
    }
}
