import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

    const { status, partnerName, price, isSponsored } = await req.json();

    if (!status || !['paid', 'pending', 'cancelled', 'pending_approval', 'approved', 'rejected', 'confirmed'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const bookingRef = db.collection("bookings").doc(id);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }
    const bookingData = bookingSnap.data();

    // Handle Quota Release (if Rejected/Cancelled) AND prior status was occupying a slot
    if (status && ['rejected', 'cancelled'].includes(status) && !['rejected', 'cancelled'].includes(bookingData?.status)) {
      const eventRef = db.collection("events").doc(bookingData?.eventId);
      await eventRef.update({
        bookedSlot: FieldValue.increment(-1)
      });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.id
    };
    if (status) updateData.status = status;
    if (partnerName !== undefined) updateData.partnerName = partnerName;
    if (price !== undefined) updateData.price = price;
    if (isSponsored !== undefined) updateData.isSponsored = isSponsored;

    await bookingRef.update(updateData);

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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'host' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const bookingRef = db.collection("bookings").doc(id);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }

    const bookingData = bookingSnap.data();

    // Decrease Slot Quota if status was 'active'
    if (bookingData && ['paid', 'pending', 'approved', 'confirmed', 'pending_approval'].includes(bookingData.status)) {
      const eventRef = db.collection("events").doc(bookingData.eventId);
      await eventRef.update({
        bookedSlot: FieldValue.increment(-1)
      });
    }

    await bookingRef.delete();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      role: session.user.role || "Unknown",
      action: 'delete',
      entity: 'Booking',
      entityId: id,
      details: `Menghapus peserta: ${bookingData?.name || 'Unknown'}`
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ error: "Gagal menghapus booking" }, { status: 500 });
  }
}
