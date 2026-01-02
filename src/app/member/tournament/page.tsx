'use client';

import { Trophy, MapPin, Calendar, Clock, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TournamentPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [partnerName, setPartnerName] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch Tournaments
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', 'tournament'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      const data = await res.json();
      return data.data ? data.data.filter((e: any) => e.type === 'tournament') : [];
    }
  });

  // Fetch My Join Status
  const { data: joinedEvents = {} } = useQuery({
    queryKey: ['bookings', 'list', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/member/bookings?mode=list');
      const data = await res.json();
      const map: Record<string, string> = {};
      if (data.success && Array.isArray(data.data)) {
        data.data.forEach((b: any) => {
          map[b.eventId] = b.status;
        });
      }
      return map;
    },
    enabled: !!session?.user?.id
  });

  const handleJoin = async () => {
    if (!selectedEvent) return;

    // If External, Redirect
    if (selectedEvent.externalLink) {
      window.open(selectedEvent.externalLink, '_blank');
      return;
    }

    // Validate Partner
    if (selectedEvent.partnerMechanism === 'user' && !partnerName.trim()) {
      toast({ title: "Nama Partner Wajib", description: "Masukkan nama partner Anda.", variant: "destructive" });
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          partnerName: partnerName
        })
      });
      const result = await res.json();
      if (res.ok) {
        toast({ title: "Pendaftaran Berhasil!", description: "Status menunggu approval panitia." });
        setSelectedEvent(null);
        setPartnerName('');
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      } else {
        throw new Error(result.error || "Gagal daftar");
      }
    } catch (error: any) {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    } finally {
      setBookingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#ffbe00] mb-4" />
        <p className="font-mono text-[#ffbe00]">LOADING TOURNAMENTS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">

      {/* STANDARD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ca1f3d]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#ca1f3d]/10 flex items-center justify-center border border-[#ca1f3d]/20">
            <Trophy className="w-8 h-8 text-[#ca1f3d]" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              INFO <span className="text-[#ca1f3d]">TURNAMEN</span>
            </h1>
            <p className="text-gray-400 mt-1 max-w-xl text-sm">
              Kompetisi resmi, liga, dan turnamen terbuka.
            </p>
          </div>
        </div>
      </div>

      {/* EVENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-[#1A1A1A] rounded-[2rem] border border-white/5">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Belum Ada Turnamen Aktif</h3>
            <p className="text-gray-500">Persiapkan timmu untuk event berikutnya!</p>
          </div>
        ) : (
          events.map((event: any, index: number) => {
            const isJoined = !!joinedEvents[event.id];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-[#151515] border-white/5 overflow-hidden group hover:border-purple-500/30 transition-all duration-300 relative rounded-[2rem] h-full flex flex-col">
                  {/* Type Banner */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className={`${event.externalLink ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-[#ca1f3d]/10 text-[#ca1f3d] border-[#ca1f3d]/20'}`}>
                      {event.externalLink ? 'EXTERNAL' : 'INTERNAL'}
                    </Badge>
                  </div>

                  {/* Image Placeholder or Gradient */}
                  <div className="h-32 bg-gradient-to-br from-[#ca1f3d]/20 to-black relative">
                    <div className="absolute bottom-4 left-6">
                      <Badge variant="outline" className="bg-black/50 backdrop-blur border-white/10 text-white font-mono uppercase tracking-wider mb-2">
                        {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-1 flex-1">
                      <h3 className="text-2xl font-black text-white leading-tight group-hover:text-purple-500 transition-colors">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                        <MapPin className="w-4 h-4 text-purple-500" /> {event.location}
                      </div>
                      {event.organizer && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <ShieldCheck className="w-3 h-3" /> {event.organizer}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Biaya Pendaftaran</p>
                        <p className="text-lg font-black text-white">Rp {event.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => !isJoined && setSelectedEvent(event)}
                      disabled={isJoined}
                      className={`w-full h-12 rounded-xl font-bold text-lg ${isJoined
                        ? 'bg-green-500/10 text-green-500'
                        : (event.externalLink ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-[#ca1f3d] hover:bg-[#a61932] text-white')}`}
                    >
                      {isJoined ? "SUDAH DAFTAR" : (event.externalLink ? "INFO LENGKAP" : "DAFTAR SEKARANG")}
                      {event.externalLink && !isJoined && <ExternalLink className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={!!selectedEvent} onOpenChange={(o) => { if (!o) { setSelectedEvent(null); setPartnerName(''); } }}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white">
              {selectedEvent?.externalLink ? "Link Eksternal" : "Form Pendaftaran"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedEvent?.externalLink
                ? "Anda akan diarahkan ke website penyelenggara."
                : "Lengkapi data untuk mendaftar turnamen ini."}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && !selectedEvent.externalLink && (
            <div className="space-y-4 py-2">
              {selectedEvent.partnerMechanism === 'user' && (
                <div className="space-y-2">
                  <Label>Nama Partner</Label>
                  <Input
                    placeholder="Masukkan nama partner..."
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="bg-black/30 border-white/10 text-white"
                  />
                </div>
              )}
              <div className="bg-[#ca1f3d]/10 p-4 rounded-xl border border-[#ca1f3d]/20 text-center">
                <p className="text-sm text-[#ca1f3d]">Biaya Pendaftaran</p>
                <p className="text-xl font-black text-[#ffbe00]">Rp {selectedEvent.price.toLocaleString('id-ID')}</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setSelectedEvent(null)} className="rounded-xl text-gray-400 hover:text-white">Batal</Button>
            <Button
              onClick={handleJoin}
              disabled={bookingLoading}
              className="bg-[#ca1f3d] text-white hover:bg-[#a61932] rounded-xl font-bold px-8"
            >
              {bookingLoading ? "Proses..." : (selectedEvent?.externalLink ? "Buka Link" : "Kirim Pendaftaran")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
