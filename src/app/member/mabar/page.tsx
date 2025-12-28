'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Calendar, Clock, BellRing, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import Link from 'next/link';

// 1. Pisahkan Logic Utama ke Komponen Content
function MabarContent() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get('id');
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [guestForm, setGuestForm] = useState({ name: '', phone: '' });
    const [participants, setParticipants] = useState<any[]>([]);
    const [isFull, setIsFull] = useState(false);

    // Fetch Detail Event & Participants
    useEffect(() => {
        if (!eventId) {
            setLoading(false);
            return;
        };

        const fetchEventData = async () => {
            setLoading(true);
            try {
                // Fetch Event Details
                const eventRes = await fetch('/api/events'); 
                const eventData = await eventRes.json();
                if (eventData.data) {
                    const found = eventData.data.find((e: any) => e.id === eventId);
                    setEvent(found);
                    if (found && found.registeredCount >= found.quota) {
                        setIsFull(true);
                    }
                }

                // Fetch Participants
                const participantsRes = await fetch(`/api/events/${eventId}/participants`);
                const participantsData = await participantsRes.json();
                if (participantsData.success) {
                    setParticipants(participantsData.data);
                }

            } catch (error) {
                console.error("Failed to fetch event data", error);
                toast({ title: "Error", description: "Gagal memuat detail event.", variant: "destructive"});
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId, toast]);

    const handleWaitingList = async () => {
        setBookingLoading(true);
        try {
            const res = await fetch('/api/events/waiting-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    eventId,
                    guestName: guestForm.name,
                    guestPhone: guestForm.phone
                })
            });
            
            const data = await res.json();
            if (res.ok) {
                toast({ title: "Berhasil!", description: "Anda masuk daftar tunggu. Kami akan info jika ada slot kosong.", className: "bg-blue-600 text-white" });
                router.push('/');
            } else {
                throw new Error(data.error);
            }
        } catch (e: any) {
            toast({ title: "Gagal", description: e.message, variant: "destructive" });
        } finally {
            setBookingLoading(false);
        }
    }


    // Handle Booking Logic
    const handleJoinMabar = async () => {
        // Validasi Guest Input jika tidak login
        if (!session && (!guestForm.name || !guestForm.phone)) {
            toast({ title: "Data Kurang", description: "Tamu wajib isi Nama & WhatsApp.", variant: "destructive" });
            return;
        }

        setBookingLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    eventId,
                    guestName: guestForm.name,
                    guestPhone: guestForm.phone
                })
            });

            const result = await res.json();

            if (result.success) {
                if(result.isGuest) {
                     toast({ title: "Booking Berhasil!", description: "Simpan bukti booking/tiket Anda.", className: "bg-green-600 text-white" });
                     router.push('/'); 
                } else {
                     toast({ title: "Booking Berhasil!", description: "Cek tiket di dashboard." });
                     router.push('/member/dashboard');
                }
            } else {
                throw new Error(result.error || "Gagal booking");
            }
        } catch (error: any) {
            toast({ title: "Gagal Join", description: error.message, variant: "destructive" });
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center text-white"><Loader2 className="animate-spin mx-auto w-8 h-8"/> Memuat Data Event...</div>;
    if (!event) return <div className="min-h-screen pt-24 text-center text-white">Event tidak ditemukan atau ID salah.</div>;

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 max-w-lg mx-auto">
            <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem] space-y-6">
                
                <div className="text-center">
                    <h1 className="text-2xl font-black text-white">{event.title}</h1>
                    <p className="text-[#ffbe00] font-bold mt-2 text-lg">Rp {event.price.toLocaleString('id-ID')}</p>
                </div>

                <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-[#ca1f3d]" />
                        <span>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <Clock className="w-5 h-5 text-[#ca1f3d]" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <MapPin className="w-5 h-5 text-[#ca1f3d]" />
                        <span>{event.location}</span>
                    </div>
                </div>

                {/* --- FITUR BARU: WHO IS PLAYING? --- */}
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Siapa yang main?</h3>
                        <span className="text-xs text-[#00f2ea] font-bold">{participants.length} / {event?.quota || 12} Joined</span>
                    </div>
                    
                    {participants.length > 0 ? (
                        <div className="flex items-center -space-x-3 overflow-hidden py-2">
                            {participants.slice(0, 5).map((p, i) => (
                                <Link key={i} href={`/profile/${p.id || '1'}`}>
                                    <div className="group relative cursor-pointer">
                                        <Avatar className="w-10 h-10 border-2 border-[#151515] shadow-lg transition-transform group-hover:scale-110 group-hover:border-[#00f2ea] group-hover:z-10">
                                            <AvatarImage src={p.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-[#ffbe00] to-[#ff0099] text-white text-[10px] font-bold">
                                                {p.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </Link>
                            ))}
                            {participants.length > 5 && (
                                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border-2 border-[#151515] flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                    +{participants.length - 5}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic">Belum ada peserta. Jadilah yang pertama!</p>
                    )}
                    
                    {/* List Nama Singkat */}
                    {participants.length > 0 && (
                        <p className="text-[10px] text-gray-500 truncate">
                            Bersama <span className="text-white font-bold">{participants[0].name}</span> dan teman-teman lainnya.
                        </p>
                    )}
                </div>

                {/* FORM INPUT KHUSUS GUEST (Hanya muncul jika BELUM LOGIN) */}
                {!session && (
                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#ffbe00]/30 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#ffbe00] animate-pulse"></span>
                            <p className="text-xs font-bold text-[#ffbe00] uppercase tracking-widest">Guest Mode</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-400">Nama Panggilan</Label>
                            <Input 
                                placeholder="Cth: Budi Badminton" 
                                className="bg-black/50 border-white/10 text-white"
                                value={guestForm.name}
                                onChange={(e) => setGuestForm({...guestForm, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-400">WhatsApp (Penting untuk History)</Label>
                            <Input 
                                type="tel" 
                                placeholder="08xxxxxxxxxx" 
                                className="bg-black/50 border-white/10 text-white"
                                value={guestForm.phone}
                                onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})}
                            />
                            <p className="text-[10px] text-gray-500 italic">
                                *Gunakan nomor yang sama saat mendaftar nanti agar history tersimpan.
                            </p>
                        </div>
                    </div>
                )}

                {isFull ? (
                    <Button 
                        onClick={handleWaitingList} 
                        disabled={bookingLoading}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-xl shadow-lg shadow-blue-900/20"
                    >
                        {bookingLoading ? <Loader2 className="animate-spin" /> : (
                            <span className="flex items-center gap-2">
                                <BellRing className="w-5 h-5" /> JOIN WAITING LIST
                            </span>
                        )}
                    </Button>
                ) : (
                    <Button 
                        onClick={handleJoinMabar} 
                        disabled={bookingLoading}
                        className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-xl rounded-xl shadow-lg"
                    >
                        {bookingLoading ? <Loader2 className="animate-spin" /> : (!session ? "BOOKING SEBAGAI TAMU" : "KONFIRMASI JOIN")}
                    </Button>
                )}
                
                {isFull && (
                    <p className="text-center text-xs text-blue-400 mt-2 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                        Kuota penuh. Masuk waiting list agar diprioritaskan saat ada yang cancel.
                    </p>
                )}
            
            </Card>
        </div>
    );
}

// 2. Bungkus Komponen Utama dengan Suspense
export default function MabarDetailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-[#121212]">
                <div className="animate-pulse flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-[#ffbe00] animate-spin mb-4" />
                    <p className="text-gray-400 text-sm tracking-widest">MEMUAT HALAMAN...</p>
                </div>
            </div>
        }>
            <MabarContent />
        </Suspense>
    );
}
