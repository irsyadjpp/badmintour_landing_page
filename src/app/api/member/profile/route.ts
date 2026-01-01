import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

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
        let shadowUserDoc: QueryDocumentSnapshot | null = null;

        duplicateCheck.forEach(doc => {
            if (doc.id !== session.user.id) {
                const data = doc.data();
                // Cek apakah ini akun Guest/Shadow?
                if (data.isShadow || data.role === 'guest') {
                    shadowUserDoc = doc;
                } else {
                    isDuplicate = true;
                }
            }
        });

        if (isDuplicate) {
            return NextResponse.json({
                error: "Nomor WhatsApp ini sudah terhubung dengan akun member lain."
            }, { status: 409 });
        }

        // 2. CLAIM / MERGE LOGIC
        if (shadowUserDoc) {
            console.log(`[MERGE] Merging Shadow Account ${(shadowUserDoc as QueryDocumentSnapshot).id} into ${session.user.id} `);
            const shadowId = (shadowUserDoc as QueryDocumentSnapshot).id;
            const realId = session.user.id;
            const batch = db.batch();

            // A. Migrate Bookings
            const bookingSnap = await db.collection("bookings").where("userId", "==", shadowId).get();
            bookingSnap.forEach(b => {
                batch.update(b.ref, { userId: realId, userRole: 'member', isGuestMerged: true });
            });

            // B. Migrate Assessments
            const assessmentSnap = await db.collection("assessments").where("playerId", "==", shadowId).get();
            assessmentSnap.forEach(a => {
                batch.update(a.ref, { playerId: realId });
            });

            // C. Delete Shadow User
            batch.delete((shadowUserDoc as QueryDocumentSnapshot).ref);

            // D. Commit Merge
            await batch.commit();
        }

        // =================================================================================
        // 2.5. CLAIM JERSEY ORDERS (ORPHAN GUEST ORDERS)
        // Cek apakah ada order jersey dengan nomor ini yang masih status 'guest'
        // Ini menangani kasus: Guest beli Jersey -> Register -> Isi No HP
        // =================================================================================
        const jerseySnap = await db.collection("jersey_orders")
            .where("senderPhone", "==", phoneNumber)
            .where("userId", "==", "guest") // Hanya claim yang guest
            .get();

        if (!jerseySnap.empty) {
            console.log(`[MERGE] Claiming ${jerseySnap.size} Jersey Orders for ${phoneNumber}`);
            const jerseyBatch = db.batch();

            jerseySnap.forEach(doc => {
                jerseyBatch.update(doc.ref, {
                    userId: session.user.id,
                    isMember: true,
                    type: "MEMBER"
                });
            });

            await jerseyBatch.commit();
        }

        // 3. UPDATE PROFILE
        await db.collection("users").doc(session.user.id).update({
            phoneNumber: phoneNumber,
            nickname: nickname || (session.user as any).nickname,
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
