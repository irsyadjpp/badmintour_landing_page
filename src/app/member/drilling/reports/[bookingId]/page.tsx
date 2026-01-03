'use client';

import { useQuery } from '@tanstack/react-query';
import AdminReportView, { AssessmentReport } from '@/components/admin/admin-report-view';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Loader2, ChevronLeft, FileX, Share2, Download } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { StoryCard } from '@/components/sharing/story-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

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

  const [isSharing, setIsSharing] = useState(false); // Controls Modal
  const [isGenerating, setIsGenerating] = useState(false); // Controls Canvas Generation

  const { data, isLoading, isError } = useQuery({
    queryKey: ['member-report', bookingId],
    queryFn: () => fetchReport(bookingId),
    enabled: !!bookingId
  });

  // Share Logic
  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('story-capture-area');
      if (!element) return;

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2, // High resolution
        backgroundColor: '#0a0a0a' // Match bg
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `report-${bookingId}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'My Drilling Report',
              text: 'Baru saja menyelesaikan sesi latihan di BadminTour! 🏸🔥 #BadmintonLife'
            });
          } catch (err) {
            console.log('Share cancelled', err);
          }
        } else {
          // Fallback: Download
          const link = document.createElement('a');
          link.download = `report-${bookingId}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
        setIsGenerating(false);
      }, 'image/png');

    } catch (error) {
      console.error("Share failed", error);
      setIsGenerating(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#ffbe00] animate-spin" />
      </div>
    );
  }

  if (isError || !data || !data.data) {
    // ... existing error state ...
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
          {/* 
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 rounded-xl" disabled>
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
           */}
          <Button
            onClick={() => setIsSharing(true)}
            className="bg-[#ca1f3d] text-white hover:bg-[#a01830] font-bold rounded-xl shadow-[0_0_20px_rgba(202,31,61,0.4)] hover:scale-105 transition-transform"
          >
            <Share2 className="w-4 h-4 mr-2" /> PAMERKAN PENCAPAIAN
          </Button>
        </div>
      </div>

      <AdminReportView report={reportData} />

      {/* Share Preview Modal */}
      <Dialog open={isSharing} onOpenChange={setIsSharing}>
        <DialogContent className="bg-[#151515] border-white/10 text-white rounded-[2rem] max-w-[400px] p-0 overflow-hidden flex flex-col items-center">

          <DialogHeader className="p-4 w-full bg-[#1a1a1a] border-b border-white/5">
            <DialogTitle className="text-center text-[#ffbe00] font-black uppercase tracking-widest text-sm">Preview Story</DialogTitle>
          </DialogHeader>

          <div className="relative">
            {/* Provide context for StoryCard */}
            <StoryCard report={reportData} />

            {/* Overlay while generating */}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                <Loader2 className="w-10 h-10 text-[#ffbe00] animate-spin mb-2" />
                <p className="text-white font-bold text-xs">MENYIAPKAN STORY...</p>
              </div>
            )}
          </div>

          <div className="p-4 w-full bg-[#1a1a1a] border-t border-white/5">
            <Button
              onClick={handleShare}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d] text-white font-black h-12 rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              <Share2 className="w-5 h-5 mr-2" /> SHARE SEKARANG
            </Button>
            <p className="text-center text-[10px] text-gray-500 mt-2">
              Otomatis membuka Instagram/TikTok jika tersedia.
            </p>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
