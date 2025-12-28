

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

// GET: Ambil Semua Event (Untuk Landing Page & Dashboard)
export async function GET(req: Request) {
    try {
        const snapshot = await db.collection("events")
            .orderBy("date", "asc")
            .get();

        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: events });
    } catch (error) {
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
        
        // Destructure data termasuk field baru: type & coachName
        const { 
            title, date, time, location, price, quota, 
            description, type, coachName 
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
            // Field Penting untuk Drilling:
            type: type || "mabar", // 'mabar' | 'drilling' | 'tournament'
            coachName: coachName || "", // Hanya terisi jika type == 'drilling'
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
            details: `Membuat event baru: ${title} (${type})`
        });

        return NextResponse.json({ success: true, id: docRef.id });

    } catch (error) {
        return NextResponse.json({ error: "Gagal membuat event" }, { status: 500 });
    }
}
