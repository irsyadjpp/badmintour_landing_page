import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
    try {
        // Ambil user dengan role 'coach' (check array roles)
        const snapshot = await db.collection("users")
            .where("roles", "array-contains", "coach")
            .get();

        const coaches = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || "Coach",
                nickname: data.nickname || "",
                email: data.email,
                image: data.image || "",
                location: data.location || "Jakarta",
                rating: data.rating || "5.0",
                reviewCount: data.reviewCount || 0,
                specialization: data.specialization || [],
                experienceYears: data.experienceYears || "1",
                price: data.pricePerSession || 0, // Assuming this field exists, else 0 (Negotiable)
                isOnline: data.isOnline || false
            };
        });

        return NextResponse.json({ success: true, data: coaches });
    } catch (error) {
        return NextResponse.json({ error: "Gagal memuat data coach" }, { status: 500 });
    }
}
