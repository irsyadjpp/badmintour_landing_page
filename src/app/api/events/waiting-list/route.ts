'use server';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { eventId, guestName, guestPhone } = await req.json();

        // 1. Validasi: Member wajib login atau Guest wajib isi data
        let userData: any = {};
        if (session) {
            userData = {
                userId: session.user.id,
                name: session.user.name,
                email: session.user.email,
                type: 'member'
            };
        } else {
            if (!guestName || !guestPhone) return NextResponse.json({ error: "Nama & WA wajib diisi" }, { status: 400 });
            userData = {
                userId: 'guest',
                name: guestName,
                phone: guestPhone,
                type: 'guest'
            };
        }

        // 2. Cek apakah sudah di WL
        const existingWL = await db.collection("waiting_lists")
            .where("eventId", "==", eventId)
            .where(session ? "userId" : "phone", "==", session ? session.user.id : guestPhone)
            .get();

        if (!existingWL.empty) {
            return NextResponse.json({ error: "Anda sudah masuk daftar tunggu." }, { status: 400 });
        }

        // 3. Simpan ke WL
        await db.collection("waiting_lists").add({
            eventId,
            ...userData,
            status: 'waiting', // waiting -> notified -> joined
            createdAt: new Date().toISOString()
        });

        await logActivity({
            userId: userData.userId || 'guest',
            userName: userData.name,
            role: session ? session.user.role || 'member' : 'guest',
            action: 'create',
            entity: 'WaitingList',
            entityId: eventId,
            details: `Bergabung ke waiting list untuk event ID: ${eventId}`
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: "Gagal join waiting list" }, { status: 500 });
    }
}
