'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin,
    Calendar,
    Clock,
    Ticket,
    ArrowRight,
    Loader2,
    Smartphone,
    User,
    Trophy,
    Dumbbell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export default function PublicEventPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Guest Form State
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');

    useEffect(() => {
        if (!params.id) return;
        const fetchEvent = async () => {
            try {
                // Fetch public event data
                const res = await fetch('/api/events');
                const data = await res.json();
                if (data.data) {
                    const found = data.data.find((e: any) => e.id === params.id);
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
                toast({ title: "Booking Berhasil!", description: "Silakan cek WhatsApp untuk pembayaran.", className: "bg-[#00f2ea] text-black border-none" });
                router.push('/'); // Redirect ke Home atau Success Page
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
            <div className="w-16 h-16 border-4 border-[#ca1f3d] border-t-transparent rounded-full animate-spin"></div>
            <p className="tracking-widest font-mono text-xs animate-pulse">LOADING EVENT DATA...</p>
        </div>
    );

    if (!event) return <div className="min-h-screen bg-[#050505] text-white p-10">Event tidak ditemukan</div>;

    const isFull = (event.bookedSlot || 0) >= event.quota;
    const isDrilling = event.type === 'drilling';
    const isTournament = event.type === 'tournament';

    // Theme Colors
    const accentColor = isTournament ? 'text-purple-500' : (isDrilling ? 'text-[#00f2ea]' : 'text-[#ca1f3d]');
    const accentBg = isTournament ? 'bg-purple-600' : (isDrilling ? 'bg-[#00f2ea]' : 'bg-[#ca1f3d]');
    const accentBorder = isTournament ? 'border-purple-500/20' : (isDrilling ? 'border-[#00f2ea]/20' : 'border-[#ca1f3d]/20');
    const badgeBg = isTournament ? 'bg-purple-500/10' : (isDrilling ? 'bg-[#00f2ea]/10' : 'bg-[#ca1f3d]/10');

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ca1f3d] selection:text-white font-sans overflow-hidden relative">

            {/* Background Effects */}
            <div className={`fixed top-[-20%] left-[-10%] w-[500px] h-[500px] ${accentBg} opacity-20 blur-[150px] rounded-full pointer-events-none`}></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600 opacity-10 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Navbar Simple */}
            <nav className="absolute top-0 w-full p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
                <div className="font-black text-xl tracking-tighter italic">
                    BADMIN<span className={accentColor}>TOUR</span>
                </div>
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full" onClick={() => router.push('/')}>
                    Close
                </Button>
            </nav>

            <div className="container mx-auto px-4 min-h-screen flex items-center justify-center py-20 relative z-10">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* LEFT SIDE: Event Info (Typographic & Visual) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <Badge className={`mb-4 px-4 py-2 text-xs font-bold uppercase tracking-widest ${badgeBg} ${accentColor} ${accentBorder} backdrop-blur-md`}>
                                {isDrilling ? <Dumbbell className="w-3 h-3 mr-2" /> : isTournament ? <Trophy className="w-3 h-3 mr-2" /> : <Trophy className="w-3 h-3 mr-2" />}
                                {isDrilling ? 'Drilling Session' : isTournament ? 'External Tournament' : 'Fun Match'}
                            </Badge>

                            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
                                {event.title}
                            </h1>

                            <p className="text-xl text-gray-400 max-w-md leading-relaxed">
                                {isTournament ? "Compete with the best. Show your skills." : "Join the game. Level up your skills. Connect with the community."}
                            </p>
                        </div>

                        {/* Info Grid - Bento Style */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors">
                                <Calendar className={`w-6 h-6 ${accentColor} mb-2`} />
                                <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                                <p className="font-bold text-lg">{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors">
                                <Clock className={`w-6 h-6 ${accentColor} mb-2`} />
                                <p className="text-xs text-gray-500 uppercase font-bold">Time</p>
                                <p className="font-bold text-lg">{event.time}</p>
                            </div>
                            <div className="col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className={`w-4 h-4 ${accentColor}`} />
                                        <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                                    </div>
                                    <p className="font-bold text-lg">{event.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Price</p>
                                    <p className={`text-2xl font-black ${accentColor}`}>Rp {Number(event.price).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Guest Form (Card Float) OR External Link */}
                    <div className="lg:col-span-5">
                        <Card className="bg-[#101010]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            {/* Decorative Top Line */}
                            <div className={`absolute top-0 left-0 w-full h-2 ${accentBg}`}></div>

                            {isTournament ? (
                                // TAMPILAN KHUSUS TOURNAMENT (LINK EKSTERNAL)
                                <div className="text-center py-8">
                                    <Trophy className={`w-20 h-20 ${accentColor} mx-auto mb-6 animate-bounce`} />
                                    <h2 className="text-2xl font-black text-white mb-2">External Registration</h2>
                                    <p className="text-gray-500 text-sm mb-8">Event ini diselenggarakan oleh pihak eksternal.</p>

                                    <Button
                                        onClick={() => event.externalLink ? window.open(event.externalLink, '_blank') : alert('Link tidak tersedia')}
                                        className={`w-full h-16 rounded-2xl text-lg font-black text-white ${accentBg} hover:brightness-110 shadow-lg transition-all`}
                                    >
                                        DAFTAR WEBSITE RESMI <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                    <p className="text-[10px] text-gray-600 mt-4">Anda akan diarahkan ke website penyelenggara.</p>
                                </div>
                            ) : (
                                // FORM GUEST MABAR / DRILLING
                                <>
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-black text-white mb-1">Guest Access</h2>
                                        <p className="text-gray-500 text-sm">Secure your slot instantly without login.</p>
                                    </div>

                                    <form onSubmit={handleGuestBooking} className="space-y-6">
                                        <div className="space-y-2 group">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-focus-within:text-white transition-colors">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                                <Input
                                                    required
                                                    value={guestName}
                                                    onChange={(e) => setGuestName(e.target.value)}
                                                    placeholder="Enter your name"
                                                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:border-white/30 focus:bg-white/10 focus:ring-0 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-focus-within:text-white transition-colors">WhatsApp Number</Label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                                <Input
                                                    required
                                                    type="tel"
                                                    value={guestPhone}
                                                    onChange={(e) => setGuestPhone(e.target.value)}
                                                    placeholder="08xxxxxxxxxx"
                                                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:border-white/30 focus:bg-white/10 focus:ring-0 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            {isFull ? (
                                                <Button disabled className="w-full h-16 rounded-2xl bg-white/5 text-gray-500 font-bold border border-white/5 uppercase tracking-widest cursor-not-allowed">
                                                    Sold Out
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className={`w-full h-16 rounded-2xl text-lg font-black text-black ${accentBg} hover:brightness-110 shadow-[0_0_30px_-5px_rgba(202,31,61,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98]`}
                                                >
                                                    {submitting ? <Loader2 className="animate-spin" /> : (
                                                        <span className="flex items-center gap-2">
                                                            GET TICKET <ArrowRight className="w-5 h-5" />
                                                        </span>
                                                    )}
                                                </Button>
                                            )}
                                        </div>

                                        <div className="text-center pt-2">
                                            <p className="text-xs text-gray-600">
                                                Already a member? <span className="text-white underline font-bold cursor-pointer hover:text-gray-300" onClick={() => router.push('/login')}>Login Here</span>
                                            </p>
                                        </div>
                                    </form>
                                </>
                            )}
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
