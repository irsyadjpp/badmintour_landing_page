'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, MapPin, Clock, Users, CheckCircle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function MemberEventBookingPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { toast } = useToast();
    
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!params.id) return;
        const fetchEvent = async () => {
            try {
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

    const handleMemberBooking = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: event.id })
            });
            
            const result = await res.json();
            if (res.ok) {
                toast({ title: "Booking Berhasil", description: "Tiket telah ditambahkan ke dashboard Anda." });
                router.push('/member/dashboard');
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-[50vh] flex items-center justify-center text-gray-500"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (!event) return <div className="text-white">Event tidak ditemukan</div>;
    
    const isFull = (event.bookedSlot || 0) >= event.quota;

    return (
        <div className="space-y-6 pb-20 max-w-4xl">
            <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white pl-0 gap-2">
                <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>

            <Card className="bg-[#151515] border border-white/5 p-8 rounded-[2rem] overflow-hidden relative">
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-64 h-64 ${event.type === 'drilling' ? 'bg-[#00f2ea]' : 'bg-[#ca1f3d]'} opacity-5 blur-[80px] rounded-full pointer-events-none`}></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* KIRI: Detail Event */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="outline" className={`mb-3 ${event.type === 'drilling' ? 'text-[#00f2ea] border-[#00f2ea]/30 bg-[#00f2ea]/10' : 'text-[#ca1f3d] border-[#ca1f3d]/30 bg-[#ca1f3d]/10'}`}>
                                {event.type === 'drilling' ? 'DRILLING SESSION' : 'MABAR REGULER'}
                            </Badge>
                            <h1 className="text-3xl font-black text-white leading-tight">{event.title}</h1>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Tanggal</p>
                                    <p className="text-sm font-bold text-white">{new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Waktu</p>
                                    <p className="text-sm font-bold text-white">{event.time} WIB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Lokasi</p>
                                    <p className="text-sm font-bold text-white">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Konfirmasi Member */}
                    <div className="flex flex-col justify-between h-full bg-[#1A1A1A] rounded-2xl p-6 border border-white/10">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" /> Member Verification
                            </h3>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="w-12 h-12 border-2 border-[#ca1f3d]">
                                    <AvatarImage src={session?.user?.image || ''} />
                                    <AvatarFallback className="bg-[#222] text-white font-bold">{session?.user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-white">{session?.user?.name}</p>
                                    <p className="text-xs text-gray-400">{session?.user?.email}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4 border-t border-white/10">
                                <span className="text-gray-400 text-sm">Status</span>
                                <Badge className="bg-green-500/10 text-green-500 border-none">Active Member</Badge>
                            </div>
                            <div className="flex justify-between items-center pb-4">
                                <span className="text-gray-400 text-sm">Sisa Slot</span>
                                <span className="font-bold text-white">{event.quota - (event.bookedSlot || 0)} / {event.quota}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <span className="text-gray-400 text-sm">Total Bayar</span>
                                <span className="text-2xl font-black text-white">Rp {Number(event.price).toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div>
                            {isFull ? (
                                <Button disabled className="w-full h-12 bg-white/5 text-gray-500 font-bold rounded-xl border border-white/10">
                                    KUOTA PENUH
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleMemberBooking} 
                                    disabled={submitting}
                                    className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-lg rounded-xl shadow-lg transition-all"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : "KONFIRMASI JOIN"}
                                </Button>
                            )}
                            <p className="text-[10px] text-center text-gray-500 mt-3">
                                Invoice akan otomatis masuk ke menu Transaksi.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
