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
            nickname: nickname || (session.user as any).nickname || "",
            domicile: domicile || "",
            updatedAt: new Date().toISOString(),
            isProfileComplete: true
        });

        // ==========================================
        // 3. MAGIC PAIRING: MIGRASI HISTORY GUEST
        // ==========================================

        const batch = db.batch();
        let totalSynced = 0;

        // A. Sync Bookings
        const guestBookingsSnapshot = await db.collection("bookings")
            .where("phoneNumber", "==", phoneNumber)
            .where("type", "==", "GUEST")
            .get();

        if (!guestBookingsSnapshot.empty) {
            guestBookingsSnapshot.forEach((doc) => {
                batch.update(doc.ref, {
                    userId: session.user.id,
                    type: "MEMBER",
                    userName: session.user.name
                });
                totalSynced++;
            });
        }

        // B. Sync Jersey Orders
        const guestJerseySnapshot = await db.collection("jersey_orders")
            .where("senderPhone", "==", phoneNumber)
            .where("type", "==", "GUEST")
            .get();

        if (!guestJerseySnapshot.empty) {
            guestJerseySnapshot.forEach((doc) => {
                batch.update(doc.ref, {
                    userId: session.user.id,
                    isMember: true,
                    type: "MEMBER",
                    fullName: session.user.name // Opsional: Update nama
                });
                totalSynced++;
            });
        }

        // C. Sync Waiting Lists
        const guestWLSnapshot = await db.collection("waiting_lists")
            .where("phone", "==", phoneNumber)
            .where("type", "==", "guest")
            .get();

        if (!guestWLSnapshot.empty) {
            guestWLSnapshot.forEach((doc) => {
                batch.update(doc.ref, {
                    userId: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    type: 'member'
                });
                totalSynced++;
            });
        }

        if (totalSynced > 0) {
            await batch.commit();
            console.log(`[PAIRING] ${totalSynced} items (Bookings/Jersey/WL) synced to user ${session.user.name}`);
        }

        return NextResponse.json({
            success: true,
            message: `Profile disimpan. ${totalSynced > 0 ? totalSynced + ' aktivitas lama berhasil ditautkan!' : 'Data berhasil diperbarui.'}`
        });

    } catch (error) {
        console.error("[PROFILE_UPDATE_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
