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

        console.log("!!! PROFILE PUT HIT !!!");
        console.log(`User ID: ${session.user.id} | Name: ${session.user.name}`);
        console.log("Payload:", JSON.stringify(body));

        // Validasi
        if (!phoneNumber) {
            return NextResponse.json({ error: "Nomor WhatsApp wajib diisi untuk pairing akun." }, { status: 400 });
        }

        // --- PHONE FORMAT GENERATOR ---
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const formats = new Set<string>();
        formats.add(phoneNumber); // Original input
        formats.add(cleanPhone);  // Digits only

        if (cleanPhone.startsWith('0')) {
            formats.add('62' + cleanPhone.substring(1));
            formats.add('+62' + cleanPhone.substring(1));
        }
        if (cleanPhone.startsWith('62')) {
            formats.add('0' + cleanPhone.substring(2));
            formats.add('+' + cleanPhone);
        }

        const phoneFormats = Array.from(formats);
        console.log(`[PROFILE_SYNC] Checking phones: ${JSON.stringify(phoneFormats)}`);

        // --- LOGIKA PAIRING: CEK DUPLIKASI & AUTO-MERGE ---
        const duplicateCheck = await db.collection("users")
            .where("phoneNumber", "in", phoneFormats)
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
        // --- UPDATE & PAIRING ---
        // Force clean phone for storage to ensure matching works
        const finalPhone = cleanPhone; // Use the cleaned version (digits only) or format as needed. 
        // Or better: Use the format the user provided but ensure we can query it? 
        // Best practice: Store cleaned version for indexing, display version separately? 
        // For this app, let's store the cleaned version or at least ensured it's consistent.
        // Actually, let's just stick to what `cleanPhone` variable holds (digits only).
        // Check `cleanPhone` definition above.

        await db.collection("users").doc(session.user.id).set({
            phoneNumber: cleanPhone, // SAVE CLEANED PHONE (08...)
            originalPhone: phoneNumber, // Backup input
            name: name || session.user.name,
            image: image || session.user.image || "",
            nickname: nickname || (session.user as any).nickname || "",
            domicile: domicile || "",
            updatedAt: new Date().toISOString(),
            isProfileComplete: true,
            // Ensure essential fields exist if recreating
            email: session.user.email || "",
            role: (session.user as any).role || "member"
        }, { merge: true });

        // ==========================================
        // 3. MAGIC PAIRING: MIGRASI HISTORY GUEST
        // ==========================================

        const batch = db.batch();
        let totalSynced = 0;

        // A. Sync Bookings
        // A. Sync Bookings (Remove 'type' filter from query to handle mixed cases 'guest'/'GUEST')
        const bookingsSnapshot = await db.collection("bookings")
            .where("phoneNumber", "in", phoneFormats)
            .get();

        if (!bookingsSnapshot.empty) {
            bookingsSnapshot.forEach((doc) => {
                const data = doc.data();
                // Logic: Claim ONLY if currently unowned (guest) or explicitly marked as GUEST
                const isGuestBooking = data.userId === 'guest' ||
                    data.type === 'GUEST' ||
                    data.type === 'guest' ||
                    !data.userId;

                // Sync if it's a guest booking AND not already owned by this user
                if (isGuestBooking && data.userId !== session.user.id) {
                    batch.update(doc.ref, {
                        userId: session.user.id,
                        type: "MEMBER", // Standardize
                        userName: session.user.name
                    });
                    totalSynced++;
                }
            });
        }

        // B. Sync Jersey Orders
        const jerseySnapshot = await db.collection("jersey_orders")
            .where("senderPhone", "in", phoneFormats)
            .get();

        if (!jerseySnapshot.empty) {
            jerseySnapshot.forEach((doc) => {
                const data = doc.data();
                const isGuestOrder = data.type === 'GUEST' ||
                    data.type === 'guest' ||
                    !data.isMember ||
                    data.userId === 'guest';

                if (isGuestOrder && data.userId !== session.user.id) {
                    batch.update(doc.ref, {
                        userId: session.user.id,
                        isMember: true,
                        type: "MEMBER",
                        fullName: session.user.name
                    });
                    totalSynced++;
                }
            });
        }

        // C. Sync Waiting Lists
        const wlSnapshot = await db.collection("waiting_lists")
            .where("phone", "in", phoneFormats)
            .get();

        if (!wlSnapshot.empty) {
            wlSnapshot.forEach((doc) => {
                const data = doc.data();
                // WL usually has type 'guest' or 'member'
                if (data.type !== 'member' && data.userId !== session.user.id) {
                    batch.update(doc.ref, {
                        userId: session.user.id,
                        name: session.user.name,
                        email: session.user.email,
                        type: 'member'
                    });
                    totalSynced++;
                }
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
        } else {
            console.log(`[PAIRING] No items found for phones: ${JSON.stringify(phoneFormats)}`);
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
