'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StatusModal } from "@/components/ui/status-modal";
import { Loader2, CheckCircle2, ChevronLeft, Save, Target, TrendingUp, AlertTriangle, BrainCircuit } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

// Data Rubrik
const INDICATORS = [
  {
    id: "biomechanics",
    label: "1. Biomekanik (Grip & Wrist)",
    desc: "Efisiensi tenaga & cara pegang raket. Apakah grip benar untuk setiap pukulan?",
    rubric: "1: Panhandle/Gebuk Kasur | 3: Grip Benar tapi Kaku | 5: Backhand Grip Sempurna/Finger Power"
  },
  {
    id: "footwork",
    label: "2. Footwork (Gerak Kaki)",
    desc: "Kelincahan, Split Step & Recovery. Kualitas gerakan ke sudut lapangan.",
    rubric: "1: Lambat/Seret/Lari | 3: Ada Split Step | 5: Explosive, Efisien & Floating"
  },
  {
    id: "strokeQuality",
    label: "3. Stroke Quality (Lob & Clear)",
    desc: "Akurasi pukulan & Power generation. Konsistensi pukulan.",
    rubric: "1: Tanggung/Out Banyak | 3: Masuk Lapangan | 5: Garis Belakang Konsisten & Tajam"
  },
  {
    id: "defense",
    label: "4. Defense (Pertahanan)",
    desc: "Refleks & Pengembalian smash. Ketenangan saat ditekan.",
    rubric: "1: Panik/Takut Bola | 3: Bisa Balikin | 5: Tenang & Mengarahkan ke Kosong"
  },
  {
    id: "offense",
    label: "5. Offense (Smash & Drop)",
    desc: "Kekuatan serangan & Variasi.",
    rubric: "1: Asal Keras/Nyangkut | 3: Masuk Biasa | 5: Tajam, Curam & Mematikan"
  },
  {
    id: "gameIQ",
    label: "6. Game IQ (Taktik)",
    desc: "Rotasi, penempatan bola & pengambilan keputusan.",
    rubric: "1: Tabrakan/Bengong | 3: Mengerti Rotasi Dasar | 5: Anticipation & Reading Game"
  },
  {
    id: "physique",
    label: "7. Fisik & Mental",
    desc: "Stamina, napas & ketenangan.",
    rubric: "1: Habis Bensin/Emosi | 3: Cukup untuk 1 Game | 5: Stabil, Fokus & Spartan"
  }
];

export default function LiveAssessmentPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const studentId = params.studentId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();
  const scores = watch();

  // Fetch student name (optional, nicer UX)
  // Fetch student profile
  const { data: student } = useQuery({
    queryKey: ['student-profile', studentId],
    queryFn: async () => {
      const res = await fetch(`/api/coach/session/${sessionId}/participants`);
      const json = await res.json();
      return json.data.find((p: any) => p.userId === studentId);
    }
  });

  // Fetch Existing Assessment (Edit Mode)
  const { data: existingAssessment } = useQuery({
    queryKey: ['existing-assessment', sessionId, studentId],
    queryFn: async () => {
      const res = await fetch(`/api/coach/assessment?sessionId=${sessionId}&playerId=${studentId}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
    enabled: !!sessionId && !!studentId
  });

  // Populate form if existing data found
  const [isEditMode, setIsEditMode] = useState(false);

  // Effect to populate form
  useEffect(() => {
    if (existingAssessment) {
      setIsEditMode(true);
      // Populate Scores
      if (existingAssessment.scores) {
        Object.keys(existingAssessment.scores).forEach(key => {
          setValue(key, existingAssessment.scores[key]);
        });
      }
      // Populate Notes
      setValue("notes", existingAssessment.notes);
      setValue("strengths", existingAssessment.strengths);
      setValue("weaknesses", existingAssessment.weaknesses);
    }
  }, [existingAssessment, setValue]);

  // Status Modal State
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    description: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    description: ''
  });

  // Calculate result
  const calculateResult = () => {
    let total = 0;
    INDICATORS.forEach(ind => {
      total += (Number(scores[ind.id]) || 0);
    });

    // Klasifikasi
    let level = "Beginner";
    if (total >= 28) level = "Advance";
    else if (total >= 18) level = "Intermediate";

    const percentage = Math.round((total / 35) * 100);

    return { total, level, percentage };
  };

  const result = calculateResult();

  const onSubmit = async (data: any) => {
    try {
      const missing = INDICATORS.find(ind => !scores[ind.id]);
      if (missing) {
        setStatusModal({
          isOpen: true,
          type: 'error',
          title: 'DOUBLE FAULT!',
          description: `Nilai untuk ${missing.label} belum diisi. Mohon lengkapi semua skor.`
        });
        return;
      }

      const response = await fetch("/api/coach/assessment", {
        method: "POST",
        body: JSON.stringify({
          playerId: studentId,
          playerName: student?.userName || student?.name || "Student",
          sessionId,
          scores: data,
          totalScore: result.total,
          level: result.level,
          notes: data.notes,
          strengths: data.strengths,
          weaknesses: data.weaknesses
        }),
      });

      if (!response.ok) throw new Error("Gagal menyimpan");

      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'ACE! SERVICE MASUK!',
        description: `Raport untuk ${student?.userName || 'Student'} berhasil disimpan & Dianalisis AI.`,
        onAction: () => router.push(`/coach/session/${sessionId}/assess`)
      });

    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'DOUBLE FAULT!',
        description: 'Gagal menyimpan data ke server. Silakan coba lagi.'
      });
    }
  };

  return (
    <div className="pb-20 p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href={`/coach/session/${sessionId}/assess`} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" /> Cancel & Back
        </Link>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4 mt-2">
            <Avatar className="w-20 h-20 border-4 border-[#151515] shadow-2xl ring-2 ring-[#ffbe00]/20">
              <AvatarImage src={student?.userImage} />
              <AvatarFallback className="bg-[#222] text-xl font-black text-[#ffbe00]">
                {student?.userName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter shadow-black drop-shadow-lg flex items-center gap-4">
                {student?.userName || 'Loading...'}
                {isEditMode && (
                  <span className="text-xs md:text-sm font-bold bg-[#ffbe00] text-black px-2 py-1 rounded-md tracking-normal not-italic shadow-[0_0_15px_rgba(255,190,0,0.5)] animate-pulse">
                    EDIT MODE
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {student?.nickname && (
                  <span className="text-[#ffbe00] font-bold text-lg uppercase tracking-widest bg-[#ffbe00]/10 px-3 py-0.5 rounded-lg border border-[#ffbe00]/20">
                    "{student.nickname}"
                  </span>
                )}
                <Badge variant="outline" className="border-white/20 text-gray-400">
                  Level: {student?.level || 'Beginner'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-400">CURRENT SCORE</div>
            <div className="text-4xl font-black text-white">{result.total} <span className="text-lg text-gray-600">/ 35</span></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Metrics */}
        <div className="lg:col-span-7 space-y-6">
          {INDICATORS.map((item, index) => (
            <Card key={item.id} className="bg-[#151515] border-white/5 border-l-4 border-l-[#ca1f3d] shadow-lg group hover:border-l-[#ffbe00] transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span className="text-lg font-bold text-white group-hover:text-[#ffbe00] transition-colors">{item.label}</span>
                  {scores[item.id] && (
                    <span className="text-2xl font-black text-[#ffbe00]">{scores[item.id]}</span>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setValue(item.id, score)}
                      className={`
                                                flex-1 h-12 rounded-xl font-bold transition-all text-lg border
                                                ${scores[item.id] === score
                          ? "bg-[#ffbe00] text-black border-[#ffbe00] shadow-[0_0_15px_rgba(255,190,0,0.4)] scale-105"
                          : "bg-[#0a0a0a] text-gray-600 border-white/5 hover:bg-[#222] hover:text-white"}
                                            `}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="bg-[#0a0a0a] p-3 rounded-lg border border-white/5 text-[11px] text-gray-500 font-mono">
                  <span className="text-[#ca1f3d] font-bold">INFO:</span> {item.rubric}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column: Summary & Notes */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] sticky top-6 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Predicted Level</h3>
              <div className={`text-3xl font-black uppercase italic ${result.level === 'Advance' ? 'text-[#ca1f3d]' :
                result.level === 'Intermediate' ? 'text-[#ffbe00]' : 'text-green-500'
                }`}>
                {result.level} PLAYER
              </div>
              <div className="w-full bg-[#0a0a0a] h-2 rounded-full mt-4 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-[#ffbe00] to-[#ca1f3d] transition-all duration-700"
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-white font-bold flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#ffbe00]" /> Student's Strengths (Kelebihan)
                </Label>
                <Textarea
                  {...register("strengths")}
                  className="bg-[#0a0a0a] border-white/10 rounded-xl min-h-[80px] focus:border-[#ffbe00] text-white"
                  placeholder="Contoh: Power smash kencang, footwork lincah..."
                />
              </div>

              <div>
                <Label className="text-white font-bold flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#ca1f3d]" /> Weaknesses (Kekurangan)
                </Label>
                <Textarea
                  {...register("weaknesses")}
                  className="bg-[#0a0a0a] border-white/10 rounded-xl min-h-[80px] focus:border-[#ca1f3d] text-white"
                  placeholder="Contoh: Backhand lemah, mudah emosi..."
                />
              </div>

              <div>
                <Label className="text-white font-bold flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" /> Additional Notes
                </Label>
                <Textarea
                  {...register("notes")}
                  className="bg-[#0a0a0a] border-white/10 rounded-xl min-h-[80px] text-white"
                  placeholder="Catatan umum atau pesan semangat..."
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a61932] text-white font-black rounded-xl text-lg shadow-[0_0_20px_rgba(202,31,61,0.4)] hover:shadow-[0_0_30px_rgba(202,31,61,0.6)] hover:scale-[1.02] transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                  <div className="flex items-center gap-2">
                    <span>SIMPAN & ANALISIS</span>
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </form>
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        description={statusModal.description}
        actionLabel={statusModal.type === 'success' ? "KEMBALI KE LIST" : "COBA LAGI"}
        onAction={statusModal.onAction}
      />
    </div>
  );
}
