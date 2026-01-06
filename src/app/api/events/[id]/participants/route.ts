'use server';
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = id;

    // Ambil booking yang statusnya PAID untuk event ini
    const bookingsSnap = await db.collection("bookings")
      .where("eventId", "==", eventId)
      .where("status", "in", ["paid", "confirmed", "CONFIRMED", "pending_payment", "pending", "pending_approval", "approved", "rejected"]) // Include all statuses
      .get();

    // 2. Scan Assessments to check hasAssessment flag
    const assessmentsSnapshot = await db.collection('assessments')
      .where('sessionId', '==', eventId)
      .get();

    const assessedPlayerIds = new Set<string>();
    assessmentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.playerId) assessedPlayerIds.add(data.playerId);
    });

    const participants = await Promise.all(bookingsSnap.docs.map(async (doc) => {
      const data = doc.data();
      let role = data.userRole || 'guest';
      let userId = data.userId;
      let avatar = data.userImage || "";
      let name = data.userName || data.guestName || "Member";
      let level = 'Beginner'; // Default

      // Manual Lookup if Guest (Fix for existing unlinked bookings)
      if (!userId && data.guestPhone) {
        try {
          // Normalize Phone Check (Try original, then alternate) on 'phoneNumber' field
          let userSnap = await db.collection('users').where('phoneNumber', '==', data.guestPhone).limit(1).get();

          // If not found and phone starts with 0, try 62
          if (userSnap.empty && data.guestPhone.startsWith('0')) {
            const altPhone = '62' + data.guestPhone.substring(1);
            userSnap = await db.collection('users').where('phoneNumber', '==', altPhone).limit(1).get();
          }
          // If not found and phone starts with 62, try 0
          if (userSnap.empty && data.guestPhone.startsWith('62')) {
            const altPhone = '0' + data.guestPhone.substring(2);
            userSnap = await db.collection('users').where('phoneNumber', '==', altPhone).limit(1).get();
          }

          if (!userSnap.empty) {
            const userData = userSnap.docs[0].data();
            role = userData.role || 'member'; // admin, coach, etc.
            userId = userSnap.docs[0].id; // Link the ID
            avatar = userData.image || avatar;
            // Prioritize Nickname > Name > GuestName
            name = userData.nickname || userData.name || name;
          }
        } catch (e) {
          // Ignore lookup error
        }
      }

      // Fetch Latest User Data if userId exists (Hydration)
      if (userId) {
        try {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const u = userDoc.data();
            name = u?.nickname || u?.name || name; // Prioritize Nickname
            avatar = u?.image || avatar; // Keep latest avatar
            level = u?.level || level; // Get Level
            role = u?.role || role; // Update role from user's latest status
          }
        } catch (e) { }
      }

      return {
        id: userId,
        bookingId: doc.id,
        name: name,
        avatar: avatar,
        joinedAt: data.createdAt || data.bookedAt,
        status: data.status,
        phone: data.guestPhone || data.userPhone || "-",
        bookingCode: data.bookingCode,
        role: role,
        partnerName: data.partnerName || "", // Added Partner Name
        hasAssessment: userId ? assessedPlayerIds.has(userId) : false,
        checkInAt: data.checkInAt ? data.checkInAt.toDate() : null,
        level: level
      };
    }));

    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat peserta" }, { status: 500 });
  }
}
