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

export default function AdminEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');

  // Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);

  const loadData = async () => {
    // Handle async params in Next.js 15
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) return;

    try {
      // 1. Fetch Event Details
      const eventRes = await fetch(`/api/events/${id}`);
      const eventData = await eventRes.json();

      if (eventData.success) {
        setEvent(eventData.data);
      }

      // 2. Fetch Participants
      const partRes = await fetch(`/api/events/${id}/participants`);
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

  const handleUpdateStatus = async (bookingId: string, newStatus: 'paid' | 'pending') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast({ title: "Sukses", description: `Status berhasil diubah menjadi ${newStatus.toUpperCase()}` });
        loadData(); // Refresh data
      } else {
        throw new Error("Gagal update status");
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal mengupdate status pembayaran", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ca1f3d]"></div>
    </div>
  );

  if (!event) return <div className="text-white">Event not found</div>;

  // Gunakan jumlah participants aktual dari list, bukan dari event.bookedSlot yang mungkin tidak sync
  const bookedCount = participants.length > 0 ? participants.length : (event.bookedSlot || 0);
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
                                border-0 font-bold uppercase tracking-wider px-3 py-1
                                ${event.type === 'drilling' ? 'bg-[#00f2ea]/20 text-[#00f2ea]' :
                  event.type === 'tournament' ? 'bg-purple-500/20 text-purple-500' : 'bg-[#ffbe00]/20 text-[#ffbe00]'}
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

        <div className="flex gap-3">
          <Link href={`/host/events/${event.id}/edit`}>
            <Button variant="outline" className="border-white/10 text-white bg-[#1A1A1A] hover:bg-white/10 gap-2 h-12 px-6 rounded-xl">
              <Pencil className="w-4 h-4" /> Edit Event
            </Button>
          </Link>
          {/* Admin Action Example */}
          <Button variant="destructive" className="bg-red-900/50 text-red-200 hover:bg-red-900 border border-red-900 rounded-xl h-12 px-6" onClick={() => setShowCancelModal(true)}>
            Cancel Event
          </Button>
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
                <DollarSign className="w-16 h-16 text-[#00f2ea]" />
              </div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Est. Revenue</p>
              <h3 className="text-2xl font-black text-[#00f2ea]">
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
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Price per Slot</p>
                  <p className="text-white font-medium">Rp {Number(event.price).toLocaleString('id-ID')}</p>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Host / Coach</p>
                  <p className="text-white font-medium">{event.coachName || 'Admin'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PARTICIPANTS (8 Cols) */}
        <div className="xl:col-span-8">
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
              {participants.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {participants.map((p, i) => (
                    <div key={p.id || i} className="p-4 px-6 flex items-center gap-4 hover:bg-white/5 transition-colors group">

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
                              if (r.includes('admin')) return <Badge className="bg-red-500/10 text-red-500 border-0 h-5 text-[10px] font-bold">ADMIN</Badge>;
                              if (r.includes('coach')) return <Badge className="bg-[#00f2ea]/10 text-[#00f2ea] border-0 h-5 text-[10px] font-bold">COACH</Badge>;
                              if (r === 'member') return <Badge className="bg-blue-500/10 text-blue-400 border-0 h-5 text-[10px]">MEMBER</Badge>;
                              return <Badge className="bg-gray-700/30 text-gray-400 border-0 h-5 text-[10px]">GUEST</Badge>;
                            })()}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                            {p.bookingCode && <span className="font-mono text-xs bg-white/5 px-1 rounded">{p.bookingCode}</span>}
                            {p.phone || '-'}
                          </p>
                        </div>

                        <div className="flex items-center md:justify-end gap-6 text-sm text-gray-500">
                          <span className="hidden md:inline-block">
                            {p.joinedAt ? new Date(p.joinedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                          </span>
                          {p.status === 'paid' || p.status === 'CONFIRMED' ? (
                            <Badge className="bg-green-900/30 text-green-400 border-green-900/50 px-3 py-1 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3" /> PAID
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
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/10 text-white">
                          <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5" onClick={() => navigator.clipboard.writeText(p.phone)}>
                            Copy WhatsApp
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
                          <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer hover:bg-red-900/20 focus:bg-red-900/20" onClick={() => alert('Fitur Hapus Peserta (Coming Soon)')}>
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
              Showing {participants.length} of {bookedCount} registered users.
            </div>
          </Card>
        </div>

      </div>
      <FeedbackModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        type="warning"
        title="Batalkan Event?"
        description={
          <span>
            Tindakan ini tidak dapat dibatalkan. Event <strong>{event.title}</strong> akan dihapus dan semua booking akan dibatalkan.
          </span>
        }
        primaryAction={{
          label: "YA, BATALKAN",
          onClick: () => {
            alert('Fitur Cancel Event (Action)'); // Placeholder for actual action
            setShowCancelModal(false);
          }
        }}
        secondaryAction={{
          label: "Kembali",
          onClick: () => setShowCancelModal(false)
        }}
      />
    </div>
  );
}
