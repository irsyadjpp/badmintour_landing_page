import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";
import { generatePriceTiers } from "@/lib/pricing";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const doc = await db.collection("events").doc(id).get();
        if (!doc.exists) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    // Hanya Admin, Superadmin, atau Host pemilik event yang boleh edit
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin' && session.user.role !== 'host')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const {
            title, date, time, location, price, quota,
            description, type, coachName,
            externalLink, organizer, allowWaitingList,
            assistantCoachIds, assistantCoachNames,
            cost_court, cost_shuttle, cost_tool, cost_coach,
            locationMapLink, courts, // New Fields
            hostId, hostName, // New Host Fields
            tournamentCategories // <-- New Field
        } = body;

        // Update logic
        const updateData: any = {
            updatedAt: new Date().toISOString()
        };

        if (title) updateData.title = title;
        if (date) updateData.date = date;
        if (time) updateData.time = time;
        if (location) updateData.location = location;
        if (price) updateData.price = Number(price);
        if (quota) updateData.quota = Number(quota);
        if (description !== undefined) updateData.description = description;
        if (type) updateData.type = type;
        if (coachName !== undefined) updateData.coachName = coachName;
        if (externalLink !== undefined) updateData.externalLink = externalLink;
        if (organizer !== undefined) updateData.organizer = organizer;
        if (allowWaitingList !== undefined) updateData.allowWaitingList = allowWaitingList;
        if (assistantCoachIds !== undefined) updateData.assistantCoachIds = assistantCoachIds;
        if (assistantCoachNames !== undefined) updateData.assistantCoachNames = assistantCoachNames;

        if (locationMapLink !== undefined) updateData.locationMapLink = locationMapLink;
        if (courts !== undefined) updateData.courts = courts;
        if (hostId !== undefined) updateData.hostId = hostId;
        if (hostName !== undefined) updateData.hostName = hostName;
        if (tournamentCategories !== undefined) updateData.tournamentCategories = tournamentCategories;

        // Financials Update (For Drilling)
        if (type === 'drilling' || (cost_court || cost_shuttle || cost_tool || cost_coach)) {
            const newQuota = quota ? Number(quota) : 12; // Fallback to 12 if not provided (should be provided)
            const costs = {
                courtCost: Number(cost_court) || 0,
                shuttlecockCost: Number(cost_shuttle) || 0,
                toolCost: Number(cost_tool) || 0,
                coachFee: Number(cost_coach) || 0,
                capacity: newQuota
            };
            updateData.financials = costs;
            updateData.price_tier = generatePriceTiers(costs);
        }

        await db.collection("events").doc(id).update(updateData);

        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown User",
            role: session.user.role || "Unknown",
            action: 'update',
            entity: 'Event',
            entityId: id,
            details: `Mengupdate event ID: ${id}`
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Update Event Error", error);
        return NextResponse.json({ error: "Gagal mengupdate event" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin' && session.user.role !== 'host')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { action, additionalQuota, additionalMinutes } = body;
        const eventRef = db.collection("events").doc(id);

        if (action === 'add_court') {
            const addQ = Number(additionalQuota) || 12; // Default 1 court = 12 slots

            await db.runTransaction(async (t) => {
                const eventDoc = await t.get(eventRef);
                if (!eventDoc.exists) throw "Event not found";
                const eventData = eventDoc.data();

                const newQuota = (eventData?.quota || 0) + addQ;

                // Update Event Quota
                t.update(eventRef, {
                    quota: newQuota,
                    updatedAt: new Date().toISOString()
                });

                // Check Waitlist
                if (eventData?.allowWaitingList) {
                    const wlQuery = db.collection("bookings")
                        .where("eventId", "==", id)
                        .where("status", "==", "waiting_list")
                        .orderBy("createdAt", "asc")
                        .limit(addQ);

                    const wlSnap = await t.get(wlQuery);

                    wlSnap.docs.forEach((doc) => {
                        // Promote to pending_payment (or 'paid' if price is 0?)
                        const newStatus = eventData.price === 0 ? 'paid' : 'pending_payment';
                        t.update(doc.ref, {
                            status: newStatus,
                            updatedBy: session.user.id
                        });
                    });
                }
            });

            await logActivity({
                userId: session.user.id,
                userName: session.user.name || "Admin",
                role: session.user.role || "Unknown",
                action: 'update',
                entity: 'Event',
                entityId: id,
                details: `Menambah Kuota (+${addQ}) & Auto-promote Waitlist`
            });

            return NextResponse.json({ success: true, message: `Kuota ditambah ${addQ} slot.` });
        }

        if (action === 'extend_time') {
            const addMins = Number(additionalMinutes) || 60; // Default 1 hour

            await db.runTransaction(async (t) => {
                const eventDoc = await t.get(eventRef);
                const eventData = eventDoc.data();
                if (!eventData?.time) throw "Invalid Event Time";

                // Parse Time "HH:mm - HH:mm"
                const parts = eventData.time.split(" - ");
                if (parts.length !== 2) throw "Invalid format";

                const [startStr, endStr] = parts;
                const [h, m] = endStr.split(":").map(Number);

                // Add Minutes
                const endDate = new Date();
                endDate.setHours(h, m, 0, 0);
                endDate.setMinutes(endDate.getMinutes() + addMins);

                const newEndStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
                const newTimeStr = `${startStr} - ${newEndStr}`;

                t.update(eventRef, {
                    time: newTimeStr,
                    isExtended: true,
                    updatedAt: new Date().toISOString()
                });
            });

            await logActivity({
                userId: session.user.id,
                userName: session.user.name || "Admin",
                role: session.user.role || "Unknown",
                action: 'update',
                entity: 'Event',
                entityId: id,
                details: `Extend waktu (+${addMins} menit)`
            });

            return NextResponse.json({ success: true, message: "Waktu berhasil diperpanjang" });
        }

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

    } catch (error) {
        console.error("PATCH Event Error:", error);
        return NextResponse.json({ error: "Gagal memproses request" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    // Hanya Admin, Superadmin, atau Host pemilik event yang boleh hapus
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin' && session.user.role !== 'host')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));

        await db.collection("events").doc(id).delete();

        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown User",
            role: session.user.role || "Unknown",
            action: 'delete',
            entity: 'Event',
            entityId: id,
            details: `Menghapus event ID: ${id}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menghapus event" }, { status: 500 });
    }
}
