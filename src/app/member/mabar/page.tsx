
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

    // Fetch Detail Event
    useEffect(() => {
        if(!eventId) return;
        const fetchDetail = async () => {
            try {
                const res = await fetch('/api/events'); 
                const data = await res.json();
                if (data.data) {
                    const found = data.data.find((e: any) => e.id === eventId);
                    setEvent(found);
                }
            } catch (error) {
                console.error("Failed to fetch event detail");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [eventId]);

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

                <Button 
                    onClick={handleJoinMabar} 
                    disabled={bookingLoading}
                    className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-xl rounded-xl shadow-lg"
                >
                    {bookingLoading ? <Loader2 className="animate-spin" /> : (!session ? "BOOKING SEBAGAI TAMU" : "KONFIRMASI JOIN")}
                </Button>
                <p className="text-center text-xs text-gray-500">Saldo/Kuota akan terpotong otomatis.</p>
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
