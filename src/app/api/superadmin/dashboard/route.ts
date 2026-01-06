
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 0. Fetch Aggregates (Fast Path)
        const aggregateDoc = await db.collection("aggregates").doc("dashboard_stats").get();
        let stats = aggregateDoc.exists ? aggregateDoc.data() : null;

        // Fallback: If aggregates missing, calculate on-the-fly (or handle gracefully)
        // For User Stats, we still fetch users for real-time role breakdown (optimized later)
        // For Logs, we fetch recent 7
        const [usersSnap, recentLogsSnap] = await Promise.all([
            db.collection("users").get(),
            db.collection("audit_logs").orderBy("createdAt", "desc").limit(7).get()
        ]);

        // 1. User Stats (Demografi)
        const users = usersSnap.docs.map(doc => doc.data());
        const userStats = {
            total: users.length,
            admins: users.filter(u => u.roles?.includes('admin') || u.roles?.includes('superadmin')).length,
            hosts: users.filter(u => u.roles?.includes('host')).length,
            coaches: users.filter(u => u.roles?.includes('coach')).length,
            members: users.filter(u => !u.roles || u.roles?.includes('member')).length
        };

        // 2. System Load (Total Records di Database)
        // Use Aggregates if available, else count manually (or use 0)
        const totalEvents = stats?.totalEvents || 0;
        const totalBookings = stats?.totalBookings || 0;
        const totalJersey = stats?.jerseyOrderCount || 0;
        const totalLogs = 1000; // Placeholder or separate count if needed (logs are heavy)

        const totalDatabaseRecords =
            userStats.total +
            totalEvents +
            totalBookings +
            totalJersey +
            totalLogs;

        // 3. Operational Stats
        // Detailed Active Events check requires fetching events.
        // For optimization, we can just use totalEvents from aggregate for now, or just fetch lightweight snapshot
        // Let's keep it simple: stats.totalEvents

        // 4. Recent Security Logs
        const recentLogs = recentLogsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            data: {
                userStats, // Realtime from users collection
                system: {
                    totalRecords: totalDatabaseRecords,
                    totalLogs: totalLogs,
                    serverStatus: "Online",
                    lastBackup: new Date().toLocaleDateString(),
                    isAggregated: !!stats
                },
                operational: {
                    totalEvents: totalEvents, // From Aggregate
                    activeEvents: totalEvents // Approximate for now or add active field to aggregate
                },
                recentLogs
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Gagal memuat statistik sistem" }, { status: 500 });
    }
}
