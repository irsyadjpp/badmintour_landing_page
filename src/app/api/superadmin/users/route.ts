import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

// 1. GET: Ambil Semua User dari Firestore
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // Security Check: Hanya Superadmin yang boleh akses
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// 2. PUT: Update Role User (mengganti dari PATCH)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !["member", "host", "admin", "superadmin", "coach"].includes(role)) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    // Update field 'role' di Firestore
    await db.collection("users").doc(userId).update({
      role: role,
      updatedAt: new Date().toISOString()
    });

    await logActivity({
        userId: session.user.id,
        userName: session.user.name || "Unknown User",
        role: session.user.role || "Unknown",
        action: 'update',
        entity: 'User',
        entityId: userId,
        details: `Mengubah role user ${userId} menjadi ${role}`
    });

    return NextResponse.json({ success: true, message: `Role updated to ${role}` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
