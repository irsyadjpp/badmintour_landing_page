'use client';

import { useQuery } from '@tanstack/react-query';
import MemberReportView, { AssessmentReport } from '@/components/member/member-report-view';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, FileX } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

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
    queryKey: ['booking-report', bookingId],
    queryFn: () => fetchReport(bookingId),
    enabled: !!bookingId,
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader2 className="w-10 h-10 text-[#00f2ea] animate-spin" />
      </div>
    );
  }

  if (isError || !data || !data.data) {
    return (
      <div className="min-h-screen text-white p-8 pt-32 flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
          <FileX className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-xl font-bold">Laporan Tidak Ditemukan</h2>
        <p className="text-gray-400 max-w-sm">
          Coach belum mengirimkan penilaian untuk sesi ini.
        </p>
        <Link href="/member/history">
          <Button variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/10">
            Kembali ke Riwayat
          </Button>
        </Link>
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
    notes: data.data.notes
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
          HASIL <span className="text-[#ffbe00]">EVALUASI</span>
        </h1>
        <Button variant="secondary" onClick={() => router.back()} className="bg-white text-black font-bold">
          <ChevronLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
      </div>

      <MemberReportView report={reportData} />
    </div>
  );
}
