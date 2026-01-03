import { NextResponse } from 'next/server';
import { db as adminDb } from '@/lib/firebase-admin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const playerId = searchParams.get('playerId');

  if (!sessionId || !playerId) {
    return NextResponse.json({ error: 'Missing sessionId or playerId' }, { status: 400 });
  }

  try {
    const snapshot = await adminDb.collection('assessments')
      .where('sessionId', '==', sessionId)
      .where('playerId', '==', playerId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ data: null });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({ data: { id: doc.id, ...doc.data() } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    // Check for existing assessment to update
    const existingSnap = await adminDb.collection('assessments')
      .where('sessionId', '==', sessionId)
      .where('playerId', '==', playerId)
      .limit(1)
      .get();

    // ---------------------------------------------------------
    // 1. GENKIT AI EXECUTION
    // ---------------------------------------------------------
    let aiFeedback = "";
    let skillAnalysis = {};
    let aiStrength = "";
    let aiWeakness = "";

    try {
      console.log("Generating AI Feedback for:", body.playerName);

      const { generateDrillingReport } = await import('@/ai/flows/generate-drilling-report');

      // Panggil Flow Genkit (Sekarang Return JSON object)
      const aiResult: any = await generateDrillingReport({
        playerName: body.playerName || "Member",
        level: level,
        scores: scores,
        coachNotes: notes || ''
      });

      // Construct legacy text feedback from structured data
      aiStrength = aiResult.strengths;
      aiWeakness = aiResult.weaknesses;
      skillAnalysis = aiResult.skills;

      // New Standard: aiFeedback IS the Executive Conclusion
      aiFeedback = aiResult.conclusion;

    } catch (aiError) {
      console.error("Genkit Error:", aiError);
      aiFeedback = "Maaf, feedback otomatis tidak dapat dibuat saat ini. Namun data skor Anda telah tersimpan.";
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
      aiFeedback, // Legacy text
      skillAnalysis, // NEW: Granular breakdown
      strengths: strengths || aiStrength, // Use AI if empty
      weaknesses: weaknesses || aiWeakness, // Use AI if empty
      updatedAt: new Date(), // Track updates
      type: 'live_audit'
    };

    let docId = '';

    if (!existingSnap.empty) {
      // UPDATE existing
      const doc = existingSnap.docs[0];
      await doc.ref.update(assessmentData);
      docId = doc.id;
    } else {
      // CREATE new
      const docRef = await adminDb.collection('assessments').add({
        ...assessmentData,
        createdAt: new Date()
      });
      docId = docRef.id;

      // 2. Trigger Notification (Only on create?)
      const { sendNotification } = await import('@/lib/notification-service');
      await sendNotification({
        userId: playerId,
        type: 'ASSESSMENT_COMPLETED',
        title: 'Laporan Latihan Tersedia!',
        message: `Coach ${session.user.name} baru saja menilai latihanmu. Cek raport digitalmu sekarang!`,
        link: `/member/history/${sessionId}/report`,
        metadata: { assessmentId: docId, sessionId }
      });
    }

    // 3. GAMIFICATION: Level Up Logic (Run on both create and update to ensure consistency)
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
            const { sendNotification } = await import('@/lib/notification-service');
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

    return NextResponse.json({ success: true, id: docId });

  } catch (error: any) {
    console.error("Assessment Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
