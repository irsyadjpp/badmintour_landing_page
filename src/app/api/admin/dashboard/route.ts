import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Debug Config (Safe) - Removed incompatible logging
    console.log("Dashboard API (Admin): Starting...");

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Dashboard API: Fetching data...");

    // 1. Members Count
    // Using .get().size for maximum compatibility
    let totalMembers = 0;
    try {
      const usersSnap = await db.collection("users").get();
      totalMembers = usersSnap.size;
    } catch (e) {
      console.warn("Member count failed, defaulting to 0", e);
    }

    // 2. Bookings
    // Removed orderBy to avoid index errors. Sorting in JS.
    const bookingsSnap = await db.collection("bookings")
      .where("status", "in", ["paid", "confirmed", "CONFIRMED", "Paid"])
      .limit(50)
      .get();

    let totalRevenue = 0;
    const recentActivities: any[] = [];

    // Manual mapping and sorting
    const docs = bookingsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    docs.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Fetch User Nicknames (for top 5)
    // We only need aliases for the displayed items to save reads
    const top5Docs = docs.slice(0, 5);
    const userIds = new Set<string>();
    top5Docs.forEach((d: any) => {
      if (d.userId) userIds.add(d.userId);
    });

    const nicknameMap: Record<string, string> = {};
    if (userIds.size > 0) {
      try {
        const userSnaps = await Promise.all(
          Array.from(userIds).map(id => db.collection("users").doc(id).get())
        );
        userSnaps.forEach(snap => {
          if (snap.exists) {
            const uData = snap.data();
            nicknameMap[snap.id] = uData?.nickname || uData?.name || "";
          }
        });
      } catch (e) {
        console.warn("Error fetching nicknames:", e);
      }
    }

    docs.forEach((data: any) => {
      totalRevenue += (data.totalPrice || 0);

      if (recentActivities.length < 5) {
        const displayName = nicknameMap[data.userId] || data.userName || "Guest";

        recentActivities.push({
          id: data.id,
          user: displayName,
          action: "booked session",
          amount: data.totalPrice,
          status: data.status,
          time: data.createdAt
        });
      }
    });

    // 3. Upcoming Events
    // Removed orderBy
    const eventsSnap = await db.collection("events")
      .where("date", ">=", new Date().toISOString())
      .limit(10)
      .get();

    let upcomingEvents = eventsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location,
        quota: data.quota,
        bookedSlot: data.bookedSlot || 0,
        type: data.type
      };
    });

    // Sort in memory
    upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    upcomingEvents = upcomingEvents.slice(0, 5);

    // 4. Fill Rate
    let totalSlots = 0;
    let filledSlots = 0;
    upcomingEvents.forEach(e => {
      totalSlots += (e.quota || 0);
      filledSlots += (e.bookedSlot || 0);
    });
    const fillRate = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalMembers,
        fillRate
      },
      recentActivities,
      upcomingEvents
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
