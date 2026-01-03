import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { bookingId, eventId, rating, comment, isAnonymous, bookingCode } = body;

        let reviewerId = session?.user?.id;
        let reviewerName = session?.user?.name || "Member";
        let reviewerRole = session?.user?.role || "MEMBER";
        let reviewerAvatar = session?.user?.image || null;

        // SCENARIO 1: MEMBER LOGIN
        if (session?.user?.id) {
            // Normal flow, already have data
        }
        // SCENARIO 2: GUEST WITH BOOKING CODE
        else if (bookingCode) {
            // Verify Booking Code
            const bookingSnapshot = await db.collection("bookings")
                .where("bookingCode", "==", bookingCode)
                .limit(1)
                .get();

            if (bookingSnapshot.empty) {
                return NextResponse.json({ error: "Kode Booking tidak valid." }, { status: 404 });
            }

            const bookingDoc = bookingSnapshot.docs[0];
            const bookingData = bookingDoc.data();

            // Validate that this booking code matches the event (if provided) or bookingId (if provided)
            // But usually we trust the code to FETCH the bookingId

            // Override IDs from the verified booking
            reviewerId = bookingData.userId; // This is the Guest ID created during booking
            reviewerName = bookingData.userName || "Guest";
            reviewerRole = "GUEST";
            reviewerAvatar = bookingData.userImage || null;

            // IMPORTANT: Ensure we use the Booking ID from the CODE, not the Request Body (to prevent spoofing)
            // If body.bookingId is provided, check if it matches.
            if (bookingId && bookingId !== bookingDoc.id) {
                return NextResponse.json({ error: "Booking ID mismatch." }, { status: 400 });
            }
        }
        // SCENARIO 3: UNAUTHORIZED
        else {
            return NextResponse.json({ error: "Unauthorized / Missing Booking Code" }, { status: 401 });
        }

        // Common Validation
        if (!eventId || !rating) {
            return NextResponse.json({ error: "Missing required fields (eventId, rating)" }, { status: 400 });
        }

        // Use the ID from session OR code
        const finalBookingId = bookingId || (bookingCode ? (await db.collection("bookings").where("bookingCode", "==", bookingCode).limit(1).get()).docs[0].id : null);

        if (!finalBookingId) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

        // Check for existing review
        const existingReview = await db.collection("reviews")
            .where("bookingId", "==", finalBookingId)
            .get();

        if (!existingReview.empty) {
            // Optional: Allow update? For now block.
            return NextResponse.json({ error: "Anda sudah memberikan ulasan untuk sesi ini." }, { status: 400 });
        }

        // Fetch Metadata
        const eventDoc = await db.collection("events").doc(eventId).get();
        if (!eventDoc.exists) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        const eventData = eventDoc.data();

        const reviewData = {
            bookingId: finalBookingId,
            eventId,
            eventTitle: eventData?.title || "Unknown Event",
            eventType: eventData?.type || "unknown",

            // Reviewer Info
            reviewerId,
            reviewerName: isAnonymous ? "Anonymous User" : reviewerName,
            reviewerAvatar: isAnonymous ? null : reviewerAvatar,
            isAnonymous: !!isAnonymous,
            reviewerRole, // Useful for filtering "Member Reviews" vs "Guest Reviews"

            // Target Info (Coach or Host)
            targetId: eventData?.coachId || eventData?.hostId || null,
            targetName: eventData?.coachName || eventData?.hostName || "System",

            rating: Number(rating),
            comment: comment || "",
            createdAt: new Date().toISOString()
        };

        const reviewRef = await db.collection("reviews").add(reviewData);

        // Audit Log
        if (!isAnonymous) {
            await logActivity({
                userId: reviewerId,
                userName: reviewerName,
                role: reviewerRole,
                action: 'create',
                entity: 'Review',
                entityId: reviewRef.id,
                details: `Rating ${rating} for Event ${eventId} (via ${session ? 'Session' : 'Code'})`
            });
        }

        // Update Booking Status to hasReviewed = true (Helper to prevent multiple queries)
        // We can't easily add a field to 'bookings' just for this without updating TYPES, 
        // but for the UI 'hasReviewed' logic, it often queries 'reviews' collection directly.
        // However, updating the Booking Document mark is faster for the UI list.
        await db.collection("bookings").doc(finalBookingId).update({
            hasReviewed: true
        });

        return NextResponse.json({ success: true, id: reviewRef.id });

    } catch (error) {
        console.error("Submit Review Error:", error);
        return NextResponse.json({ error: "Gagal mengirim ulasan" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const targetId = searchParams.get('targetId');
        const eventId = searchParams.get('eventId');
        const bookingCode = searchParams.get('bookingCode');

        let query = db.collection("reviews").orderBy("createdAt", "desc");

        if (targetId) {
            query = query.where("targetId", "==", targetId);
        } else if (eventId) {
            query = query.where("eventId", "==", eventId);
        }

        // Special case: Guest checking their own review?
        // Usually not needed for list, but maybe for specific detail.

        else {
            query = query.limit(20);
        }

        const snapshot = await query.get();
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Special: If bookingCode provided, fetch booking info (Public Review Page needs this too)
        // But this is GET /api/bookings usually.
        // Let's keep this clean for Reviews List.

        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        console.error("Fetch Reviews Error:", error);
        return NextResponse.json({ error: "Gagal mengambil ulasan" }, { status: 500 });
    }
}
