import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

// GET: Ambil List Pending
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!["admin", "superadmin"].includes(session?.user?.role as string)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const snapshot = await db.collection("coach_applications")
        .where("status", "==", "pending")
        .orderBy("appliedAt", "desc")
        .get();

    const data = snapshot.docs.map(doc => doc.data());
    return NextResponse.json({ success: true, data });
}

// POST: Approve / Reject
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!["admin", "superadmin"].includes(session?.user?.role as string)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { appId, action } = await req.json(); // action: 'approve' | 'reject'
    
    const appRef = db.collection("coach_applications").doc(appId);
    const appDoc = await appRef.get();

    if (!appDoc.exists) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    
    const appData = appDoc.data();

    // LOGIC APPROVAL
    if (action === 'approve') {
        // 1. Update status aplikasi
        await appRef.update({ status: 'approved', approvedAt: new Date().toISOString() });
        
        // 2. Update ROLE USER jadi 'coach'
        await db.collection("users").doc(appData?.userId).update({
            role: 'coach',
            coachProfile: {
                specialty: appData?.specialty,
                rate: appData?.rate,
                verified: true
            }
        });
    } else {
        await appRef.update({ status: 'rejected' });
    }

    return NextResponse.json({ success: true });
}
