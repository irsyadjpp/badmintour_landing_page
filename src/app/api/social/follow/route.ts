
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { targetId } = await req.json();
        const followerId = session.user.id;

        if (targetId === followerId) return NextResponse.json({ error: "Tidak bisa follow diri sendiri" }, { status: 400 });

        // Cek apakah sudah follow
        const followRef = db.collection("relationships")
            .where("followerId", "==", followerId)
            .where("followingId", "==", targetId)
            .limit(1);

        const snapshot = await followRef.get();

        let isFollowing = false;

        if (!snapshot.empty) {
            // UNFOLLOW Logic
            const docId = snapshot.docs[0].id;
            await db.collection("relationships").doc(docId).delete();
            isFollowing = false;
        } else {
            // FOLLOW Logic
            await db.collection("relationships").add({
                followerId,
                followingId: targetId,
                createdAt: new Date().toISOString()
            });
            isFollowing = true;
        }

        return NextResponse.json({ success: true, isFollowing });

    } catch (error) {
        return NextResponse.json({ error: "Gagal memproses request" }, { status: 500 });
    }
}
