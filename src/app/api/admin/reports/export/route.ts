import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin' && session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { eventId } = await req.json();

        // 1. Ambil Data Event
        const eventDoc = await db.collection("events").doc(eventId).get();
        const eventName = eventDoc.exists ? eventDoc.data()?.title : "Event";
        const eventDate = eventDoc.exists ? eventDoc.data()?.date : "";

        // 2. Ambil Data Peserta (Bookings Paid)
        const bookingsSnap = await db.collection("bookings")
            .where("eventId", "==", eventId)
            .where("status", "==", "paid")
            .get();

        // 3. Buat Header CSV
        let csvContent = "No,Nama Peserta,Tipe,No HP (Guest),Status,Waktu Booking\n";

        // 4. Isi Data
        bookingsSnap.docs.forEach((doc, index) => {
            const data = doc.data();
            const name = data.userName || data.guestName || "No Name";
            const type = data.userId ? "Member" : "Guest";
            const phone = data.guestPhone || "-";
            const status = "Lunas";
            const time = new Date(data.bookedAt).toLocaleString('id-ID');

            // Escape koma dalam nama agar CSV tidak rusak
            const safeName = `"${name.replace(/"/g, '""')}"`;

            csvContent += `${index + 1},${safeName},${type},${phone},${status},${time}\n`;
        });

        // Log the download action
        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown",
            role: session.user.role || "Admin",
            action: 'create', // Menganggap download sebagai creation of report file
            entity: 'Report',
            entityId: eventId,
            details: `Mendownload data peserta (CSV) untuk event: ${eventName}`
        });

        // 5. Return sebagai Text/CSV
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="Peserta_${eventName}_${eventDate}.csv"`,
            },
        });

    } catch (error) {
        return NextResponse.json({ error: "Gagal export data" }, { status: 500 });
    }
}
