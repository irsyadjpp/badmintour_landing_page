

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";
import { generatePriceTiers } from "@/lib/pricing";

// GET: Ambil Semua Event (Untuk Landing Page & Dashboard) dengan Data Real-time Participants
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const upcoming = searchParams.get('upcoming') === 'true';

        let query = db.collection("events").orderBy("date", "asc");

        if (upcoming) {
            // Get today's date in YYYY-MM-DD format (Indonesia Timezone assumption or UTC)
            // Using ID string to ensure consistency with how dates are stored (YYYY-MM-DD)
            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // Returns YYYY-MM-DD
            query = query.startAt(today);
        }

        const snapshot = await query.get();

        const events = await Promise.all(snapshot.docs.map(async (doc) => {
            const eventData = doc.data();

            const bookingsSnap = await db.collection("bookings")
                .where("eventId", "==", doc.id)
                .where("status", "in", ["paid", "confirmed", "pending", "pending_payment", "CONFIRMED"]) // Include all valid statuses
                .get();

            // FILTER: Exclude Assigned Staff (Host, Coach, Assistant)
            const validDocs = bookingsSnap.docs.filter(bDoc => {
                const bData = bDoc.data();
                const uid = bData.userId;

                // 1. Check Host
                if (eventData.hostId && uid === eventData.hostId) return false;
                if (eventData.organizer && uid === eventData.organizer) return false;

                // 2. Check Assistant Coach
                if (eventData.assistantCoachIds && Array.isArray(eventData.assistantCoachIds) && eventData.assistantCoachIds.includes(uid)) return false;

                // 3. Check Main Coach (Name Match)
                if (eventData.coachName && bData.userName && bData.userName.toLowerCase() === eventData.coachName.toLowerCase()) return false;

                return true;
            });

            const realCount = validDocs.length;

            // Sort manual by createdAt desc (untuk menghindari error Index Firestore)
            const sortedDocs = validDocs.sort((a, b) => {
                const dateA = a.data().createdAt || '';
                const dateB = b.data().createdAt || '';
                return dateB.localeCompare(dateA);
            });

            // Ambil Detail Participants (Name, Image, Id)
            const participants = await Promise.all(sortedDocs.map(async (p) => {
                const bData = p.data();
                let name = bData.userName || bData.guestName || "Guest";
                let image = bData.userImage || `https://placehold.co/100x100/1e1e1e/FFF?text=${name.charAt(0).toUpperCase()}`;
                let id = bData.userId || null;

                // Cek Collection Users untuk data terbaru
                if (bData.userId) {
                    const userSnap = await db.collection("users").doc(bData.userId).get();
                    if (userSnap.exists) {
                        const userData = userSnap.data();
                        if (userData?.name) name = userData.name; // Use real name
                        if (userData?.nickname) name = userData.nickname; // Prefer nickname if available
                        if (userData?.image && userData.image !== "") image = userData.image;
                    }
                }

                return { id, name, image };
            }));

            // Backward Compatibility & Top Avatars for Cards
            const avatars = participants.slice(0, 4).map(p => p.image);

            // Ambil Data Host (Nickname)
            let hostNickname = "";
            if (eventData.hostId) {
                const hostSnap = await db.collection("users").doc(eventData.hostId).get();
                if (hostSnap.exists) {
                    const hostData = hostSnap.data();
                    hostNickname = hostData?.nickname || hostData?.name?.split(" ")[0] || "Admin"; // Fallback ke nama depan
                }
            }

            return {
                id: doc.id,
                ...eventData,
                bookedSlot: realCount,
                avatars: avatars, // Keep for backward compat
                participants: participants, // <-- NEW: Full List
                hostNickname: hostNickname // <-- Field Baru
            };
        }));

        return NextResponse.json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Gagal memuat event" }, { status: 500 });
    }
}

// POST: Host Membuat Event Baru (Mabar / Drilling)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'host' && session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();

        // Destructure data termasuk field baru: type & coachName & coachNickname
        const {
            title, date, time, location, price, quota,
            description, type, coachName, coachNickname,
            externalLink, organizer, allowWaitingList,
            allowedUserTypes, partnerMechanism,
            skillLevel, curriculum,
            playerCriteria, prizes,
            isRecurring,
            cost_court, cost_shuttle, cost_tool, cost_coach,
            sparringOpponent, matchFormat,
            locationMapLink, courts, // New Fields
            hostId: selectedHostId, hostName // New Host Fields
        } = body;

        // Validasi dasar
        if (!title || !date || !price) {
            return NextResponse.json({ error: "Data wajib belum lengkap" }, { status: 400 });
        }

        const newEvent = {
            title,
            date, // Format: YYYY-MM-DD
            time, // Format: HH:mm - HH:mm
            location,
            locationMapLink: locationMapLink || "", // <-- New
            courts: courts || [], // <-- New
            price: Number(price),
            quota: Number(quota),
            bookedSlot: 0,
            description: description || "",
            allowWaitingList: allowWaitingList || false,
            // Field Penting untuk Drilling:
            type: type || "mabar",
            coachName: coachName || "",
            coachNickname: coachNickname || "",
            skillLevel: skillLevel || "all",
            curriculum: curriculum || "",
            // Field untuk Tournament Eksternal
            externalLink: externalLink || "",
            // Field Penting untuk Tournament Internal:
            allowedUserTypes: allowedUserTypes || ['member', 'guest'],
            partnerMechanism: partnerMechanism || 'user',
            organizer: organizer || "",
            playerCriteria: playerCriteria || "",
            prizes: prizes || "",
            // Module Link (Coaching System)
            moduleId: body.moduleId || null,
            moduleTitle: body.moduleTitle || null,

            hostId: selectedHostId || session.user.id, // Use selected Host or Current User
            hostName: hostName || session.user.name, // Save Host Name
            createdAt: new Date().toISOString(),
            status: 'open',
            // Financials for Drilling
            ...(type === 'drilling' ? (() => {
                const costs = {
                    courtCost: Number(body.cost_court) || 0,
                    shuttlecockCost: Number(body.cost_shuttle) || 0,
                    toolCost: Number(body.cost_tool) || 0,
                    coachFee: Number(body.cost_coach) || 0,
                    capacity: Number(quota) || 12
                };
                return {
                    financials: costs,
                    price_tier: generatePriceTiers(costs)
                };
            })() : {}),
            // Assistant Coaches (Drilling)
            assistantCoachIds: body.assistantCoachIds || [],
            assistantCoachNames: body.assistantCoachNames || []
        };

        // 5. SIMPAN KE DATABASE (Single vs Recurring)
        if (body.isRecurring) {
            const batch = db.batch();
            const startDate = new Date(date);
            const groupId = `REC-${Date.now()}`; // Group ID for tracking

            for (let i = 0; i < 4; i++) {
                const nextDate = new Date(startDate);
                nextDate.setDate(startDate.getDate() + (i * 7));
                const dateStr = nextDate.toISOString().split('T')[0];

                const ref = db.collection("events").doc();
                batch.set(ref, {
                    ...newEvent,
                    date: dateStr,
                    recurringGroupId: groupId
                });
            }

            await batch.commit();

            await logActivity({
                userId: session.user.id,
                userName: session.user.name || "Unknown",
                role: session.user.role || "Unknown",
                action: 'create',
                entity: 'Event',
                entityId: groupId,
                details: `Membuat 4 Jadwal Rutin (Recurring) mulai ${date} (${type})`
            });

            return NextResponse.json({ success: true, message: "4 Jadwal Rutin Created" });
        } else {
            // SINGLE EVENT
            const docRef = await db.collection("events").add(newEvent);

            await logActivity({
                userId: session.user.id,
                userName: session.user.name || "Unknown",
                role: session.user.role || "Unknown",
                action: 'create',
                entity: 'Event',
                entityId: docRef.id,
                details: `Membuat event baru: ${title} (${type}) di ${location}`
            });

            return NextResponse.json({ success: true, id: docRef.id });
        }

    } catch (error) {
        return NextResponse.json({ error: "Gagal membuat event" }, { status: 500 });
    }
}
