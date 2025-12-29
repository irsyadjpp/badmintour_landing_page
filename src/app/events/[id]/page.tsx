'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Users, Ticket, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/header';
import Image from 'next/image';

export default function PublicEventBookingPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form Khusus Guest
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    useEffect(() => {
        if (!params.id) return;
        const fetchEvent = async () => {
            try {
                // Di real app, gunakan API detail by ID: /api/events/${params.id}
                const res = await fetch('/api/events'); 
                const data = await res.json();
                if (data.data) {
                    const found = data.data.find((e:any) => e.id === params.id);
                    setEvent(found);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [params.id]);

    const handleGuestBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    guestName,
                    guestPhone
                })
            });

            const result = await res.json();
            if (res.ok) {
                toast({ title: "Booking Berhasil!", description: "Silakan lakukan pembayaran.", className: "bg-green-600 text-white" });
                // Redirect ke halaman sukses / instruksi bayar untuk guest
                // router.push(`/booking-success?id=${result.bookingId}`); 
                alert("Booking Berhasil! Silakan cek WA/Email untuk pembayaran (Simulasi).");
                router.push('/');
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    if (!event) return <div className="min-h-screen bg-black text-white p-10">Event tidak ditemukan</div>;

    const isFull = (event.bookedSlot || 0) >= event.quota;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Header /> 
            
            <div className="container mx-auto px-4 pt-32 pb-10 max-w-5xl">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-gray-400 hover:text-white pl-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* LEFT COLUMN: Event Details (Visual Menarik) */}
                    <div className="space-y-6">
                        <div className="relative h-64 w-full rounded-[2rem] overflow-hidden bg-gray-800 border border-white/10 shadow-2xl">
                            <div className={`absolute inset-0 bg-gradient-to-br ${event.type === 'drilling' ? 'from-[#00f2ea]/20 to-blue-900/40' : 'from-[#ca1f3d]/20 to-purple-900/40'}`}></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <Badge className={`mb-2 ${event.type === 'drilling' ? 'bg-[#00f2ea] text-black' : 'bg-[#ca1f3d] text-white'}`}>
                                    {event.type === 'drilling' ? 'DRILLING' : 'MABAR'}
                                </Badge>
                                <h1 className="text-3xl font-black uppercase leading-none">{event.title}</h1>
                            </div>
                        </div>

                        <div className="bg-[#151515] p-6 rounded-3xl border border-white/5 space-y-4">
                            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Detail Jadwal</h3>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Tanggal</p>
                                    <p className="font-bold">{new Date(event.date).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long'})}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Waktu</p>
                                    <p className="font-bold">{event.time} WIB</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Lokasi</p>
                                    <p className="font-bold">{event.location}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">Harga Tiket</p>
                                    <p className="text-2xl font-black text-[#ffbe00]">Rp {Number(event.price).toLocaleString('id-ID')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Sisa Kuota</p>
                                    <p className="text-xl font-bold">{event.quota - (event.bookedSlot || 0)} Slot</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Guest Form */}
                    <div>
                        <Card className="bg-white text-black p-8 rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black mb-2">Form Tamu (Guest)</h2>
                                <p className="text-gray-500 text-sm">Isi data diri untuk memesan tiket tanpa login.</p>
                            </div>

                            <form onSubmit={handleGuestBooking} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">Nama Lengkap / Panggilan</Label>
                                    <Input 
                                        required
                                        placeholder="Contoh: Budi Santoso"
                                        className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-black"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-bold text-gray-700">Nomor WhatsApp (Aktif)</Label>
                                    <Input 
                                        required
                                        type="tel"
                                        placeholder="0812xxxxxxxx"
                                        className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:ring-black"
                                        value={guestPhone}
                                        onChange={(e) => setGuestPhone(e.target.value)}
                                    />
                                    <p className="text-[10px] text-gray-500">*Bukti pembayaran & tiket akan dikonfirmasi via WA.</p>
                                </div>

                                {isFull ? (
                                    <Button disabled className="w-full h-14 text-lg font-black bg-gray-200 text-gray-400 rounded-xl">
                                        MAAF, KUOTA PENUH
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full h-14 text-lg font-black bg-black text-white hover:bg-gray-800 rounded-xl shadow-xl transition-transform hover:scale-[1.02]"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : <><Ticket className="w-5 h-5 mr-2" /> PESAN TIKET SEKARANG</>}
                                    </Button>
                                )}

                                <div className="text-center pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">Sudah punya akun member?</p>
                                    <Button variant="link" onClick={() => router.push('/login')} className="text-black font-bold h-auto p-0 text-sm">
                                        Login disini untuk harga khusus
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        {/* Info Security */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Pembayaran Aman & Terverifikasi Admin</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
