'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft,
  MoreHorizontal, Pencil, QrCode, Ticket, CheckCircle2,
  DollarSign, User, AlertCircle, TrendingUp, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');

  // Modal State

  const [editParticipant, setEditParticipant] = useState<any>(null);
  const [editForm, setEditForm] = useState({ partnerName: '', isSponsored: false });

  // Delete Participant State
  // UNIFIED FEEDBACK STATE
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    description: React.ReactNode;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'warning',
    title: '',
    description: '',
    onConfirm: undefined
  });

  const closeFeedback = () => setFeedback(prev => ({ ...prev, isOpen: false }));

  // Helper to Show Feedback
  const showFeedback = (type: 'success' | 'error' | 'warning', title: string, desc: React.ReactNode, onConfirm?: () => void) => {
    setFeedback({
      isOpen: true,
      type,
      title,
      description: desc,
      onConfirm
    });
  };

  const loadData = async () => {
    // Handle async params in Next.js 15
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) return;

    try {
      // 1. Fetch Event Details
      const eventRes = await fetch(`/api/events/${id}`);
      if (!eventRes.ok) {
        const text = await eventRes.text();
        console.error("Fetch Event Error:", text);
        throw new Error(`Event API Error: ${eventRes.status} ${eventRes.statusText}`);
      }
      const eventData = await eventRes.json();

      if (eventData.success) {
        setEvent(eventData.data);
      }

      // 2. Fetch Participants
      const partRes = await fetch(`/api/events/${id}/participants`);
      if (!partRes.ok) {
        const text = await partRes.text();
        console.error("Fetch Participants Error:", text);
        throw new Error(`Participants API Error: ${partRes.status}`);
      }
      const partData = await partRes.json();

      if (partData.success) {
        setParticipants(partData.data);
      }
    } catch (error) {
      console.error("Error loading data", error);
      toast({ title: "Error", description: "Gagal memuat data event", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [params, toast]);

  const handleUpdateStatus = async (bookingId: string, newStatus: 'paid' | 'pending' | 'approved' | 'rejected' | 'confirmed') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        let title = "STATUS UPDATED!";
        let description = `Status berhasil diubah menjadi ${newStatus.toUpperCase()}`;

        if (newStatus === 'paid') {
          title = "TICKET SECURED!";
          description = "Pembayaran lunas. Slot aman terkendali. Siap tanding!";
        } else if (newStatus === 'confirmed') {
          title = "GAME ON!";
          description = "Peserta dikonfirmasi hadir. Raket siap?";
        } else if (newStatus === 'rejected') {
          title = "SERVICE FAULT!";
          description = "Pendaftaran ditolak/dibatalkan.";
        }

        showFeedback('success', title, description);
        loadData(); // Refresh data
      } else {
        throw new Error("Gagal update status");
      }
    } catch (error) {
      showFeedback('error', 'GAGAL UPDATE!', 'Terjadi kesalahan saat mengupdate status peserta.');
    }
  };

  const openEdit = (p: any) => {
    setEditParticipant(p);
    setEditForm({
      partnerName: p.partnerName || '',
      isSponsored: !!p.isSponsored
    });
  };

  const handleSaveEdit = async () => {
    if (!editParticipant) return;
    try {
      const res = await fetch(`/api/bookings/${editParticipant.bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: editForm.partnerName,
          isSponsored: editForm.isSponsored,
          price: editForm.isSponsored ? 0 : undefined, // Auto-free if sponsored
          status: editForm.isSponsored ? 'paid' : undefined // Optional: Auto-pay if sponsored?
        })
      });

      if (res.ok) {
        toast({ title: "Sukses", description: "Data peserta diperbarui" });
        setEditParticipant(null);
        loadData();
      } else {
        throw new Error("Gagal update");
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal menyimpan perubahan", variant: "destructive" });
    }
  };

  // HANDLERS
  const handleExtend = async () => {
    showFeedback('warning', 'RUBBER GAME?', 'Tambah durasi 1 Jam lagi? Pastikan fisik masih kuat!', async () => {
      closeFeedback(); // Close confirm modal
      try {
        const res = await fetch(`/api/events/${event.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'extend_time', additionalMinutes: 60 })
        });
        if (res.ok) {
          showFeedback('success', 'MATCH EXTENDED!', 'Waktu berhasil ditambah. Gas terus!');
          loadData();
        } else throw new Error();
      } catch (e) {
        showFeedback('error', 'UNFORCED ERROR!', 'Gagal menambah waktu. Coba lagi.');
      }
    });
  };


  const handleAddCourt = async () => {
    showFeedback('warning', 'EXPAND ARENA?', <span>Buka <strong>1 Lapangan (+12 Slot)</strong>?<br />Waiting list akan otomatis masuk ke Main Draw.</span>, async () => {
      closeFeedback();
      try {
        const res = await fetch(`/api/events/${event.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add_court', additionalQuota: 12 })
        });
        if (res.ok) {
          showFeedback('success', 'COURT READY!', 'Lapangan baru dibuka. Lebih banyak aksi!');
          loadData();
        } else throw new Error();
      } catch (e) {
        showFeedback('error', 'NETTING!', 'Gagal menambah lapangan.');
      }
    });
  };

  const handleDeleteClick = (participant: any) => {
    showFeedback('warning', 'WALKOVER (WO)?',
      <span>Kick <strong>{participant.name}</strong> dari event?<br />Slot akan menjadi kosong (Open).</span>,
      async () => {
        closeFeedback();
        try {
          const res = await fetch(`/api/bookings/${participant.bookingId}`, { method: 'DELETE' });
          if (res.ok) {
            showFeedback('success', 'PLAYER RETIRED', `Peserta ${participant.name} berhasil dikeluarkan.`);
            loadData();
          } else throw new Error();
        } catch (error) {
          showFeedback('error', 'FAULT!', 'Gagal menghapus peserta.');
        }
      });
  };


  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ca1f3d]"></div>
    </div>
  );

  if (!event) return <div className="text-white">Event not found</div>;

  // FILTER: Pisahkan Staff (Host/Coach/Admin) dari Peserta Biasa
  // Staff tidak dihitung dalam kuota event.
  // UPDATE: Hanya yang explicitly ASSIGNED sebagai Host, Coach, atau Asisten Coach.
  const isAssignedStaff = (p: any) => {
    // Check ID (Use p.userId if available from booking, fallback to p.id)
    const uid = p.userId || p.id;

    // 1. Check Host
    if (event.hostId && uid === event.hostId) return true;
    if (event.organizer && uid === event.organizer) return true; // Fallback for legacy

    // 2. Check Assistant Coach (Array of IDs)
    if (event.assistantCoachIds && Array.isArray(event.assistantCoachIds) && event.assistantCoachIds.includes(uid)) return true;

    // 3. Check Main Coach (Best effort by Name match since coachId might not be strictly linked)
    // If exact name match AND user has coach role, assume they are the assigned coach.
    if (event.coachName && p.name && p.name.toLowerCase() === event.coachName.toLowerCase()) return true;

    return false;
  };

  const staff = participants.filter(p => isAssignedStaff(p));
  const realParticipants = participants.filter(p => !isAssignedStaff(p));

  // Gunakan realParticipants untuk perhitungan kuota
  const bookedCount = realParticipants.length;
  // Fallback ke event.bookedSlot jika data participant kosong (optional, tapi lebih aman pakai real count)

  const progress = Math.min(100, (bookedCount / event.quota) * 100);
  const totalRevenue = bookedCount * event.price;

  return (
    <div className="space-y-8 pb-20 w-full animate-in fade-in duration-500">
      {/* Header with Breadcrumb-style Back */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="rounded-full w-12 h-12 p-0 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{event.title}</h1>
              <Badge variant="outline" className={`
                                border-0 font-bold uppercase tracking-wider px-3 py-1 color-white
                                ${event.type === 'drilling' ? 'bg-[#ffbe00]/20 text-[#ffbe00]' :
                  event.type === 'tournament' ? 'bg-[#ca1f3d]/20 text-[#ca1f3d]' : 'bg-[#ffbe00]/20 text-[#ffbe00]'}
                            `}>
                {event.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="text-white font-medium">ID: {event.id}</span>
            </div>
          </div>
        </div>

        {/* NEW MODERN ACTION BAR (Moved & Redesigned) */}
        <div className="flex items-center gap-3 bg-[#0a0a0a]/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-2xl">
          {/* Quick Actions (Mabar Only) */}
          {event.type === 'mabar' && (
            <div className="flex items-center gap-1 pr-3 border-r border-white/10 mr-1">
              <Button
                variant="ghost"
                onClick={handleExtend}
                className="h-10 rounded-full px-4 text-xs font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                <Clock className="w-4 h-4 mr-2" /> +1 Jam
              </Button>
              <Button
                variant="ghost"
                onClick={handleAddCourt}
                className="h-10 rounded-full px-4 text-xs font-black uppercase tracking-wider bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <Users className="w-4 h-4 mr-2" /> +1 Court
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link href={`/admin/events/${event.id}/edit`}>
              <Button variant="ghost" className="h-10 rounded-full px-5 text-xs font-black uppercase tracking-wider text-white hover:bg-white/10 border border-white/5 transition-all">
                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="h-10 rounded-full px-5 text-xs font-black uppercase tracking-wider bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 transition-all duration-300 group"
              onClick={() => {
                showFeedback('warning', 'GAME OVER?',
                  <span>Event <strong>{event.title}</strong> akan dihapus permanen.<br />Tidak ada <i>rematch</i> setelah ini.</span>,
                  () => {
                    alert("Logic Cancel Executed"); // Placeholder
                    closeFeedback();
                  }
                );
              }}>
              <span className="group-hover:hidden">Cancel</span>
              <span className="hidden group-hover:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* LEFT COLUMN: STATS & DETAILS (4 Cols) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#151515] border-white/5 p-5 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-16 h-16 text-white" />
              </div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Booked Slots</p>
              <h3 className="text-3xl font-black text-white">{bookedCount}<span className="text-lg text-gray-600 font-medium">/{event.quota}</span></h3>
              <div className="w-full h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#ffbe00]" style={{ width: `${progress}%` }}></div>
              </div>
            </Card>

            <Card className="bg-[#151515] border-white/5 p-5 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-16 h-16 text-[#ffbe00]" />
              </div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Est. Revenue</p>
              <h3 className="text-2xl font-black text-[#ffbe00]">
                {totalRevenue > 1000000 ? `${(totalRevenue / 1000000).toFixed(1)}M` : `${(totalRevenue / 1000).toFixed(0)}K`}
              </h3>
              <p className="text-[10px] text-gray-500 mt-1">IDR {totalRevenue.toLocaleString('id-ID')}</p>
            </Card>
          </div>

          {/* Detail Card */}
          <Card className="bg-[#151515] border-white/5 p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#ca1f3d]" /> Event Information
            </h3>

            <div className="space-y-4">
              {/* GLOBAL INFO */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                  <p className="text-white font-medium leading-tight">{event.location}</p>
                  <p className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline">Open in Maps</p>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Schedule</p>
                  <p className="text-white font-medium">{event.time}</p>
                  <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* TYPE SPECIFIC INFO */}
              {event.type === 'drilling' && (
                <div className="bg-[#ffbe00]/5 border border-[#ffbe00]/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#ffbe00]/10 text-[#ffbe00] border-0">DRILLING DETAILS</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Coach</p>
                    <p className="text-white font-bold">{event.coachName} <span className="text-gray-500 font-normal">({event.coachNickname})</span></p>
                  </div>
                  {event.assistantCoachNames && event.assistantCoachNames.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Assistant Coaches</p>
                      <p className="text-white font-medium text-sm">{event.assistantCoachNames.join(', ')}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Curriculum</p>
                    <p className="text-sm text-gray-300 italic">"{event.curriculum || '-'}"</p>
                  </div>
                  <Separator className="bg-[#ffbe00]/10" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Court Cost</p>
                      <p className="text-white">Rp {Number(event.financials?.courtCost ?? event.cost_court ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Coach Fee</p>
                      <p className="text-white">Rp {Number(event.financials?.coachFee ?? event.cost_coach ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {event.type === 'sparring' && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-500/10 text-red-500 border-0">SPARRING INFO</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Opponent (Lawan)</p>
                    <p className="text-xl font-black text-white uppercase italic">{event.sparringOpponent || 'OPEN SPARRING'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Looking For Level</p>
                    <Badge variant="outline" className="border-white/20 text-white mt-1">{event.skillLevel?.toUpperCase()}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Format</p>
                    <p className="text-sm text-gray-300">{event.matchFormat || '-'}</p>
                  </div>
                </div>
              )}

              {event.type === 'tournament' && (
                <div className="bg-[#ca1f3d]/5 border border-[#ca1f3d]/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#ca1f3d]/10 text-[#ca1f3d] border-0">TOURNAMENT INFO</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Prizes</p>
                    <p className="text-sm text-yellow-400 font-bold">{event.prizes || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Criteria</p>
                    <p className="text-sm text-gray-300">{event.playerCriteria || '-'}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 pt-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Tiket per Slot</p>
                  <p className="text-white font-medium">Rp {Number(event.price).toLocaleString('id-ID')}</p>
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PARTICIPANTS (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">

          {/* 1. SEPARATE STAFF / OFFICIALS CARD */}
          {staff.length > 0 && (
            <Card className="bg-[#1A1A1A] border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Event Staff & Officials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Avatar className="w-10 h-10 border border-white/10">
                      <AvatarImage src={s.avatar} className="object-cover" />
                      <AvatarFallback className="bg-[#1A1A1A] text-xs font-bold">{s.name ? s.name.charAt(0) : 'S'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-bold text-sm">{s.name}</p>
                      <Badge className="bg-[#ffbe00]/20 text-[#ffbe00] border-0 text-[10px] mt-0.5">{s.role?.toUpperCase() || 'STAFF'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 2. REAL PARTICIPANTS CARD */}
          <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="text-xl font-bold text-white">Participants</h3>
                <p className="text-sm text-gray-500">Manage who is attending.</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10 text-gray-400 hover:text-white bg-transparent h-9 rounded-lg">
                  Export CSV
                </Button>
                <Button size="sm" className="bg-[#ffbe00] text-black hover:bg-[#ffbe00]/90 h-9 rounded-lg font-bold">
                  <Ticket className="w-4 h-4 mr-2" /> Check-in
                </Button>
              </div>
            </div>

            <div className="p-0 flex-1">
              {realParticipants.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {realParticipants.map((p, i) => (
                    <div key={p.id || i} className="p-4 px-6 flex items-center gap-4 hover:bg-white/5 transition-colors group relative">
                      {/* LINK TO REPORT (IF DRILLING) */}
                      {event.type === 'drilling' && (
                        <Link href={`/admin/reports/${p.bookingId}`} className="absolute inset-0 z-0" />
                      )}

                      {/* Index / Avatar */}
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={p.avatar} className="object-cover" />
                        <AvatarFallback className="bg-[#1A1A1A] text-gray-500 font-bold text-xs">
                          {p.name ? p.name.charAt(0).toUpperCase() : (i + 1)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{p.name || "Guest"}</p>
                            {(() => {
                              const r = (p.role || '').toLowerCase();
                              if (r === 'member') return <Badge className="bg-blue-500/10 text-blue-400 border-0 h-5 text-[10px]">MEMBER</Badge>;
                              return <Badge className="bg-gray-700/30 text-gray-400 border-0 h-5 text-[10px]">GUEST</Badge>;
                            })()}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                            {p.bookingCode && <span className="font-mono text-xs bg-white/5 px-1 rounded">{p.bookingCode}</span>}
                            {p.phone || '-'}
                          </p>
                          {p.isSponsored && (
                            <Badge className="bg-[#ffbe00] text-black border-0 h-5 text-[10px] font-bold mt-1 w-fit">SPONSORED BY BADMINTOUR</Badge>
                          )}
                          {p.partnerName && (
                            <p className="text-xs text-[#ffbe00] mt-1 flex items-center gap-1 font-medium">
                              <Users className="w-3 h-3" /> Partner: {p.partnerName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center md:justify-end gap-6 text-sm text-gray-500">
                          <span className="hidden md:inline-block">
                            {p.joinedAt ? new Date(p.joinedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                          </span>
                          {p.status === 'paid' || p.status === 'CONFIRMED' || p.status === 'approved' ? (
                            <Badge className="bg-green-900/30 text-green-400 border-green-900/50 px-3 py-1 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3" /> {p.status === 'approved' ? 'APPROVED' : 'PAID'}
                            </Badge>
                          ) : p.status === 'pending_approval' ? (
                            <Badge className="bg-purple-900/30 text-purple-400 border-purple-900/50 px-3 py-1 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" /> NEED APPROVAL
                            </Badge>
                          ) : p.status === 'rejected' ? (
                            <Badge className="bg-red-900/30 text-red-400 border-red-900/50 px-3 py-1 flex items-center gap-1.5">
                              <AlertCircle className="w-3 h-3" /> REJECTED
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-900/50 px-3 py-1 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" /> PENDING
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/10 text-white">
                          <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />

                          {/* Approval Actions (Sparring Only for Partner/Sponsor) */}
                          {event?.type === 'sparring' && (
                            <>
                              <DropdownMenuItem className="cursor-pointer font-bold" onClick={() => openEdit(p)}>
                                <Users className="w-4 h-4 mr-2" /> Atur Pasangan & Sponsor
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                            </>
                          )}

                          {(event?.type === 'tournament' && p.status === 'pending_approval') && (
                            <>
                              <DropdownMenuItem
                                className="cursor-pointer text-green-500 hover:bg-green-500/10 focus:bg-green-500/10 font-bold"
                                onClick={() => handleUpdateStatus(p.bookingId, 'approved')}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10"
                                onClick={() => handleUpdateStatus(p.bookingId, 'rejected')}
                              >
                                <AlertCircle className="w-4 h-4 mr-2" /> Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                            </>
                          )}

                          <DropdownMenuItem
                            className="cursor-pointer text-blue-400 hover:bg-blue-500/10 focus:bg-blue-500/10 font-bold"
                            onClick={() => handleUpdateStatus(p.bookingId, 'confirmed')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Confirmed
                          </DropdownMenuItem>
                          {p.role === 'member' && (
                            <Link href={`/admin/members/${p.id}`}>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                                Lihat Profil
                              </DropdownMenuItem>
                            </Link>
                          )}
                          <DropdownMenuSeparator className="bg-white/10" />

                          {(p.status === 'paid' || p.status === 'CONFIRMED') ? (
                            <DropdownMenuItem
                              className="cursor-pointer text-yellow-500 focus:text-yellow-500 hover:bg-yellow-900/20 focus:bg-yellow-900/20"
                              onClick={() => handleUpdateStatus(p.bookingId, 'pending')}
                            >
                              Mark as Pending
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="cursor-pointer text-green-500 focus:text-green-500 hover:bg-green-900/20 focus:bg-green-900/20"
                              onClick={() => handleUpdateStatus(p.bookingId, 'paid')}
                            >
                              Mark as Paid
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500 cursor-pointer hover:bg-red-900/20 focus:bg-red-900/20 font-bold"
                            onClick={() => handleDeleteClick(p)}
                          >
                            Hapus Peserta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-10 space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 opacity-30" />
                  </div>
                  <p>Belum ada peserta yang mendaftar.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.02] text-center text-xs text-gray-600">
              Showing {realParticipants.length} of {bookedCount} registered users.
            </div>
          </Card>
        </div>

      </div>
      {/* UNIFIED FEEDBACK MODAL */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={closeFeedback}
        type={feedback.type}
        title={feedback.title}
        description={feedback.description}
        primaryAction={{
          label: feedback.onConfirm ? "YA, LANJUTKAN" : "MENGERTI",
          onClick: feedback.onConfirm || closeFeedback
        }}
        secondaryAction={feedback.onConfirm ? {
          label: "Batalkan",
          onClick: closeFeedback
        } : undefined}
      />

      {/* EDIT PARTICIPANT MODAL */}
      <Dialog open={!!editParticipant} onOpenChange={(o) => !o && setEditParticipant(null)}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Peserta Tournament</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Pasangan (Partner)</Label>
              <Input
                value={editForm.partnerName}
                onChange={(e) => setEditForm({ ...editForm, partnerName: e.target.value })}
                placeholder="Masukkan nama partner..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="sponsor"
                checked={editForm.isSponsored}
                onCheckedChange={(checked) => setEditForm({ ...editForm, isSponsored: checked as boolean })}
                className="border-white/20 data-[state=checked]:bg-[#ffbe00] data-[state=checked]:text-black"
              />
              <label
                htmlFor="sponsor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Dibayarkan oleh Badmintour (Sponsorship)
              </label>
            </div>
            {editForm.isSponsored && (
              <div className="text-xs text-[#ffbe00] bg-[#ffbe00]/10 p-2 rounded border border-[#ffbe00]/20">
                ⚠ Status akan otomatis menjadi <b>PAID</b> dan Harga <b>Rp 0</b>.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditParticipant(null)} className="text-gray-400">Batal</Button>
            <Button onClick={handleSaveEdit} className="bg-[#ffbe00] text-black hover:bg-[#ffbe00]/90 font-bold">Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
