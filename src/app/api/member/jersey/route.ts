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
        // Changed collection to 'orders'
        const existingOrderQuery = await db.collection("orders")
            .where("userPhone", "==", senderPhone)
            .where("type", "==", "jersey")
            .limit(1)
            .get();

        if (!existingOrderQuery.empty) {
            return NextResponse.json({
                error: "Nomor WhatsApp ini sudah digunakan untuk pemesanan. Mohon gunakan nomor lain."
            }, { status: 400 });
        }

        // [NEW] LIMIT 20 PCS CHECK
        // Hitung total dokumen di collection 'orders' where type='jersey'
        const totalOrdersSnap = await db.collection("orders")
            .where("type", "==", "jersey")
            .count()
            .get();
        const totalOrders = totalOrdersSnap.data().count;

        if (totalOrders >= 20) {
            return NextResponse.json({
                error: "SOLD OUT! Kuota Pre-Order Jersey (20 Pcs) sudah terpenuhi."
            }, { status: 400 });
        }

        // Generate Order ID (Format: JSY-YYYYMMDD-XXXX)
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = `JSY-${dateStr}-${randomSuffix}`;
        const price = 150000;
        const totalCost = (Math.max(0, (quantity || 1) - 1)) * price;

        const orderData = {
            id: orderId,
            type: "jersey",
            userId: session?.user?.id || "guest",
            userName: fullName,
            userPhone: senderPhone,

            // Unified Item Structure
            items: [
                {
                    name: 'Jersey Custom Season 1',
                    quantity: quantity || 1,
                    price: price,
                    variant: `${size} - ${backName}`,
                    metadata: {
                        size,
                        backName
                    }
                }
            ],

            totalPrice: totalCost,
            status: totalCost === 0 ? "paid" : "pending",

            // Legacy/Specific Metadata
            metadata: {
                orderedAt: new Date().toISOString(),
                season: "Season 1 - 2026",
                pickupStatus: "pending",
                isMember: !!session?.user?.id,
                size,         // Keep for easy query if needed (optional)
                backName,     // Keep for easy query if needed (optional)
            },

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // A. SIMPAN KE DATABASE PUSAT (orders)
        await db.collection("orders").doc(orderId).set(orderData);

        // B. LOGIKA PAIRING ACCOUNT (Khusus Member)
        if (session?.user?.id) {
            const userRef = db.collection("users").doc(session.user.id);
            await userRef.update({
                phoneNumber: senderPhone,
                updatedAt: new Date().toISOString()
            });
        }

        // Log the activity
        await logActivity({
            userId: session?.user?.id || 'guest',
            userName: session?.user?.name || fullName,
            role: session?.user?.role || 'guest',
            action: 'create',
            entity: 'Order',
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

    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Ambil semua order milik user ini (type 'jersey')
        const snapshot = await db.collection("orders")
            .where("userId", "==", session.user.id)
            .where("type", "==", "jersey")
            .orderBy("createdAt", "desc")
            .get();

        const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            // Transform back to convenient UI format if needed, or UI will adapt.
            // Keeping it raw with mapped fields for UI backward compat
            return {
                ...data,
                // Flatten fields for UI compatibility
                orderId: data.id,
                orderedAt: data.createdAt,
                size: data.items?.[0]?.metadata?.size || data.metadata?.size,
                backName: data.items?.[0]?.metadata?.backName || data.metadata?.backName,
                quantity: data.items?.[0]?.quantity || 1,
            };
        });

        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error("[JERSEY_GET_ERROR]", error);
        return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
    }
}
