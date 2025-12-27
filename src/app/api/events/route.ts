import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

// POST: Host Membuat Event Baru
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Validasi Role Host/Admin
    if (!["host", "admin", "superadmin"].includes(session?.user?.role as string)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    
    // Generate Event ID Unik
    const eventId = `EVT-${Date.now()}`;

    const eventData = {
        id: eventId,
        hostId: session?.user?.id,
        hostName: session?.user?.name,
        title: body.title,
        date: body.date, // Format: YYYY-MM-DD
        time: body.time, // Format: HH:mm
        location: body.location,
        courts: body.courts, // Array atau string
        price: Number(body.price),
        quota: Number(body.quota),
        registeredCount: 0,
        status: "OPEN", // OPEN, FULL, CLOSED, COMPLETED
        level: body.level || "All Level",
        isRecurring: body.isRecurring || false,
        createdAt: new Date().toISOString()
    };

    await db.collection("events").doc(eventId).set(eventData);

    return NextResponse.json({ success: true, message: "Event berhasil dibuat", eventId });

  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat event" }, { status: 500 });
  }
}

// GET: Ambil Daftar Event (Untuk Halaman Depan & Member)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // filter (optional)

        let query = db.collection("events").where("status", "==", "OPEN");
        
        // Filter tanggal (Hanya tampilkan event yang belum lewat)
        const today = new Date().toISOString().split('T')[0];
        query = query.where("date", ">=", today).orderBy("date", "asc");

        const snapshot = await query.get();
        const events = snapshot.docs.map(doc => doc.data());

        return NextResponse.json({ success: true, data: events });
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data event" }, { status: 500 });
    }
}
