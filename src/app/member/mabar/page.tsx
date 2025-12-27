'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function MabarDetailPage() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get('id');
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // 1. Fetch Detail Event
    useEffect(() => {
        if(!eventId) return;
        const fetchDetail = async () => {
            // Note: Anda perlu buat API endpoint GET /api/events/[id] atau filter di client
            // Untuk MVP, kita pakai list endpoint lalu find (kurang efisien tapi cepat devnya)
            const res = await fetch('/api/events'); 
            const data = await res.json();
            const found = data.data.find((e: any) => e.id === eventId);
            setEvent(found);
            setLoading(false);
        };
        fetchDetail();
    }, [eventId]);

    // 2. Handle Booking Logic
    const handleJoinMabar = async () => {
        if (!session) {
            toast({ title: "Login Dulu", description: "Wajib login untuk join mabar." });
            router.push('/login');
            return;
        }

        setBookingLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId })
            });

            const result = await res.json();

            if (result.success) {
                toast({ title: "Berhasil Join!", description: "Slot diamankan. Cek tiket di dashboard.", className: "bg-green-600 text-white" });
                router.push('/member/dashboard'); // Redirect ke dashboard untuk lihat tiket
            } else {
                throw new Error(result.error || "Gagal booking");
            }
        } catch (error: any) {
            toast({ title: "Gagal Join", description: error.message, variant: "destructive" });
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/> Loading Event...</div>;
    if (!event) return <div className="p-10 text-center">Event tidak ditemukan</div>;

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 max-w-lg mx-auto">
            <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem] space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-white">{event.title}</h1>
                    <p className="text-[#ffbe00] font-bold mt-2 text-lg">Rp {event.price.toLocaleString()}</p>
                </div>

                <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-[#ca1f3d]" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
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

                <Button 
                    onClick={handleJoinMabar} 
                    disabled={bookingLoading}
                    className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-xl rounded-xl shadow-lg"
                >
                    {bookingLoading ? <Loader2 className="animate-spin" /> : "KONFIRMASI JOIN"}
                </Button>
                <p className="text-center text-xs text-gray-500">Saldo/Kuota akan terpotong otomatis.</p>
            </Card>
        </div>
    );
}
