
import { db } from "@/lib/firebase-admin";

interface LogParams {
    userId: string;
    userName: string;
    role: string;
    action: 'create' | 'update' | 'delete' | 'login' | 'verify';
    entity: string; // Misal: 'Event', 'Booking', 'User'
    entityId?: string;
    details: string;
}

export async function logActivity({ userId, userName, role, action, entity, entityId, details }: LogParams) {
    try {
        await db.collection("audit_logs").add({
            userId,
            userName,
            role,
            action,
            entity,
            entityId: entityId || "N/A",
            details,
            createdAt: new Date().toISOString(),
            ip: "System", // Bisa dikembangkan untuk ambil IP asli
            userAgent: "Web App"
        });
        console.log(`[AUDIT] ${action.toUpperCase()} ${entity} by ${userName}`);
    } catch (error) {
        console.error("Gagal mencatat audit log:", error);
        // Kita tidak throw error agar proses utama user tidak terganggu hanya karena log gagal
    }
}
