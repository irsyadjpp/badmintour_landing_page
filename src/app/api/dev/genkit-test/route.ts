
import { NextResponse } from 'next/server';
import { generateDrillingReport } from '@/ai/flows/generate-drilling-report';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Direct call to Genkit Flow
    const feedback = await generateDrillingReport({
      playerName: body.playerName,
      level: body.level,
      scores: body.scores,
      coachNotes: body.coachNotes
    });

    return NextResponse.json({ output: feedback });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
