'use client';

import { useQuery } from '@tanstack/react-query';
import CoachingReportCard, { AssessmentReport } from '@/components/member/coaching-report-card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, FileX, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

// Fetch Report Data (Reusing existing API which allows Admin)
const fetchReport = async (bookingId: string) => {
  const res = await fetch(`/api/member/bookings/${bookingId}/report`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch report');
  }
  return res.json();
};

export default function AdminReportPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-report', bookingId],
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

  const reportData: AssessmentReport = {
    date: format(new Date(data.data.createdAt), 'dd MMMM yyyy', { locale: localeId }),
    coachName: data.data.coachName || 'Coach',
    moduleTitle: data.eventTitle || 'Sesi Latihan',
    level: data.data.level,
    totalScore: data.data.totalScore,
    scores: data.data.scores,
    notes: data.data.notes
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-2 p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-sm font-bold text-white">Pratinjau Laporan</h1>
              <p className="text-xs text-gray-500">Mode Admin</p>
            </div>
          </div>
          <Badge className="bg-[#ca1f3d]/10 text-[#ca1f3d] border border-[#ca1f3d]/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> ADMIN VIEW
          </Badge>
        </div>

        <CoachingReportCard report={reportData} />

        {/* Admin Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white" onClick={() => window.print()}>
            Cetak PDF
          </Button>
          {/* Future: Edit Assessment Button */}
        </div>
      </div>
    </div>
  );
}
