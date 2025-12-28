
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Calendar, Clock, Dumbbell, User } from 'lucide-react'; // Tambah icon
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

function EventDetailContent() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get('id');
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    
    // Form untuk Guest (Public)
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

    // Handle Booking (Member & Guest)
    const handleBooking = async () => {
        // Validasi Guest
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
                     // Public User: Redirect ke Home atau Halaman Sukses
                     toast({ title: "Booking Berhasil!", description: "Mohon simpan bukti booking Anda.", className: "bg-green-600 text-white" });
                     router.push('/'); 
                } else {
                     // Member: Redirect ke Dashboard
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

    if (loading) return <div className="min-h-screen pt-24 text-center text-white"><Loader2 className="animate-spin mx-auto w-8 h-8"/> Memuat Data...</div>;
    if (!event) return <div className="min-h-screen pt-24 text-center text-white">Event tidak ditemukan.</div>;

    const isDrilling = event.type === 'drilling';
    const isFull = event.bookedSlot >= event.quota;

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 max-w-lg mx-auto">
            <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
                {/* Visual Header */}
                <div className={`absolute top-0 left-0 right-0 h-2 ${isDrilling ? 'bg-[#00f2ea]' : 'bg-[#ca1f3d]'}`}></div>
                
                <div className="text-center">
                    {isDrilling && (
                        <Badge variant="outline" className="mb-2 text-[#00f2ea] border-[#00f2ea] bg-[#00f2ea]/10">
                            DRILLING / CLINIC
                        </Badge>
                    )}
                    <h1 className="text-2xl font-black text-white leading-tight">{event.title}</h1>
                    
                    {/* Harga */}
                    <p className={`font-bold mt-2 text-lg ${isDrilling ? 'text-[#00f2ea]' : 'text-[#ffbe00]'}`}>
                        Rp {event.price.toLocaleString('id-ID')}
                    </p>
                </div>

                {/* Coach Info (Khusus Drilling) */}
                {isDrilling && event.coachName && (
                    <div className="flex items-center gap-4 bg-[#00f2ea]/10 p-4 rounded-xl border border-[#00f2ea]/20">
                        <div className="w-10 h-10 rounded-full bg-[#00f2ea] flex items-center justify-center text-black font-bold">
                            <Dumbbell className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-[#00f2ea] font-bold uppercase">Dilatih Oleh</p>
                            <p className="font-bold text-white text-lg">{event.coachName}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className={`w-5 h-5 ${isDrilling ? 'text-[#00f2ea]' : 'text-[#ca1f3d]'}`} />
                        <span>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <Clock className={`w-5 h-5 ${isDrilling ? 'text-[#00f2ea]' : 'text-[#ca1f3d]'}`} />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <MapPin className={`w-5 h-5 ${isDrilling ? 'text-[#00f2ea]' : 'text-[#ca1f3d]'}`} />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <User className={`w-5 h-5 ${isDrilling ? 'text-[#00f2ea]' : 'text-[#ca1f3d]'}`} />
                        <span>Sisa Kuota: <span className="text-white font-bold">{event.quota - (event.bookedSlot || 0)} Slot</span></span>
                    </div>
                </div>

                {/* FORM INPUT KHUSUS GUEST (Hanya muncul jika BELUM LOGIN) */}
                {!session && (
                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#ffbe00]/30 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#ffbe00] animate-pulse"></span>
                            <p className="text-xs font-bold text-[#ffbe00] uppercase tracking-widest">Guest Mode (Tanpa Login)</p>
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
                            <Label className="text-xs text-gray-400">WhatsApp (Wajib Aktif)</Label>
                            <Input 
                                type="tel" 
                                placeholder="08xxxxxxxxxx" 
                                className="bg-black/50 border-white/10 text-white"
                                value={guestForm.phone}
                                onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                <Button 
                    onClick={handleBooking} 
                    disabled={bookingLoading || isFull}
                    className={`w-full h-14 font-black text-xl rounded-xl shadow-lg ${
                        isDrilling 
                            ? "bg-[#00f2ea] text-black hover:bg-[#00c2bb]" 
                            : "bg-[#ca1f3d] text-white hover:bg-[#a01830]"
                    }`}
                >
                    {bookingLoading ? <Loader2 className="animate-spin" /> : (
                        isFull ? "KUOTA PENUH" : (!session ? "BOOKING SEBAGAI TAMU" : "KONFIRMASI JOIN")
                    )}
                </Button>
                
                {!session && (
                    <p className="text-center text-[10px] text-gray-500">
                        Sudah punya akun? <span className="text-white underline cursor-pointer" onClick={() => router.push('/login')}>Login disini</span> agar tercatat di history.
                    </p>
                )}
            </Card>
        </div>
    );
}

export default function EventDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventDetailContent />
        </Suspense>
    );
}
