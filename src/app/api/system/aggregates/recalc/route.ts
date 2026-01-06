import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    console.log("[AGGREGATE] Starting recalculation...");

    // 1. Count All Users
    const usersSnap = await db.collection("users").count().get();
    const userCount = usersSnap.data().count;

    // 2. Count All Events
    const eventsSnap = await db.collection("events").count().get();
    const eventCount = eventsSnap.data().count;

    // 3. Count Jersey Orders (If collection exists)
    let jerseyCount = 0;
    try {
      const jerseySnap = await db.collection("orders").where('type', '==', 'jersey').count().get();
      jerseyCount = jerseySnap.data().count;
    } catch (e) {
      console.warn("Jersey/Orders collection missing or empty");
    }

    // 4. Calculate Revenue & Booking Count (Batching might be needed for huge datasets, but OK for now)
    // We only sum 'paid' or 'confirmed' bookings for revenue
    const bookingsSnap = await db.collection("bookings")
      .where('status', 'in', ['paid', 'confirmed', 'CONFIRMED', 'approved'])
      .get();

    const bookingCount = bookingsSnap.size;

    let totalRevenue = 0;
    bookingsSnap.docs.forEach(doc => {
      const data = doc.data();
      const price = Number(data.totalPrice) || Number(data.price) || 0;
      totalRevenue += price;
    });

    // 5. Total Bookings (Including pending/cancelled for record? Or just valid ones?)
    // Let's count ALL bookings for load reference
    const allBookingsSnap = await db.collection("bookings").count().get();
    const totalBookingCount = allBookingsSnap.data().count;

    const stats = {
      activeMemberCount: userCount,
      totalEvents: eventCount,
      totalBookings: totalBookingCount, // Include all attempts
      paidBookings: bookingCount,       // Only successful ones
      totalRevenue: totalRevenue,
      jerseyOrderCount: jerseyCount,
      lastUpdated: new Date().toISOString()
    };

    // 6. Save to Aggregates
    await db.collection("aggregates").doc("dashboard_stats").set(stats);

    console.log("[AGGREGATE] Complete:", stats);

    return NextResponse.json({ success: true, data: stats });

  } catch (error) {
    console.error("Recalc failed:", error);
    return NextResponse.json({ error: "Failed to recalculate" }, { status: 500 });
  }
}
