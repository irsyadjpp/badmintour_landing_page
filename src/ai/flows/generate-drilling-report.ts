
import { ai } from '../genkit';
import { z } from 'zod';

// Skema Input (Data dari Form Coach)
export const AssessmentSchema = z.object({
   playerName: z.string(),
   level: z.string(), // Beginner, Intermediate, Advance
   scores: z.object({
      biomechanics: z.number(),
      footwork: z.number(),
      strokeQuality: z.number(),
      defense: z.number(),
      offense: z.number(),
      gameIQ: z.number(),
      physique: z.number(),
   }),
   coachNotes: z.string().optional(), // Catatan singkat coach (misal: "kaki berat")
});

export const generateDrillingReport = ai.defineFlow(
   {
      name: 'generateDrillingReport',
      inputSchema: AssessmentSchema,
      outputSchema: z.object({
         strengths: z.string(),
         weaknesses: z.string(),
         suggestion: z.string(),
         conclusion: z.string(), // NEW: Executive Summary
         skills: z.object({
            biomechanics: z.string(),
            footwork: z.string(),
            strokeQuality: z.string(),
            defense: z.string(),
            offense: z.string(),
            gameIQ: z.string(),
            physique: z.string(),
         })
      }),
   },
   async (input) => {
      const { playerName, scores, coachNotes, level } = input;

      const prompt = `
      Anda adalah Pelatih Kepala Badminton Senior. Berikan evaluasi mendalam untuk:
      Nama: ${playerName} (${level})

      SKOR (1-5):
      1. BIOMEKANIK: ${scores.biomechanics}
      2. FOOTWORK: ${scores.footwork}
      3. STROKES: ${scores.strokeQuality}
      4. SMASH: ${scores.offense}
      5. DEFENSE: ${scores.defense}
      6. TACTICS: ${scores.gameIQ}
      7. PHYSIQUE: ${scores.physique}

      Catatan Coach: "${coachNotes || '-'}"

      TUGAS:
      Berikan analisis per poin DAN kesimpulan umum dalam format JSON.
      
      Panduan Analisis Per Skill (Max 1 kalimat tajam per skill):
      - Biomekanik: Grip & lecutan.
      - Footwork: Kelincahan & split step.
      - Strokes: Kualitas pukulan backhand/overhead.
      - Smash: Power & akurasi.
      - Defense: Ketenangan & pengembalian.
      - Tactics: Pilihan pukulan & posisi.
      - Physique: Stamina & mental.

      OUTPUT WAJIB JSON (Tanpa markdown):
      {
        "strengths": "[Pilih 1 skill nilai tertinggi, jelaskan kenapa bagus]",
        "weaknesses": "[Pilih 1 skill nilai terendah, jelaskan kekurangannya]",
        "suggestion": "[Saran latihan prioritas]",
        "conclusion": "[Satu paragraf naratif (3-4 kalimat) yang merangkum keseluruhan performa pemain. Jelaskan potensi mereka dan apa fokus utama selanjutnya. Gunakan gaya bahasa 'Coach' yang memotivasi tapi objektif.]",
        "skills": {
          "biomechanics": "[Analisis singkat 1 kalimat]",
          "footwork": "[Analisis singkat 1 kalimat]",
          "strokeQuality": "[Analisis singkat 1 kalimat]",
          "offense": "[Analisis singkat 1 kalimat]",
          "defense": "[Analisis singkat 1 kalimat]",
          "gameIQ": "[Analisis singkat 1 kalimat]",
          "physique": "[Analisis singkat 1 kalimat]"
        }
      }
    `;

      const result = await ai.generate(prompt);
      // Genkit automatically parses JSON if schema is provided, but safe parsing is good practice
      try {
         // If result.output is already an object (handled by Genkit middleware)
         return result.output || JSON.parse(result.text);
      } catch (e) {
         // Fallback if raw text
         const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
         return JSON.parse(cleaned);
      }
   }
);
