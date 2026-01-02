'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LiveAssessmentForm } from '@/components/coach/live-assessment-form';
import { ChevronLeft, Loader2, Dumbbell, UserCheck, Calendar, CheckCircle2, Users, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// Fetch Session Details & Participants
const fetchSessionDetails = async (sessionId: string) => {
  const eventRes = await fetch(`/api/events/${sessionId}`);
  const eventData = await eventRes.json();

  const participantsRes = await fetch(`/api/coach/session/${sessionId}/participants`);
  if (!participantsRes.ok) throw new Error('Failed to load participants');
  const participantsData = await participantsRes.json();

  return { event: eventData.data, participants: participantsData.data };
};

export default function SessionAssessmentPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['session-assessment', sessionId],
    queryFn: () => fetchSessionDetails(sessionId),
    enabled: !!sessionId
  });

  const handleCheckIn = async (bookingId: string, status: boolean) => {
    try {
      const res = await fetch(`/api/coach/session/${sessionId}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, isCheckedIn: status })
      });

      if (res.ok) {
        refetch(); // Refresh data
        toast({ title: status ? "Checked In" : "Checked Out", className: "bg-green-600 text-white" });
      } else {
        toast({ title: "Gagal update absensi", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#ca1f3d]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-center text-white">
        <h2 className="text-xl font-bold text-red-500">Gagal memuat sesi</h2>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  const { event, participants } = data;

  return (
    <main className="pb-20">
      {/* Header Section (Matching Admin Style) */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href="/coach/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              {event.title}
            </h1>
          </div>
          <p className="text-gray-400 font-bold mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#ca1f3d]" />
            {event.date ? format(new Date(event.date), 'EEEE, dd MMMM yyyy', { locale: idLocale }) : '-'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Players Card */}
        <div className="bg-[#151515] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-[#ca1f3d]/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ca1f3d]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#ca1f3d]/10 transition"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#ca1f3d]/10 text-[#ca1f3d] border border-[#ca1f3d]/20 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Total</span>
            </div>
            <div>
              <h3 className="text-5xl font-black text-white tracking-tight">{participants.length}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Participants</p>
            </div>
          </div>
        </div>

        {/* Assessment Progress Card */}
        <div className="bg-[#151515] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-[#ffbe00]/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffbe00]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#ffbe00]/10 transition"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Progress</span>
            </div>
            <div>
              <h3 className="text-5xl font-black text-white tracking-tight">
                {participants.filter((p: any) => p.hasAssessment).length} <span className="text-2xl text-gray-600">/ {participants.length}</span>
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Assessed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants List Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-white hover:text-[#ca1f3d] transition-colors flex items-center gap-2">
          Participants List <span className="text-sm font-normal text-gray-500 ml-2">(Check-In first → then Tap to Assess)</span>
        </h3>

        {participants.length === 0 ? (
          <div className="bg-[#151515] border border-white/5 border-dashed rounded-[2.5rem] p-12 text-center text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold">No participants found for this session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participants.map((player: any) => (
              <div key={player.bookingId} className={`
                relative p-6 rounded-[2.5rem] flex items-center justify-between transition-all group border
                ${player.hasAssessment
                  ? 'bg-[#151515] border-green-500/20'
                  : 'bg-[#151515] border-[#ca1f3d]/50 shadow-lg cursor-pointer hover:bg-[#1A1A1A] hover:-translate-y-1'
                }
              `}>

                {/* CHECK-IN SWITCH */}
                <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase transition-colors ${player.checkInAt ? 'text-green-500' : 'text-gray-600'}`}>
                    {player.checkInAt ? 'Hadir' : 'Absen'}
                  </span>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckIn(player.bookingId, !player.checkInAt);
                    }}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors flex items-center ${player.checkInAt ? 'bg-green-500' : 'bg-gray-800 border border-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${player.checkInAt ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>

                {/* CLICK AREA FOR LINK */}
                <Link href={`/coach/session/${sessionId}/assess/${player.userId}`} className="flex-1 text-left outline-none">
                  <div className="flex items-center gap-5">
                    <Avatar className={`w-16 h-16 border-2 transition-colors ${player.hasAssessment ? 'border-green-500/20' : 'border-[#ca1f3d]'}`}>
                      <AvatarImage src={player.userImage} className="object-cover" />
                      <AvatarFallback className="bg-[#0a0a0a] text-lg font-black text-gray-500">{player.userName?.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className={`font-black text-xl transition-colors uppercase italic ${player.hasAssessment ? 'text-gray-500' : 'text-white'}`}>
                        {player.userName}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-[10px] h-6 bg-[#0a0a0a] text-gray-500 font-mono tracking-widest border border-white/5">
                          {player.bookingCode}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] h-6 px-2 font-bold uppercase tracking-widest border ${player.status === 'paid' ? 'text-green-500 border-green-500/50 bg-green-500/10' : 'text-blue-500 border-blue-500/50 bg-blue-500/10'}`}>
                          {player.status}
                        </Badge>
                        {player.hasAssessment ? (
                          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-0.5 rounded-full border border-green-500/20 uppercase tracking-wider">Completed</span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-800/20 px-3 py-0.5 rounded-full border border-gray-700/50 uppercase tracking-wider flex items-center gap-2 group-hover:text-[#ffbe00] group-hover:border-[#ffbe00]/30 transition-colors">
                            Tap to Assess
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>


            ))}
          </div>
        )}
      </div>
    </main >
  );
}
