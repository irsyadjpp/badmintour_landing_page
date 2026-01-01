'use client';

import { useQuery } from '@tanstack/react-query';
import CoachingReportCard, { AssessmentReport } from '@/components/member/coaching-report-card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, FileX } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

// Fetch Report Data
const fetchReport = async (bookingId: string) => {
  // 1. Get Assessment by Booking ID (indirectly via sessionId + userId)
  // Ideally we need an endpoint: /api/member/bookings/[id]/report
  const res = await fetch(`/api/member/bookings/${bookingId}/report`);
  if (!res.ok) {
    if (res.status === 404) return null; // No report found
    throw new Error('Failed to fetch report');
  }
  return res.json();
};

export default function MemberReportPage() {
  const params = useParams();
  const bookingId = params.bookingId as string; // Check folder structure: [bookingId] -> params.bookingId

  const { data, isLoading, isError } = useQuery({
    queryKey: ['booking-report', bookingId],
    queryFn: () => fetchReport(bookingId),
    enabled: !!bookingId,
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !data || !data.data) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
          <FileX className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-xl font-bold">Laporan Tidak Ditemukan</h2>
        <p className="text-gray-400 max-w-sm">
          Mungkin Coach belum menuntaskan penilaian untuk sesi ini, atau data belum tersedia.
        </p>
        <Link href="/member/history">
          <Button variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/10">
            Kembali ke Riwayat
          </Button>
        </Link>
      </div>
    );
  }

  const reportData: AssessmentReport = {
    date: format(new Date(data.data.createdAt), 'dd MMMM yyyy', { locale: localeId }),
    coachName: data.data.coachName || 'Coach',
    moduleTitle: data.eventTitle || 'Sesi Latihan', // Passed from API
    level: data.data.level,
    totalScore: data.data.totalScore,
    scores: data.data.scores,
    notes: data.data.notes
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/member/history">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white pl-0">
              <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
          </Link>
        </div>

        <CoachingReportCard report={reportData} />
      </div>
    </div>
  );
}
