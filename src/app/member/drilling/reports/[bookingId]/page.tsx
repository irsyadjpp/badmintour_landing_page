'use client';

import { useQuery } from '@tanstack/react-query';
import AdminReportView, { AssessmentReport } from '@/components/admin/admin-report-view';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Loader2, ChevronLeft, FileX, Share2, Download } from 'lucide-react';
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

export default function MemberReportPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['member-report', bookingId],
    queryFn: () => fetchReport(bookingId),
    enabled: !!bookingId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#ffbe00] animate-spin" />
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
        <p className="text-gray-500">Hasil latihan belum tersedia atau ID salah.</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4 border-white/10 text-white hover:bg-white/10">
          Kembali
        </Button>
      </div>
    );
  }

  // Safe Date Parser
  const getSafeDate = (dateVal: any) => {
    if (!dateVal) return new Date();
    if (typeof dateVal === 'object' && typeof dateVal.toDate === 'function') {
      return dateVal.toDate();
    }
    const d = new Date(dateVal);
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

  return (
    <div className="space-y-8 pb-20 pt-8 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/member/drilling" className="inline-flex items-center text-gray-400 hover:text-white mb-2 text-sm font-bold transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Latihan
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
            <span className="text-[#ffbe00]">MY</span> PERFORMANCE
          </h1>
          <p className="text-gray-400 text-sm">Hasil analisis skill dari Coach profesional.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 rounded-xl" disabled>
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button className="bg-[#ffbe00] text-black hover:bg-[#ffbe00]/90 font-bold rounded-xl">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      <AdminReportView report={reportData} />
    </div>
  );
}
