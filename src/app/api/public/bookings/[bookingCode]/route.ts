import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request, { params }: { params: { bookingCode: string } }) {
    try {
        const { bookingCode } = params;

        if (!bookingCode) {
            return NextResponse.json({ error: "Booking code required" }, { status: 400 });
        }

        const snapshot = await db.collection("bookings")
            .where("bookingCode", "==", bookingCode)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        // Security: Don't return Phone Number fully or Email
        // Only return necessary info for verification UI
        const safeData = {
            id: doc.id,
            bookingCode: data.bookingCode,
            eventTitle: data.eventTitle,
            eventDate: data.eventDate,
            eventId: data.eventId,
            coachName: data.coachName || null, // Might need to fetch event for this if not in booking
            userName: data.userName,
            hasReviewed: data.hasReviewed || false
        };

        // Fetch Event to get Coach Name if missing
        if (!safeData.coachName && data.eventId) {
            const eventDoc = await db.collection("events").doc(data.eventId).get();
            if (eventDoc.exists) {
                const eventData = eventDoc.data();
                safeData.coachName = eventData?.coachName || eventData?.coachNickname || null;
            }
        }

        return NextResponse.json({ success: true, data: safeData });

    } catch (error) {
        console.error("Public Booking API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
