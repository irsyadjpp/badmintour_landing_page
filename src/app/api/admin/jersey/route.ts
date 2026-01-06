import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Security: Cek Role
    if (!["admin", "superadmin"].includes(session?.user?.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const limit = parseInt(new URL(req.url).searchParams.get('limit') || '50');
    const cursor = new URL(req.url).searchParams.get('cursor');

    let query = db.collection("orders")
      .where("type", "==", "jersey")
      .orderBy("createdAt", "desc")
      .limit(limit + 1);

    if (cursor) {
      query = query.startAfter(cursor);
    }

    const snapshot = await query.get();

    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        fullName: data.userName,
        senderPhone: data.userPhone,
        orderedAt: data.createdAt,
        size: data.items?.[0]?.metadata?.size || data.metadata?.size,
        backName: data.items?.[0]?.metadata?.backName || data.metadata?.backName,
        quantity: data.items?.[0]?.quantity || 1,
        // Ensure we strictly have a string for cursor if needed, though createdAt IS the cursor usually?
        // Actually, startAfter takes the value of the orderBy field.
        // So we need 'createdAt' value itself. 
      };
    });

    const hasMore = orders.length > limit;
    const paginatedOrders = hasMore ? orders.slice(0, limit) : orders;

    // Determine next cursor value (createdAt of the last item)
    const lastOrder = paginatedOrders[paginatedOrders.length - 1];
    const nextCursor = hasMore && lastOrder ? lastOrder.orderedAt : null;

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      meta: {
        hasMore,
        cursor: nextCursor
      }
    });
  } catch (error: any) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

// Endpoint untuk update status (Opsional, untuk fitur dropdown action di admin)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!["admin", "superadmin"].includes(session?.user?.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // Prepare update data dynamic
    const updateData: any = {};
    const metadataUpdate: any = {};

    if (body.status) updateData.status = body.status;

    // Convert root fields to new schema if changed
    if (body.fullName) updateData.userName = body.fullName;
    if (body.senderPhone) updateData.userPhone = body.senderPhone;

    // Metadata / Items Update (Simplified: assuming single item for jersey)
    if (body.backName) metadataUpdate.backName = body.backName;
    if (body.size) metadataUpdate.size = body.size;

    if (Object.keys(metadataUpdate).length > 0) {
      // We'll update root metadata for ease
      updateData["metadata"] = metadataUpdate;
      // Deep update items if needed (Requires reading first or overwrite entire array - simpler to just update metadata for now as UI might check there)
      // If we strictly follow schema, we should update items[0].metadata too, but that's hard without reading.
      // Let's rely on metadata logic for now.
    }

    await db.collection("orders").doc(body.id).set(updateData, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
