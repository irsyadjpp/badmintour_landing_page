import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
        const { phoneNumber, name, nickname, domicile, image } = body;

        // Validasi
        if (!phoneNumber) {
            return NextResponse.json({ error: "Nomor WhatsApp wajib diisi untuk pairing akun." }, { status: 400 });
        }

        // --- LOGIKA PAIRING: CEK DUPLIKASI & AUTO-MERGE ---
        const duplicateCheck = await db.collection("users")
            .where("phoneNumber", "==", phoneNumber)
            .get();

        let conflictingGuestId: string | null = null;
        let isRealUserConflict = false;

        duplicateCheck.forEach(doc => {
            if (doc.id !== session.user.id) {
                const data = doc.data();
                // Jika memiliki email, berarti ini akun Google User lain -> BLOCK
                if (data.email) {
                    isRealUserConflict = true;
                } else {
                    // Jika TIDAK punya email, asumsi ini akun Guest lama -> MERGE
                    conflictingGuestId = doc.id;
                }
            }
        });

        if (isRealUserConflict) {
            return NextResponse.json({
                success: false,
                error: "DOUBE FAULT! Nomor ini sudah dipakai akun lain."
            }, { status: 409 });
        }

        // --- UPDATE & PAIRING ---
        await db.collection("users").doc(session.user.id).update({
            phoneNumber: phoneNumber, // Field kunci pairing
            name: name || session.user.name,
            image: image || session.user.image, // New: Update Image if provided
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

        // D. Sync Data from Conflicting Guest ID (Auto-Merge)
        if (conflictingGuestId) {
            console.log(`[MERGE] Merging data from Guest ID: ${conflictingGuestId} to User: ${session.user.id}`);

            // 1. Migrate Bookings by UserID
            const oldUserBookings = await db.collection("bookings").where("userId", "==", conflictingGuestId).get();
            oldUserBookings.forEach(doc => {
                batch.update(doc.ref, { userId: session.user.id, userName: session.user.name, type: "MEMBER" });
                totalSynced++;
            });

            // 2. Migrate Jersey Orders by UserID
            const oldUserJersey = await db.collection("jersey_orders").where("userId", "==", conflictingGuestId).get();
            oldUserJersey.forEach(doc => {
                batch.update(doc.ref, { userId: session.user.id, type: "MEMBER", isMember: true });
                totalSynced++;
            });

            // 3. Delete Old Guest Document
            batch.delete(db.collection("users").doc(conflictingGuestId));
            console.log(`[MERGE] Deleting old guest document: ${conflictingGuestId}`);
        }

        // E. Sync Assessments (NEW - for drilling/coaching sessions)
        // Find assessments linked to this user's bookings
        const userBookings = await db.collection("bookings")
            .where("userId", "==", session.user.id)
            .get();

        for (const bookingDoc of userBookings.docs) {
            const booking = bookingDoc.data();
            const eventId = booking.eventId;

            if (!eventId) continue;

            // Find assessments for this session
            const assessmentsSnap = await db.collection("assessments")
                .where("sessionId", "==", eventId)
                .get();

            for (const assessmentDoc of assessmentsSnap.docs) {
                const assessment = assessmentDoc.data();

                // If playerId doesn't match current userId, migrate it
                if (assessment.playerId !== session.user.id) {
                    batch.update(assessmentDoc.ref, {
                        playerId: session.user.id,
                        migratedAt: new Date(),
                        oldPlayerId: assessment.playerId
                    });
                    totalSynced++;
                }
            }
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
