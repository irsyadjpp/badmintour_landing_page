'use client';

import { useQuery } from '@tanstack/react-query';
import AdminReportView, { AssessmentReport } from '@/components/admin/admin-report-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Loader2, ChevronLeft, FileX, ShieldCheck, ClipboardCheck, Download } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAssessmentPdf } from '@/hooks/use-assessment-pdf';
import { AssessmentRadarPDF } from '@/components/pdf/assessment-radar-pdf';

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

  const { isGenerating, downloadPdf } = useAssessmentPdf();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-report', bookingId],
    queryFn: () => fetchReport(bookingId),
    enabled: !!bookingId
  });

  const handleDownloadPDF = () => {
    if (!data?.data) return;
    // Format: nickname_event-name_event-date.pdf
    const nickname = (data.playerName || 'User').replace(/\s+/g, '_');
    const eventName = (data.eventTitle || 'Session').replace(/\s+/g, '_');
    const dateStr = format(new Date(data.data.createdAt), 'yyyy-MM-dd');
    const filename = `${nickname}_${eventName}_${dateStr}.pdf`;

    downloadPdf(reportData, 'admin-pdf-radar-chart', filename);
  };

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
    skillAnalysis: data.data.skillAnalysis,
    strengths: data.data.strengths,
    weaknesses: data.data.weaknesses
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <ClipboardCheck className="w-8 h-8 text-[#ffbe00]" /> INSPEKSI LAPORAN
          </h1>
          <p className="text-gray-400">Pratinjau hasil assessment member.</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()} className="bg-white text-black hover:bg-white/90 font-bold">
          <ChevronLeft className="w-5 h-5 mr-2" /> Kembali
        </Button>
      </div>

      <div className="w-full">
        {/* Identity Bar */}
        <div className="flex items-center justify-between mb-6 p-4 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#ffbe00]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Admin Verification Mode</h3>
              <p className="text-xs text-gray-500 font-mono">ID: {bookingId}</p>
            </div>
          </div>
          <Badge variant="outline" className="border-[#ffbe00] text-[#ffbe00]">
            OFFICIAL RECORD
          </Badge>
        </div>

        <div id="admin-report-content" className="bg-[#151515] p-4 rounded-[2rem]">
          <AdminReportView report={reportData} />
        </div>

        {/* Hidden Chart */}
        <AssessmentRadarPDF report={reportData} id="admin-pdf-radar-chart" />

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="secondary"
            className="bg-white text-black font-bold rounded-xl"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export PDF (Admin)
          </Button>
        </div>
      </div>
    </div>
  );
}
