'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft,
  MoreHorizontal, Pencil, QrCode, Ticket, CheckCircle2,
  DollarSign, User, AlertCircle, TrendingUp, CreditCard, Ban, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');

  // Cancellation State
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Handle async params in Next.js 15
      const resolvedParams = await params;
      const id = resolvedParams?.id;

      if (!id) return;

      try {
        // 1. Fetch Event Details
        const eventRes = await fetch(`/api/events/${id}?t=${Date.now()}`);
        const eventData = await eventRes.json();

        if (eventData.success) {
          setEvent(eventData.data);
        }

        // 2. Fetch Participants
        const partRes = await fetch(`/api/events/${id}/participants?t=${Date.now()}`);
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
    loadData();
  }, [params, toast]);

  const handleCancelParticipant = async () => {
    if (!cancelId) return;
    if (!cancelReason.trim()) {
      toast({ title: "Reason Required", description: "Mohon isi alasan pembatalan.", variant: "destructive" });
      return;
    }

    setIsCancelling(true);

    try {
      const res = await fetch(`/api/bookings/${cancelId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled',
          cancelReason: cancelReason
        })
      });

      if (res.ok) {
        toast({ title: "Berhasil", description: "Peserta berhasil dibatalkan. Slot bertambah." });

        // Re-fetch to get fresh data or Optimistic Update
        // We'll update the local state to reflect cancellation immediately
        setParticipants(prev => prev.map(p =>
          p.bookingId === cancelId
            ? { ...p, status: 'cancelled', cancelReason: cancelReason, cancelledAt: new Date().toISOString() }
            : p
        ));

        setEvent((prev: any) => ({
          ...prev,
          bookedSlot: Math.max(0, (prev.bookedSlot || 0) - 1)
        }));

      } else {
        const data = await res.json();
        toast({ title: "Gagal", description: data.error || "Gagal membatalkan peserta", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Terjadi kesalahan sistem", variant: "destructive" });
    } finally {
      setIsCancelling(false);
      setCancelId(null);
      setCancelReason('');
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: 'paid' | 'pending' | 'approved' | 'rejected' | 'confirmed') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast({
          title: "Status Diperbarui",
          description: `Status berhasil diubah menjadi ${newStatus.toUpperCase()}`
        });

        // Optimistic Update
        setParticipants(prev => prev.map(p =>
          p.bookingId === bookingId
            ? { ...p, status: newStatus }
            : p
        ));
      } else {
        toast({ title: "Gagal", description: "Gagal mengubah status peserta", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Terjadi kesalahan sistem", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ca1f3d]"></div>
    </div>
  );
  if (!event) return <div className="text-white">Event not found</div>;

  // --- DERIVED DATA ---
  // Helper: Check if participant is Host/Admin/Organizer
  const isHost = (p: any) => {
    const uid = p.id || p.userId; // API returns id as userId, but check both
    return (event.hostId && uid === event.hostId) || (event.organizer && uid === event.organizer);
  };

  // Filter active vs cancelled participants (Exclude Host)
  const activeParticipants = participants.filter(p => !isHost(p) && p.status !== 'cancelled' && p.status !== 'rejected');

  // Deduplicate Cancelled by Phone (Latest Only) - Also exclude Host
  const rawCancelled = participants.filter(p => !isHost(p) && (p.status === 'cancelled' || p.status === 'rejected'));
  const cancelledParticipants = Object.values(rawCancelled.reduce((acc: any, p) => {
    // Use phone as key if valid, otherwise fallback to bookingId to avoid grouping unknowns together
    const key = (p.phone && p.phone !== '-' && p.phone.length > 5) ? p.phone : p.bookingId;

    // If new entry is later than existing, replace it
    const existing = acc[key];
    const newTime = p.cancelledAt ? new Date(p.cancelledAt).getTime() : 0;
    const existingTime = existing?.cancelledAt ? new Date(existing.cancelledAt).getTime() : 0;

    if (!existing || newTime > existingTime) {
      acc[key] = p;
    }
    return acc;
  }, {}));

  const bookedCount = activeParticipants.length;
  const progress = Math.min(100, (bookedCount / event.quota) * 100);
  const totalRevenue = activeParticipants.reduce((sum, p) => sum + (p.price || event.price || 0), 0); // Need to check if individual price exists, else fallback

  return (
    <div className="space-y-8 pb-20 w-full animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="rounded-full w-12 h-12 p-0 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => router.back()}>
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
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/host/events/${event.id}/edit`}>
            <Button variant="outline" className="border-white/10 text-white bg-transparent hover:bg-white/10 gap-2 h-10 rounded-full">
              <Pencil className="w-4 h-4" /> Edit Event
            </Button>
          </Link>
          <Button className="bg-[#ca1f3d] hover:bg-[#a01830] text-white gap-2 h-10 rounded-full">
            <QrCode className="w-4 h-4" /> Scan Presence
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* LEFT: Stats (4 Cols) */}
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
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                  <p className="text-white font-medium leading-tight">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Price per Slot</p>
                  <p className="text-white font-medium">Rp {Number(event.price).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CANCELLATION STATS */}
          {cancelledParticipants.length > 0 && (
            <Card className="bg-red-900/10 border-red-500/20 p-5 rounded-3xl">
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Ban className="w-4 h-4" /> Cancellation Stats
              </h3>
              <p className="text-2xl font-black text-white">{cancelledParticipants.length} <span className="text-sm font-normal text-gray-400">Users Cancelled</span></p>
              <p className="text-xs text-gray-500 mt-1">Slot dikembalikan ke inventory.</p>
            </Card>
          )}
        </div>

        {/* RIGHT: Participants List (8 Cols) */}
        <div className="xl:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-[#151515] p-1 rounded-xl">
                <TabsTrigger value="participants" className="data-[state=active]:bg-[#ca1f3d] data-[state=active]:text-white rounded-lg px-6 gap-2">
                  <Users className="w-4 h-4" /> Active ({activeParticipants.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-red-200 rounded-lg px-6 gap-2">
                  <Ban className="w-4 h-4" /> Cancelled ({cancelledParticipants.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="participants">
              <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden min-h-[500px]">
                {activeParticipants.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {activeParticipants.map((p, i) => (
                      <div key={p.bookingId || i} className="p-5 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white border border-white/10 shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-white text-lg truncate">{p.name || "Guest"}</p>
                            {p.id ? <Badge className="h-5 bg-blue-500/10 text-blue-400 text-[10px]">MEMBER</Badge> : <Badge className="h-5 bg-white/10 text-gray-400 text-[10px]">GUEST</Badge>}
                          </div>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><History className="w-3 h-3" /> Joined: {new Date(p.joinedAt).toLocaleDateString()}</span>
                            <span className="font-mono bg-white/5 px-1 rounded">#{p.bookingCode}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge className={
                            p.status === 'paid' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                              p.status === 'confirmed' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                "bg-gray-500/10 text-gray-500 border-gray-500/20"
                          }>
                            {p.status?.toUpperCase()}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white min-w-[180px]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/10" />

                              <DropdownMenuItem
                                className="cursor-pointer text-green-500 focus:text-green-500 hover:bg-green-900/20 focus:bg-green-900/20 font-bold"
                                onClick={() => handleUpdateStatus(p.bookingId, 'paid')}
                                disabled={p.status === 'paid'}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Paid
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="cursor-pointer text-blue-400 hover:bg-blue-900/20 focus:bg-blue-900/20 font-bold"
                                onClick={() => handleUpdateStatus(p.bookingId, 'confirmed')}
                                disabled={p.status === 'confirmed'}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Confirmed
                              </DropdownMenuItem>

                              {(p.status === 'paid' || p.status === 'confirmed') && (
                                <DropdownMenuItem
                                  className="cursor-pointer text-yellow-500 hover:bg-yellow-900/20 focus:bg-yellow-900/20"
                                  onClick={() => handleUpdateStatus(p.bookingId, 'pending')}
                                >
                                  <Clock className="w-4 h-4 mr-2" /> Revert to Pending
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-red-500 hover:bg-red-900/20 cursor-pointer focus:bg-red-900/20 font-bold" onClick={() => setCancelId(p.bookingId)}>
                                <Ban className="w-4 h-4 mr-2" /> Cancel & Free Slot
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                    <Users className="w-12 h-12 mb-4 opacity-50" />
                    <p>No active participants yet.</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="cancelled">
              <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden min-h-[500px]">
                {cancelledParticipants.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {cancelledParticipants.map((p: any, i: number) => (
                      <div key={p.bookingId || i} className="p-5 flex items-start gap-4 hover:bg-white/5 transition-colors opacity-75">
                        <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center font-bold text-red-500 border border-red-500/10 shrink-0">
                          <Ban className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-300 text-lg strike-through decoration-gray-500">{p.name || "Guest"}</p>
                            <Badge className="bg-red-900/20 text-red-400 border-red-900/50">CANCELLED</Badge>
                          </div>
                          <div className="mt-2 bg-red-950/30 border border-red-900/20 p-3 rounded-lg">
                            <p className="text-xs text-red-300 font-bold mb-1">Reason:</p>
                            <p className="text-sm text-gray-300 italic">"{p.cancelReason || 'No reason provided'}"</p>
                            <p className="text-[10px] text-gray-500 mt-2 text-right">
                              Cancelled on {p.cancelledAt ? new Date(p.cancelledAt).toLocaleString() : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 mb-4 opacity-50 text-green-500" />
                    <p>No cancellations yet. Good job!</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* CANCELLATION DIALOG */}
      <AlertDialog open={!!cancelId} onOpenChange={(open) => { if (!open) { setCancelId(null); setCancelReason(''); } }}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 flex items-center gap-2">
              <Ban className="w-5 h-5" /> Cancel Participant
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action will change the booking status to <strong>Cancelled</strong> and restore 1 slot to the event quota.
              <br />The data will <strong>NOT</strong> be deleted and will move to the "Cancelled" tab for records.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-3">
            <Label htmlFor="reason" className="text-white">Reason for Cancellation <span className="text-red-500">*</span></Label>
            <Textarea
              id="reason"
              placeholder="E.g. Player requested cancellation due to injury..."
              className="bg-white/5 border-white/10 text-white resize-none h-24"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelParticipant}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
              disabled={isCancelling || !cancelReason.trim()}
            >
              {isCancelling ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Confirm Cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
