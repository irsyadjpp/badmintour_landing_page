
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { targetRole } = await req.json();
        const userId = session.user.id;

        // 1. Ambil data user
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const availableRoles = userData?.roles || [];

        // 2. Validasi: Apakah user memilik role tersebut?
        if (!availableRoles.includes(targetRole)) {
            return NextResponse.json({ error: "Role tidak valid" }, { status: 403 });
        }

        // 3. Update Active Role di Database
        await userRef.update({
            role: targetRole
        });

        return NextResponse.json({ success: true, newRole: targetRole });

    } catch (error) {
        return NextResponse.json({ error: "Gagal ganti role" }, { status: 500 });
    }
}
