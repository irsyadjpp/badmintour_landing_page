'use client';

import { useQuery } from '@tanstack/react-query';
import AdminReportView, { AssessmentReport } from '@/components/admin/admin-report-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Loader2, ChevronLeft, FileX, ShieldCheck, ClipboardCheck, Dumbbell, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Fetch Report Data
const fetchReport = async (bookingId: string) => {
  const res = await fetch(`/api/member/bookings/${bookingId}/report`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch report');
  }
  return res.json();
};

export default function CoachReportPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['coach-report', bookingId],
    queryFn: () => fetchReport(bookingId),
    enabled: !!bookingId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00f2ea] animate-spin" />
      </div>
    );
  }

  if (isError || !data || !data.data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
          <FileX className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-xl font-bold">Laporan Tidak Ditemukan</h2>
        <Button variant="outline" onClick={() => router.back()} className="mt-4 border-white/10 text-white hover:bg-white/10">
          Kembali
        </Button>
      </div>
    );
  }

  // Safe Date Parser
  const getSafeDate = (dateVal: any) => {
    if (!dateVal) return new Date();

    // Handle Firestore Timestamp (has .toDate)
    if (typeof dateVal === 'object' && typeof dateVal.toDate === 'function') {
      return dateVal.toDate();
    }

    const d = new Date(dateVal);
    // Check if valid date
    if (isNaN(d.getTime())) return new Date();

    return d;
  };

  const reportData: AssessmentReport = {
    date: format(getSafeDate(data.data.createdAt), 'dd MMMM yyyy', { locale: localeId }),
    coachName: data.data.coachName || 'Coach',
    moduleTitle: data.eventTitle || 'Sesi Latihan',
    level: data.data.level,
    totalScore: data.data.totalScore,
    scores: data.data.scores,
    notes: data.data.notes,
    aiFeedback: data.data.aiFeedback,
    skillAnalysis: data.data.skillAnalysis
  };

  const sessionId = data.data.sessionId;
  const playerId = data.data.playerId;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <ClipboardCheck className="w-8 h-8 text-[#ffbe00]" /> PRATINJAU PELATIH
          </h1>
          <p className="text-gray-400 text-sm">Review hasil assessment member sebelum dipublikasi.</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()} className="bg-white text-black hover:bg-white/90 font-bold">
          <ChevronLeft className="w-5 h-5 mr-2" /> Kembali
        </Button>
      </div>

      <div className="w-full">
        {/* Identity Bar (Coach Mode) */}
        <div className="flex items-center justify-between mb-6 p-4 border border-white/5 rounded-2xl bg-[#1A1A1A]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-[#ffbe00]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Coach Review Mode</h3>
              <p className="text-xs text-gray-500 font-mono">Session ID: {sessionId ? sessionId.substring(0, 8) : '-'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {sessionId && playerId && (
              <Link href={`/coach/session/${sessionId}/assess/${playerId}`}>
                <Button size="sm" className="bg-[#ffbe00] text-black hover:bg-[#ffbe00]/90 font-bold">
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Button>
              </Link>
            )}
          </div>
        </div>

        <AdminReportView report={reportData} />

      </div>
    </div>
  );
}
