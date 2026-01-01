import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Strict Role Check: Only 'coach', 'admin', or 'superadmin' can assess
    const allowedRoles = ['coach', 'admin', 'superadmin', 'host'];
    if (!session || !allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { playerId, sessionId, scores, totalScore, level, notes, strengths, weaknesses } = body;

    if (!playerId || !sessionId) {
      return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
    }

    // Prepare Assessment Data
    const assessmentData = {
      playerId,
      coachId: session.user.id,
      coachName: session.user.name,
      sessionId,
      scores,
      totalScore,
      level, // Beginner/Intermediate/Advance
      notes: notes || '',
      strengths: strengths || '',
      weaknesses: weaknesses || '',
      createdAt: new Date(), // Simpan sebagai native JS Date, Firestore Admin SDK akan handle conversion
      type: 'live_audit'
    };

    // 1. Save to 'assessments' collection
    const docRef = await adminDb.collection('assessments').add(assessmentData);

    // 2. Trigger Notification
    const { sendNotification } = await import('@/lib/notification-service');
    await sendNotification({
      userId: playerId,
      type: 'ASSESSMENT_COMPLETED',
      title: 'Laporan Latihan Tersedia!',
      message: `Coach ${session.user.name} baru saja menilai latihanmu. Cek raport digitalmu sekarang!`,
      link: `/member/history/${sessionId}/report`,
      metadata: { assessmentId: docRef.id, sessionId }
    });

    // 3. GAMIFICATION: Level Up Logic
    // Check if user qualifies for level up (Avg > 4.5 from last 3 sessions)
    try {
      const historySnap = await adminDb.collection('assessments')
        .where('playerId', '==', playerId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();

      const assessments = historySnap.docs.map(d => d.data());
      if (assessments.length >= 3) {
        // Calculate Average of last 3
        const last3 = assessments.slice(0, 3);
        const avgScore = last3.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / 3;

        if (avgScore >= 4.5) {
          const userRef = adminDb.collection('users').doc(playerId);
          const userDoc = await userRef.get();
          const currentLevel = userDoc.data()?.level || 'Beginner';
          let newLevel = null;

          if (currentLevel === 'Beginner') newLevel = 'Intermediate';
          else if (currentLevel === 'Intermediate') newLevel = 'Advance';

          if (newLevel) {
            await userRef.update({ level: newLevel });

            // Notify Level Up
            await sendNotification({
              userId: playerId,
              type: 'LEVEL_UP',
              title: 'LEVEL UP! 🎉',
              message: `Selamat! Kamu naik level ke ${newLevel} karena performa latihanmu yang konsisten!`,
              link: `/member/profile`,
              metadata: { oldLevel: currentLevel, newLevel }
            });
          }
        }
      }
    } catch (e) {
      console.error("Gamification Error:", e);
      // Don't block the response
    }

    return NextResponse.json({ success: true, id: docRef.id });

  } catch (error: any) {
    console.error("Assessment Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
