import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

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

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// 2. PATCH: Update Role User
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, newRole } = await req.json();

    if (!userId || !["member", "host", "admin", "superadmin"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    // Update field 'role' di Firestore
    await db.collection("users").doc(userId).update({
      role: newRole,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: `Role updated to ${newRole}` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
