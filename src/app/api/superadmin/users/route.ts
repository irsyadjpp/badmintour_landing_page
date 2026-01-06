import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";
import { getHighestRole } from "@/lib/role-utils";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Security: Hanya Superadmin yang boleh akses
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || 'all';
        const sortBy = searchParams.get('sortBy') || 'newest';

        let query: FirebaseFirestore.Query = db.collection("users");

        // 1. Filtering
        if (role !== 'all') {
            query = query.where('roles', 'array-contains', role);
        }

        // 2. Search (Name-based) - Case Sensitive Prefix
        // Note: Firestore search limitation implies we prioritize search if it exists
        if (search) {
            // If searching, we usually order by the search field
            query = query.orderBy('name')
                .startAt(search)
                .endAt(search + '\uf8ff');
        } else {
            // 3. Sorting (Only if not searching)
            if (sortBy === 'newest') query = query.orderBy('createdAt', 'desc');
            else if (sortBy === 'oldest') query = query.orderBy('createdAt', 'asc');
            else if (sortBy === 'a-z') query = query.orderBy('name', 'asc');
            else if (sortBy === 'z-a') query = query.orderBy('name', 'desc');
        }

        // 4. Pagination
        // Note: 'offset' gets expensive with large datasets, but efficient enough for <10k docs
        const offset = (page - 1) * limit;

        // Count Query (Separate to get Total)
        // Warning: Combining complex where+orderBy might require indexes. 
        // We'll trust Firestore defaults or existing indexes.

        // Execute Query
        const snapshot = await query.limit(limit).offset(offset).get();

        // Get Total Count (Rough Estimate or Exact if possible)
        // For accurate pagination metadata, we need a separate count query with same filters
        // but without limit/offset.
        // Optimization: UI can handle "Next" button availability based on returned length < limit.
        // but user asked for "Pagination", implying page numbers usually.
        // Let's try to get count.
        // let totalQuery = db.collection("users");
        // if (role !== 'all') totalQuery = totalQuery.where('roles', 'array-contains', role);
        // ... count is expensive. Let's just return totalDocs if possible or just use simple pagination.
        // Let's fetch all metadata for now? No, that's heavy.
        // Let's just return 'hasMore' logic or simply fetch total count separately.

        // SIMPLE COUNT (Approximation: Total Users or Total in Filter)
        // We will just return the fetched slice. UI will handle "Next" if items.length === limit.

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || "No Name",
            email: doc.data().email,
            role: doc.data().role || "member",
            roles: doc.data().roles || [doc.data().role || "member"],
            image: doc.data().image || "",
            createdAt: doc.data().createdAt || new Date().toISOString()
        }));

        return NextResponse.json({
            success: true,
            data: users,
            meta: {
                page,
                limit,
                // total: ??? // Skip total for performance, use client-side "Next" availability
                hasMore: users.length === limit
            }
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Gagal memuat data user" }, { status: 500 });
    }
}

// Fitur Update Role (Khusus Superadmin)
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { userId, roles } = await req.json(); // Expect roles array

        if (!Array.isArray(roles) || roles.length === 0) {
            return NextResponse.json({ error: "Invalid roles" }, { status: 400 });
        }

        // Calculate Highest Role for Active Session
        const activeRole = getHighestRole(roles);

        await db.collection("users").doc(userId).update({
            role: activeRole,
            roles: roles,
            updatedAt: new Date().toISOString()
        });

        await logActivity({
            userId: session.user.id,
            userName: session.user.name || "Unknown",
            role: session.user.role,
            action: 'update',
            entity: 'User',
            entityId: userId,
            details: `Mengubah roles user ${userId} menjadi [${roles.join(', ')}]`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json({ error: "Gagal update role" }, { status: 500 });
    }
}
