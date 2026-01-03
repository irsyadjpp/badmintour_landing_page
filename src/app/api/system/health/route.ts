import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import os from 'os';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // STRICT: Only Superadmin allowed
    if (!session || session.user.role !== 'superadmin') {
      return NextResponse.json({ error: "Unauthorized: Superadmin access required" }, { status: 403 });
    }

    // 1. System Vitals
    const memory = process.memoryUsage();
    const uptime = process.uptime();
    const loadAvg = os.loadavg(); // Returns [1m, 5m, 15m]

    // Convert plain bytes to MB
    const memoryUsage = {
      rss: Math.round(memory.rss / 1024 / 1024), // Resident Set Size
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      external: Math.round(memory.external / 1024 / 1024),
    };

    // 2. Fetch Recent Audit Logs (As "System Logs")
    // We'll treat the latest actions as "System Activity"
    const logsSnapshot = await db.collection("audit_logs")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const logs = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        timestamp: data.createdAt,
        level: 'INFO', // Default to INFO since we only log successful actions mostly
        message: `${data.action.toUpperCase()} ${data.entity} - ${data.details}`,
        service: 'App'
      };
    });

    // 3. Mock Error Injection (Optional: to show "ERROR" in logs if needed, 
    // but user asked for "real" data. Since audit-logger mostly logs success, 
    // we might not have many errors there unless we log them specifically.
    // For now, we just return what's in DB).

    return NextResponse.json({
      success: true,
      data: {
        uptime: Math.floor(uptime),
        memory: memoryUsage,
        cpuLoad: loadAvg[0], // 1 minute load average
        logs
      }
    });

  } catch (error) {
    console.error("Health Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
