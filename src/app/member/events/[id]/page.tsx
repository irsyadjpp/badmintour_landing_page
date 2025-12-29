'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, MapPin, Clock, Info, CheckCircle, Loader2, Users } from 'lucide-react';
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
                const res = await fetch('/api/events'); // Fetch all events, filter client side
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
                body: JSON.stringify({ eventId: event.id }) // Tidak butuh nama/HP, ambil dari session backend
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

    if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    if (!event) return <div className="text-white p-6">Event tidak ditemukan atau sudah selesai.</div>;
    
    const isFull = (event.bookedSlot || 0) >= event.quota;

    return (
        <div className="space-y-8 pb-20">
            {/* Header Member Style */}
            <div>
                <Badge variant="outline" className={`mb-2 ${event.type === 'drilling' ? 'text-[#00f2ea] border-[#00f2ea]' : 'text-[#ca1f3d] border-[#ca1f3d]'}`}>
                    {event.type === 'drilling' ? 'DRILLING SESSION' : 'MABAR BADMINTON'}
                </Badge>
                <h1 className="text-3xl font-black text-white">{event.title}</h1>
                <p className="text-gray-400">Konfirmasi keikutsertaan Anda pada event ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Event Info Card */}
                <Card className="bg-[#151515] border border-white/5 p-6 rounded-[2rem]">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Detail Event</h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Calendar className="w-5 h-5 text-[#ffbe00]" />
                            <div>
                                <p className="text-xs text-gray-500">Tanggal</p>
                                <p className="font-bold text-white">{new Date(event.date).toLocaleDateString('id-ID', {dateStyle: 'full'})}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Clock className="w-5 h-5 text-[#ffbe00]" />
                            <div>
                                <p className="text-xs text-gray-500">Waktu</p>
                                <p className="font-bold text-white">{event.time} WIB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin className="w-5 h-5 text-[#ffbe00]" />
                            <div>
                                <p className="text-xs text-gray-500">Lokasi</p>
                                <p className="font-bold text-white">{event.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Users className="w-5 h-5 text-[#ffbe00]" />
                            <div>
                                <p className="text-xs text-gray-500">Sisa Slot</p>
                                <p className="font-bold text-white">{event.quota - (event.bookedSlot || 0)} dari {event.quota} pemain</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Confirmation Card */}
                <Card className="bg-[#1A1A1A] border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Konfirmasi Pemain</h3>
                        
                        {/* User Profile Preview */}
                        <div className="flex items-center gap-4 bg-black/30 p-4 rounded-xl mb-6 border border-white/5">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={session?.user?.image || ''} />
                                <AvatarFallback className="bg-[#ca1f3d] text-white font-bold">{session?.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm text-gray-400">Masuk sebagai:</p>
                                <p className="font-bold text-white text-lg">{session?.user?.name}</p>
                                <p className="text-xs text-[#00f2ea]">Member Access</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-white/10 pt-4 mb-6">
                            <span className="text-gray-400 text-sm">Total Bayar</span>
                            <span className="text-3xl font-black text-[#ffbe00]">Rp {Number(event.price).toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div>
                        {isFull ? (
                             <Button disabled className="w-full h-14 bg-white/10 text-gray-500 font-bold rounded-xl">
                                KUOTA PENUH - JOIN WAITING LIST
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleMemberBooking} 
                                disabled={submitting}
                                className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-lg rounded-xl shadow-[0_0_20px_rgba(202,31,61,0.4)]"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : "JOIN SEKARANG"}
                            </Button>
                        )}
                        <p className="text-[10px] text-center text-gray-500 mt-3">
                            Dengan klik join, Anda menyetujui aturan Mabar.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
