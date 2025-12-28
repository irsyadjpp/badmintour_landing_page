'use server';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { targetId, targetType, rating, comment } = await req.json(); // targetType: 'coach' | 'event'

        await db.collection("reviews").add({
            reviewerId: session.user.id,
            reviewerName: session.user.name,
            reviewerImage: session.user.image,
            targetId, 
            targetType,
            rating: Number(rating),
            comment,
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Gagal kirim review" }, { status: 500 });
    }
}
