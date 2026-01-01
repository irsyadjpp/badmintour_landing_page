"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

// Data Rubrik sesuai Dokumen TPF BCC 2026
const INDICATORS = [
  {
    id: "biomechanics",
    label: "1. Biomekanik (Grip & Wrist)",
    desc: "Efisiensi tenaga & cara pegang raket.",
    rubric: "1: Panhandle/Gebuk Kasur | 5: Backhand Grip Sempurna/Finger Power"
  },
  {
    id: "footwork",
    label: "2. Footwork (Gerak Kaki)",
    desc: "Kelincahan, Split Step & Recovery.",
    rubric: "1: Lambat/Seret | 5: Explosive & Efisien"
  },
  {
    id: "strokeQuality",
    label: "3. Stroke Quality (Lob & Clear)",
    desc: "Akurasi pukulan & Power generation.",
    rubric: "1: Tanggung/Out | 5: Garis Belakang Konsisten"
  },
  {
    id: "defense",
    label: "4. Defense (Pertahanan)",
    desc: "Refleks & Pengembalian smash.",
    rubric: "1: Panik/Takut Bola | 5: Tenang & Mengarahkan"
  },
  {
    id: "offense",
    label: "5. Offense (Smash & Drop)",
    desc: "Kekuatan serangan & Variasi.",
    rubric: "1: Asal Keras/Nyangkut | 5: Tajam & Mematikan"
  },
  {
    id: "gameIQ",
    label: "6. Game IQ (Taktik)",
    desc: "Rotasi, penempatan bola & pengambilan keputusan.",
    rubric: "1: Tabrakan/Bengong | 5: Anticipation & Reading Game"
  },
  {
    id: "physique",
    label: "7. Fisik & Mental",
    desc: "Stamina, napas & ketenangan.",
    rubric: "1: Habis Bensin/Emosi | 5: Stabil & Fokus"
  }
];

export function LiveAssessmentForm({ playerId, sessionId, playerName, onSubmitSuccess }: any) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();
  const { toast } = useToast();
  const scores = watch();

  // Helper untuk menghitung total & level real-time
  const calculateResult = () => {
    let total = 0;
    INDICATORS.forEach(ind => {
      total += (scores[ind.id] || 0);
    });

    // Klasifikasi Sederhana (Berdasarkan total skor 35)
    let level = "Beginner";
    if (total >= 28) level = "Advance (Elite)";
    else if (total >= 18) level = "Intermediate";

    return { total, level };
  };

  const result = calculateResult();

  const onSubmit = async (data: any) => {
    try {
      // Validasi semua skor terisi
      const missing = INDICATORS.find(ind => !scores[ind.id]);
      if (missing) {
        toast({ title: "Incomplete", description: `Nilai untuk ${missing.label} belum diisi.`, variant: "destructive" });
        return;
      }

      const response = await fetch("/api/coach/assessment", {
        method: "POST",
        body: JSON.stringify({
          playerId,
          sessionId,
          scores: data,
          totalScore: result.total,
          level: result.level,
          notes: data.notes
        }),
      });

      if (!response.ok) throw new Error("Gagal menyimpan");

      toast({ title: "Penilaian Berhasil", description: `Level: ${result.level} (Skor: ${result.total})` });
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      toast({ title: "Error", description: "Gagal menyimpan data", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="bg-muted/50 p-4 rounded-xl border border-border mb-4">
        <h3 className="font-bold text-lg text-foreground">{playerName}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-500" /> Live Assessment
        </p>
      </div>

      {INDICATORS.map((item) => (
        <Card key={item.id} className="border-l-4 border-l-[#ca1f3d] bg-[#151515] border-white/5 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-bold text-white">{item.label}</CardTitle>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {/* Skor 1-5 Radio Group Custom */}
            <div className="flex justify-between gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setValue(item.id, score)}
                  className={`
                    w-11 h-11 rounded-xl font-bold transition-all text-lg
                    ${scores[item.id] === score
                      ? "bg-[#ffbe00] text-black shadow-[0_0_15px_rgba(255,190,0,0.5)] scale-110"
                      : "bg-[#0a0a0a] text-gray-500 hover:bg-[#222] border border-white/5"}
                  `}
                >
                  {score}
                </button>
              ))}
            </div>
            <p className="text-[10px] italic text-gray-500 bg-[#0a0a0a] p-3 rounded-lg border border-white/5">
              <span className="font-semibold text-[#ffbe00]">Rubrik:</span> {item.rubric}
            </p>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-[#151515] border border-white/5 border-dashed">
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label className="font-bold mb-2 block text-gray-300">Catatan Tambahan (Opsional)</Label>
            <Textarea
              {...register("notes")}
              placeholder="Contoh: Perlu latihan wrist lagi, stamina drop di menit 20..."
              className="bg-[#0a0a0a] border-white/10 text-white focus:border-[#ca1f3d]"
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Skor</p>
              <p className="text-3xl font-black text-white">{result.total} <span className="text-sm font-normal text-gray-500">/ 35</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-400 mb-1">Prediksi Level</p>
              <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide
                ${result.level === 'Advance (Elite)' ? 'bg-[#ca1f3d] text-white shadow-[0_0_15px_rgba(202,31,61,0.5)]' :
                  result.level === 'Intermediate' ? 'bg-[#ffbe00] text-black shadow-[0_0_15px_rgba(255,190,0,0.5)]' : 'bg-green-600 text-white shadow-green-600/20 shadow-lg'}`}>
                {result.level}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full h-14 text-lg font-black rounded-xl shadow-lg bg-[#ca1f3d] hover:bg-[#a61932] text-white" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Simpan Penilaian"}
      </Button>
    </form>
  );
}
