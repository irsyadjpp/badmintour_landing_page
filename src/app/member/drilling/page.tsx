'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, MapPin, Calendar, Clock, Dumbbell, User, Info, Search, Filter, ChevronRight, ArrowLeft, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Material3Input } from '@/components/ui/material-3-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { StatusModal } from '@/components/ui/status-modal';

function DrillingEventContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // UI State
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const [guestForm, setGuestForm] = useState({ name: '', phone: '' });

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    description: ''
  });

  // React Query: Fetch Events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'drilling'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      const data = await res.json();
      return data.data ? data.data.filter((e: any) => e.type === 'drilling') : [];
    }
  });

  // React Query: Fetch Bookings
  const { data: joinedEvents = {} } = useQuery({
    queryKey: ['bookings', 'list', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/member/bookings?mode=list');
      const data = await res.json();
      const map: Record<string, string> = {};
      if (data.success && Array.isArray(data.data)) {
        data.data.forEach((b: any) => {
          // Handle both new "event object" structure and flat structure
          const eId = b.event?.id || b.eventId;
          map[eId] = b.id || b.bookingId;
        });
      }
      return map;
    },
    enabled: !!session?.user?.id
  });

  // Derived Selection State (Sync with URL)
  useEffect(() => {
    if (events.length > 0) {
      if (eventId) {
        const found = events.find((e: any) => e.id === eventId);
        if (found) setSelectedEvent(found);
      } else {
        setSelectedEvent(null);
      }
    }
  }, [eventId, events]);

  // Handle pindah view
  const handleSelectEvent = (id: string) => {
    router.push(`/member/drilling?id=${id}`);
  };

  const handleBackToList = () => {
    router.push('/member/drilling');
  };

  // ACTION: JOIN BOOKING
  const handleBooking = async () => {
    if (!selectedEvent) return;

    if (!session && (!guestForm.name || !guestForm.phone)) {
      // toast({ title: "Data Kurang", description: "Tamu wajib isi Nama & WhatsApp.", variant: "destructive" });
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Data Kurang',
        description: 'Tamu wajib isi Nama & WhatsApp.'
      });
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          guestName: guestForm.name,
          guestPhone: guestForm.phone
        })
      });

      const result = await res.json();

      if (result.success) {
        if (!result.isGuest) {
          // toast({ title: "Berhasil Join!", description: "Anda telah terdaftar." });
          setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Berhasil Join Sesi!',
            description: 'Anda telah terdaftar sebagai peserta.'
          });
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['events', 'drilling'] }),
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
          ]);
          router.push('/member/dashboard');
        } else {
          // toast({ title: "Booking Berhasil!", description: "Simpan bukti booking Anda.", className: "bg-green-600 text-white" });
          setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Booking Berhasil!',
            description: 'Silakan cek WhatsApp untuk detail pembayaran.'
          });
          router.push('/');
        }
      } else {
        throw new Error(result.error || "Gagal booking");
      }
    } catch (error: any) {
      // toast({ title: "Gagal Join", description: error.message, variant: "destructive" });
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Gagal Join Sesi',
        description: error.message || 'Terjadi kesalahan sistem.'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // ACTION: LEAVE / CANCEL BOOKING
  const handleLeave = async (targetEventId: string) => {
    const bookingId = joinedEvents[targetEventId];
    if (!bookingId) return;

    if (!confirm("Yakin ingin membatalkan/keluar dari sesi ini?")) return;

    setCancelLoading(true);
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });

      if (res.ok) {
        // toast({ title: "Berhasil Keluar", description: "Slot Anda telah dikembalikan." });
        setStatusModal({
          isOpen: true,
          type: 'success',
          title: 'Berhasil Membatalkan',
          description: 'Slot Anda telah dikembalikan. Refund akan diproses manual admin.'
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['events', 'drilling'] }),
          queryClient.invalidateQueries({ queryKey: ['bookings'] })
        ]);
      } else {
        throw new Error("Gagal membatalkan");
      }
    } catch (error: any) {
      // toast({ title: "Gagal", description: error.message, variant: "destructive" });
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Gagal Membatalkan',
        description: error.message || 'Terjadi kesalahan sistem.'
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // Derived Data
  const filteredEvents = events.filter((e: any) => filterLevel === 'all' || e.skillLevel === filterLevel);

  if (eventsLoading) {
    return (
      <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#ffbe00] mb-4" />
        <p className="font-mono text-[#ffbe00]">LOADING CLASS DATA...</p>
      </div>
    );
  }

  // --- VIEW: LIST (DIRECTORY) ---
  if (!selectedEvent) {
    return (
      <div className="space-y-8 pb-20">

        {/* HEADER STANDARD MEMBER MATCHING DASHBOARD/PROFILE */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/5 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Title matches "Identity" style */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ffbe00]/10 flex items-center justify-center border border-[#ffbe00]/20">
              <Dumbbell className="w-8 h-8 text-[#ffbe00]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                DRILLING <span className="text-[#ca1f3d]">ZONE</span>
              </h1>
              <p className="text-gray-400 mt-1 max-w-xl text-sm">
                Tingkatkan skill badmintonmu bersama pelatih profesional.
              </p>
            </div>
          </div>

          {/* Filter Tabs (Gold/Red) */}
          <div className="flex gap-2 bg-[#1A1A1A] p-1.5 rounded-xl border border-white/5">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filterLevel === level
                  ? 'bg-[#ffbe00] text-black shadow-[0_0_15px_rgba(255,190,0,0.4)]'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* LIST GRID */}
        {filteredEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6"
          >
            {filteredEvents.map((event: any) => {
              const isJoined = !!joinedEvents[event.id];

              return (
                <Card
                  key={event.id}
                  onClick={() => !isJoined && handleSelectEvent(event.id)}
                  className={`bg-[#151515] border-white/5 overflow-hidden group transition-all duration-300 relative ${isJoined ? 'border-green-500/30' : 'hover:border-[#ffbe00]/50 hover:-translate-y-2 cursor-pointer'}`}
                >
                  {isJoined && (
                    <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> JOINED
                    </div>
                  )}

                  {/* Glow Effect Gold */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#ffbe00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`capitalize ${event.skillLevel === 'beginner' ? 'text-green-400 border-green-400/20' :
                        event.skillLevel === 'intermediate' ? 'text-yellow-400 border-yellow-400/20' :
                          'text-red-400 border-red-400/20'} bg-white/5`}
                      >
                        {event.skillLevel || 'General'}
                      </Badge>
                      <span className="text-[#ffbe00] font-mono text-xs font-bold">
                        Rp {event.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#ffbe00] transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                        <User className="w-3 h-3" /> Coach {event.coachNickname || event.coachName || 'TBA'}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/5">
                      {/* Avatar Stack */}
                      {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden">
                            {event.participants.slice(0, 4).map((p: any, i: number) => (
                              <Avatar key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-[#151515]">
                                <AvatarImage src={p.image} />
                                <AvatarFallback className="text-[8px] bg-gray-800 text-gray-400">{p.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">
                            +{event.bookedSlot > 4 ? event.bookedSlot - 4 : 0} Joined
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-[#ca1f3d]" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 text-[#ca1f3d]" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Sisa {event.quota - (event.bookedSlot || 0)} Slot</span>

                    {isJoined ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={cancelLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeave(event.id);
                        }}
                        className="h-8 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
                      >
                        {cancelLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><LogOut className="w-3 h-3 mr-1" /> LEAVE CLASS</>}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleSelectEvent(event.id)} className="bg-white/5 text-white hover:bg-[#ffbe00] hover:text-black rounded-lg h-8 text-xs font-bold">
                        JOIN CLASS <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </motion.div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <Dumbbell className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg">Belum ada kelas tersedia.</h3>
            <p className="text-gray-500 text-sm">Coba ubah filter atau cek lagi nanti.</p>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW: DETAIL (BOOKING FORM) ---
  const isFull = selectedEvent.bookedSlot >= selectedEvent.quota;
  const isJoinedDetail = !!joinedEvents[selectedEvent.id];

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-8 px-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackToList}
        className="text-gray-400 hover:text-white pl-0 hover:bg-transparent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: DETAILS (2 Col Span) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
            {/* GOLD/RED HEADER ACCENT */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffbe00] via-[#ca1f3d] to-[#ffbe00]"></div>

            <div className="space-y-6">
              <div className="space-y-4">
                {isJoinedDetail && (
                  <Badge className="bg-green-500 text-black font-bold">ANDA SUDAH TERDAFTAR</Badge>
                )}
                <div>
                  <Badge variant="outline" className="text-[#ffbe00] border-[#ffbe00] bg-[#ffbe00]/10 px-3 py-1 mb-2">
                    {selectedEvent.skillLevel?.toUpperCase() || 'GENERAL'} CLASS
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                    {selectedEvent.title}
                  </h1>
                </div>
              </div>

              {/* Coach Info */}
              {(selectedEvent.coachName || selectedEvent.coachNickname) && (
                <div className="flex items-center gap-4 bg-[#ffbe00]/5 p-4 rounded-2xl border border-[#ffbe00]/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-[#ffbe00] flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,190,0,0.5)]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#ffbe00] font-bold uppercase tracking-widest">Coach / Pelatih</p>
                    <p className="font-black text-white text-lg">{selectedEvent.coachNickname || selectedEvent.coachName}</p>
                  </div>
                </div>
              )}

              {/* Description / Curriculum */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#ffbe00]" /> Kurikulum & Materi
                </h3>
                <div className="text-gray-300 leading-relaxed text-sm space-y-2">
                  {selectedEvent.curriculum ? (
                    <p>{selectedEvent.curriculum}</p>
                  ) : (
                    <p className="italic text-gray-500">Tidak ada deskripsi detail untuk sesi ini.</p>
                  )}
                </div>
              </div>

              {/* PARTICIPANT LIST */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ffbe00]" /> Peserta Terdaftar ({selectedEvent.bookedSlot})
                </h3>
                {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedEvent.participants.map((p: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                        <Avatar className="h-8 w-8 rounded-full ring-1 ring-white/10">
                          <AvatarImage src={p.image} />
                          <AvatarFallback className="text-[10px] bg-gray-800 text-gray-400">{p.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-gray-300 truncate">{p.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">Belum ada peserta yang bergabung.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: BOOKING ACTION (1 Col Span) - Sticky on Desktop */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          <Card className="bg-[#1A1A1A] border-white/5 p-6 rounded-[2rem] space-y-6 shadow-xl">
            <div className="text-center pb-6 border-b border-white/5">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Biaya</p>
              <p className="text-4xl font-black text-[#ffbe00] tracking-tight">
                Rp {selectedEvent.price.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500 mt-2">Per Orang / Sesi</p>
            </div>

            <div className="space-y-4">
              <InfoRow icon={Calendar} label="Tanggal" value={new Date(selectedEvent.date).toLocaleDateString()} />
              <InfoRow icon={Clock} label="Waktu" value={selectedEvent.time} />
              <InfoRow icon={MapPin} label="Lokasi" value={selectedEvent.location} />
              <InfoRow icon={User} label="Kuota" value={`${selectedEvent.quota - (selectedEvent.bookedSlot || 0)} Slot Tersedia`} highlighted />
            </div>

            {/* GUEST FORM */}
            {!session && (
              <div className="bg-black/40 p-4 rounded-xl border border-[#ffbe00]/20 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#ffbe00] animate-pulse"></span>
                  <p className="text-[10px] font-bold text-[#ffbe00] uppercase tracking-widest">Guest Checkout</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-400">Nama</Label>
                    <Input
                      value={guestForm.name}
                      onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                      className="bg-black/50 h-9 text-sm"
                      placeholder="Nama lengkap..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-400">WhatsApp</Label>
                    <Input
                      type="tel"
                      value={guestForm.phone}
                      onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                      className="bg-black/50 h-9 text-sm"
                      placeholder="08..."
                    />
                  </div>
                </div>
              </div>
            )}

            {isJoinedDetail ? (
              <Button
                onClick={() => handleLeave(selectedEvent.id)}
                disabled={cancelLoading}
                className="w-full h-14 rounded-xl font-bold text-base bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                {cancelLoading ? <Loader2 className="animate-spin" /> : "BATALKAN SESI"}
              </Button>
            ) : (
              <Button
                onClick={handleBooking}
                disabled={bookingLoading || isFull}
                className={`w-full h-14 rounded-xl font-black text-lg tracking-wide shadow-lg transition-all ${isFull
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-[#ffbe00] text-black hover:bg-yellow-400 hover:scale-[1.02]'
                  }`}
              >
                {bookingLoading ? <Loader2 className="animate-spin" /> : (
                  isFull ? "FULL BOOKED" : (!session ? "BOOKING" : "JOIN SESI")
                )}
              </Button>
            )}
          </Card>
        </div>
      </div >
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        description={statusModal.description}
      />
    </div >
  );
}

// Helper Component
function InfoRow({ icon: Icon, label, value, highlighted = false }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${highlighted ? 'bg-[#ffbe00]/20' : 'bg-white/5'}`}>
        <Icon className={`w-4 h-4 ${highlighted ? 'text-[#ffbe00]' : 'text-gray-400'}`} />
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</p>
        <p className={`text-sm font-bold ${highlighted ? 'text-white' : 'text-gray-300'}`}>{value}</p>
      </div>
    </div>
  )
}

export default function DrillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <DrillingEventContent />
    </Suspense>
  );
}
