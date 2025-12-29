import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

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
            externalLink, organizer, allowWaitingList
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
