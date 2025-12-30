import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";
import { FieldValue } from 'firebase-admin/firestore';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'host' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();

    if (!status || !['paid', 'pending', 'cancelled', 'pending_approval', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const bookingRef = db.collection("bookings").doc(id);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }
    const bookingData = bookingSnap.data();

    // Handle Quota Release (if Rejected/Cancelled) AND prior status was occupying a slot
    // Assuming 'cancelled' and 'rejected' do NOT occupy slots.
    if (['rejected', 'cancelled'].includes(status) && !['rejected', 'cancelled'].includes(bookingData?.status)) {
      const eventRef = db.collection("events").doc(bookingData?.eventId);
      await eventRef.update({
        bookedSlot: FieldValue.increment(-1)
      });
    }

    await bookingRef.update({
      status: status,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.id
    });

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      role: session.user.role || "Unknown",
      action: 'update',
      entity: 'Booking',
      entityId: id,
      details: `Mengubah status booking menjadi: ${status}`
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Gagal mengupdate booking" }, { status: 500 });
  }
}
