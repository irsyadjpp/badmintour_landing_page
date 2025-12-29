

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

// GET: Ambil Semua Event (Untuk Landing Page & Dashboard) dengan Data Real-time Participants
export async function GET(req: Request) {
    try {
        const snapshot = await db.collection("events")
            .orderBy("date", "asc")
            .get();

        const events = await Promise.all(snapshot.docs.map(async (doc) => {
            const eventData = doc.data();

            // Fetch Valid Bookings from Root Collection for Real-time Count & Avatars
            const bookingsSnap = await db.collection("bookings")
                .where("eventId", "==", doc.id)
                .where("status", "in", ["paid", "confirmed", "pending", "pending_payment", "CONFIRMED"]) // Include all valid statuses
                .get();

            const realCount = bookingsSnap.size;

            // Sort manual by createdAt desc (untuk menghindari error Index Firestore)
            const sortedDocs = bookingsSnap.docs.sort((a, b) => {
                const dateA = a.data().createdAt || '';
                const dateB = b.data().createdAt || '';
                return dateB.localeCompare(dateA);
            });

            // Ambil 4 Avatar Teratas dengan detail User jika ada
            const topBookings = sortedDocs.slice(0, 4);
            const avatars = await Promise.all(topBookings.map(async (p) => {
                const bData = p.data();

                // Cek Collection Users (Prioritas Utama agar selalu update)
                if (bData.userId) {
                    const userSnap = await db.collection("users").doc(bData.userId).get();
                    if (userSnap.exists) {
                        const userData = userSnap.data();
                        if (userData?.image && userData.image !== "") return userData.image;
                    }
                }

                // Fallback: Image dari Booking (Snapshot saat booking)
                if (bData.userImage) return bData.userImage;

                // Fallback Terakhir: Placeholder Inisial
                // Gunakan userName (member) atau guestName (tamu)
                const name = bData.userName || bData.guestName || "Guest";
                return `https://placehold.co/100x100/1e1e1e/FFF?text=${name.charAt(0).toUpperCase()}`;
            }));

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
                avatars: avatars,
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
            externalLink, organizer, allowWaitingList // <-- Tambah ini
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
            price: Number(price),
            quota: Number(quota),
            bookedSlot: 0,
            description: description || "",
            allowWaitingList: allowWaitingList || false, // <-- Tambah ini (Default: false)
            // Field Penting untuk Drilling:
            type: type || "mabar", // 'mabar' | 'drilling' | 'tournament'
            coachName: coachName || "", // Hanya terisi jika type == 'drilling'
            coachNickname: coachNickname || "", // Saved Nickname
            // Field untuk Tournament Eksternal
            externalLink: externalLink || "",
            organizer: organizer || "",
            hostId: session.user.id,
            createdAt: new Date().toISOString(),
            status: 'open'
        };

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

    } catch (error) {
        return NextResponse.json({ error: "Gagal membuat event" }, { status: 500 });
    }
}
