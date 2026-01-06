
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

        // Fetch Data untuk Statistik Sistem
        const [usersSnap, eventsSnap, bookingsSnap, jerseySnap, logsSnap, recentLogsSnap] = await Promise.all([
            db.collection("users").get(),             // Hitung User
            db.collection("events").get(),            // Hitung Event
            db.collection("bookings").get(),          // Hitung Load Transaksi (bukan nominal)
            db.collection("jersey_orders").get(),     // Hitung Order Jersey
            db.collection("audit_logs").count().get(), // Hitung Total Log (Beban Log)
            db.collection("audit_logs").orderBy("createdAt", "desc").limit(7).get() // Ambil 7 Log Terakhir
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
        // Menjumlahkan semua dokumen untuk melihat beban penyimpanan
        const totalDatabaseRecords =
            usersSnap.size +
            eventsSnap.size +
            bookingsSnap.size +
            jerseySnap.size +
            logsSnap.data().count;

        // 3. Operational Stats
        // Event yang tanggalnya >= hari ini
        const activeEvents = eventsSnap.docs.filter(d => new Date(d.data().date) >= new Date()).length;

        // 4. Recent Security Logs
        const recentLogs = recentLogsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            data: {
                userStats,
                system: {
                    totalRecords: totalDatabaseRecords,
                    totalLogs: logsSnap.data().count,
                    serverStatus: "Online", // Mockup status server
                    lastBackup: new Date().toLocaleDateString() // Mockup info backup
                },
                operational: {
                    totalEvents: eventsSnap.size,
                    activeEvents
                },
                recentLogs
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Gagal memuat statistik sistem" }, { status: 500 });
    }
}
