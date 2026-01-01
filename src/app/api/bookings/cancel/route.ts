'use server';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin"; 
import { FieldValue } from 'firebase-admin/firestore';
import { logActivity } from "@/lib/audit-logger";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { bookingId } = await req.json();
        if (!bookingId) return NextResponse.json({ error: "ID Booking diperlukan" }, { status: 400 });

        // Mulai Transaksi Database
        await db.runTransaction(async (transaction) => {
            // 1. Ambil Data Booking
            const bookingRef = db.collection("bookings").doc(bookingId);
            const bookingDoc = await transaction.get(bookingRef);

            if (!bookingDoc.exists) throw new Error("Booking tidak ditemukan");
            
            const bookingData = bookingDoc.data();
            
            // Security: Pastikan yang cancel adalah pemilik booking
            if (bookingData?.userId !== session.user.id) throw new Error("Akses ditolak");

            // 2. Cek Status Saat Ini
            if (bookingData?.status === 'cancelled') throw new Error("Booking sudah dibatalkan sebelumnya");

            // 3. Validasi Waktu (Max H-6 Jam)
            const eventRef = db.collection("events").doc(bookingData?.eventId);
            const eventDoc = await transaction.get(eventRef);
            
            if (!eventDoc.exists) throw new Error("Event tidak ditemukan");
            
            const eventData = eventDoc.data();
            
            // Gabungkan tanggal dan waktu event (Asumsi format: date='YYYY-MM-DD', time='HH:mm')
            const eventDateTimeStr = `${eventData?.date}T${eventData?.time.split('-')[0].trim()}:00`; 
            const eventDate = new Date(eventDateTimeStr);
            const now = new Date();

            // Hitung selisih jam
            const diffMs = eventDate.getTime() - now.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 6) {
                throw new Error("Pembatalan ditolak. Maksimal pembatalan H-6 Jam sebelum main.");
            }

            // 4. Tentukan Status Baru
            // Jika sudah bayar -> 'cancelled_refund_pending' (Admin perlu refund manual)
            // Jika belum bayar -> 'cancelled'
            const newStatus = bookingData?.status === 'paid' ? 'cancelled_refund_pending' : 'cancelled';

            // 5. Eksekusi Update (RESTORE QUOTA)
            transaction.update(bookingRef, {
                status: newStatus,
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'user'
            });

            // Kembalikan Quota Event (-1)
            transaction.update(eventRef, {
                registeredCount: FieldValue.increment(-1) 
            });
        });

        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown User",
            role: session.user.role || "Unknown",
            action: 'update',
            entity: 'Booking',
            entityId: bookingId,
            details: `Membatalkan booking ID: ${bookingId}`
        });

        return NextResponse.json({ success: true, message: "Booking berhasil dibatalkan. Kuota event telah dikembalikan." });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Gagal membatalkan booking" }, { status: 500 });
    }
}
