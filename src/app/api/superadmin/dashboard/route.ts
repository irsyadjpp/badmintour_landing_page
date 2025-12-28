import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Jalankan Query secara Paralel
        const [usersSnap, eventsSnap, bookingsSnap, jerseySnap, logsSnap] = await Promise.all([
            db.collection("users").get(),
            db.collection("events").get(),
            db.collection("bookings").get(),
            db.collection("jersey_orders").get(),
            db.collection("audit_logs").orderBy("createdAt", "desc").limit(5).get()
        ]);

        // 1. User Stats
        const users = usersSnap.docs.map(doc => doc.data());
        const userStats = {
            total: users.length,
            admins: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
            hosts: users.filter(u => u.role === 'host').length,
            coaches: users.filter(u => u.role === 'coach').length,
            members: users.filter(u => !u.role || u.role === 'member').length
        };

        // 2. Revenue Calculation (Bookings + Jersey)
        let totalRevenue = 0;
        
        bookingsSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'paid' || data.status === 'completed') {
                if (data.price) totalRevenue += Number(data.price);
            }
        });

        // Revenue dari Jersey
        jerseySnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'paid' || data.status === 'completed' || data.status === 'shipped') {
                if (data.totalPrice) {
                    totalRevenue += Number(data.totalPrice);
                } else {
                    const quantity = data.quantity || 1;
                    const paidQty = Math.max(0, quantity - 1);
                    totalRevenue += paidQty * 150000;
                }
            }
        });

        // 3. Activity Stats
        const activeEvents = eventsSnap.docs.filter(d => new Date(d.data().date) >= new Date()).length;
        const totalBookings = bookingsSnap.size;

        // 4. Recent Logs
        const recentLogs = logsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            data: {
                userStats,
                financial: { totalRevenue },
                operational: { totalEvents: eventsSnap.size, activeEvents, totalBookings },
                recentLogs
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Gagal memuat statistik" }, { status: 500 });
    }
}
