
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Security: Cek apakah Admin (atau Superadmin juga boleh intip)
        if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Fetch User dengan Role Tertentu Saja (Check roles array)
        // Firestore 'array-contains-any' query supports up to 10 values
        const snapshot = await db.collection("users")
            .where("roles", "array-contains-any", ["member", "host", "coach"])
            .get();

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || "No Name",
            email: doc.data().email,
            role: doc.data().role || "member",
            image: doc.data().image || "",
            createdAt: doc.data().createdAt || null
        }));

        // Sort manual karena query 'in' kadang membatasi orderBy
        users.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return NextResponse.json({ success: true, data: users });

    } catch (error) {
        console.error("Error fetching admin users:", error);
        return NextResponse.json({ error: "Gagal memuat data user" }, { status: 500 });
    }
}
