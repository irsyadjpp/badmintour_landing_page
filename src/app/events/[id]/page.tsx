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
    Dumbbell,
    Download,
    TriangleAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import QRCode from 'react-qr-code';
import { cn, isValidIndonesianPhoneNumber, formatIndonesianPhoneNumber } from '@/lib/utils';
import { FeedbackModal } from '@/components/ui/feedback-modal';

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
    const [partnerName, setPartnerName] = useState(''); // NEW STATE

    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingData, setBookingData] = useState<any>(null);
    const [isDuplicateError, setIsDuplicateError] = useState(false); // NEW STATE

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Gunakan params.id langsung
                if (!params.id) return;

                const res = await fetch(`/api/events/${params.id}`);
                const data = await res.json();

                if (data.success) {
                    setEvent(data.data);
                } else {
                    toast({ title: "Error", description: "Event tidak ditemukan", variant: "destructive" });
                }
            } catch (error) {
                console.error("Fetch Event Error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [params.id, toast]);

    const handleGuestBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION
        if (!isValidIndonesianPhoneNumber(guestPhone)) {
            toast({ title: "Nomor Tidak Valid", description: "Gunakan format Indonesia (08xx... atau 628xx...).", variant: "destructive" });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    guestName,
                    guestPhone,
                    partnerName // Send Partner Name
                })
            });

            const result = await res.json();
            if (res.ok) {
                toast({ title: "Booking Berhasil!", description: "Tiket Anda telah terbit.", className: "bg-[#10b981] text-black border-none" });
                setBookingData({
                    id: result.bookingCode || 'BT-TICKET-SV',
                    name: guestName,
                    phone: guestPhone
                });
                setBookingSuccess(true);
            } else {
                const errorMsg = result.error?.toLowerCase() || "terjadi kesalahan tidak diketahui";
                if (errorMsg.includes("terdaftar") || errorMsg.includes("duplicate")) {
                    setIsDuplicateError(true);
                } else {
                    throw new Error(result.error || "Gagal memproses booking");
                }
            }
        } catch (error: any) {
            if (!isDuplicateError) {
                toast({ title: "Gagal", description: error.message, variant: "destructive" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleJoinWaitingList = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION
        if (!isValidIndonesianPhoneNumber(guestPhone)) {
            toast({ title: "Nomor Tidak Valid", description: "Gunakan format Indonesia (08xx... atau 628xx...).", variant: "destructive" });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/events/waiting-list', {
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
                toast({ title: "Berhasil!", description: "Anda masuk daftar tunggu.", className: "bg-[#ffbe00] text-black border-none" });
                setGuestName('');
                setGuestPhone('');
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

    const handleDownloadTicket = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const svgElement = document.getElementById("ticket-qr-code");

        if (!ctx || !svgElement) return;

        // Set HD Resolution (Instagram Story Format)
        canvas.width = 1080;
        canvas.height = 1920;

        // 1. Background (Dark Theme)
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Top Gradient Accent
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#ca1f3d");
        gradient.addColorStop(1, "#ffbe00");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, 20);

        // Load Logo
        const logoImg = new window.Image();
        logoImg.src = "/images/logo-light.png";
        logoImg.crossOrigin = "anonymous";

        logoImg.onload = () => {
            // 3. Header Logo & Branding
            const logoWidth = 150;
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            const logoX = (canvas.width - logoWidth) / 2;
            ctx.drawImage(logoImg, logoX, 120, logoWidth, logoHeight);

            ctx.font = "900 60px Outfit, sans-serif";
            const textString = "BADMINTOUR";
            const dotString = ".";

            // Calculate widths to center the combined text
            const textWidth = ctx.measureText(textString).width;
            const dotWidth = ctx.measureText(dotString).width;
            const totalTextWidth = textWidth + dotWidth;
            const textStartX = (canvas.width - totalTextWidth) / 2;
            const textY = 120 + logoHeight + 60; // Adjusted spacing

            // Draw "BADMINTOUR" (White)
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "left"; // Reset to left for manual positioning
            ctx.fillText(textString, textStartX, textY);

            // Draw "." (Yellow)
            ctx.fillStyle = "#ffbe00";
            ctx.fillText(dotString, textStartX + textWidth, textY);

            ctx.font = "bold 24px Outfit, sans-serif";
            ctx.fillStyle = "#888888";
            ctx.textAlign = "center"; // Back to center for subtitle
            ctx.letterSpacing = "4px";
            ctx.fillText("OFFICIAL EVENT TICKET", canvas.width / 2, textY + 50);

            // 4. White Card for QR
            const cardY = 500; // Adjusted up
            const cardHeight = 900;
            const cardWidth = 800;
            const cardX = (canvas.width - cardWidth) / 2;

            ctx.fillStyle = "#FFFFFF";
            ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 40);
            ctx.fill();

            // 5. Draw QR Code
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            const qrImg = new window.Image();

            qrImg.onload = () => {
                const qrSize = 500;
                const qrX = (canvas.width - qrSize) / 2;
                const qrY = cardY + 100;

                ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
                URL.revokeObjectURL(url);

                // 6. Ticket Details (Inside White Card)
                ctx.font = "900 50px monospace";
                ctx.textAlign = "center";
                ctx.fillStyle = "#000000";
                ctx.fillText(bookingData.id, canvas.width / 2, qrY + qrSize + 80);

                ctx.font = "bold 24px Outfit, sans-serif";
                ctx.fillStyle = "#666666";
                ctx.fillText("SCAN AT VENUE", canvas.width / 2, qrY + qrSize + 130);

                // Separator Line
                ctx.strokeStyle = "#EEEEEE";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.setLineDash([20, 15]);
                ctx.moveTo(cardX + 40, qrY + qrSize + 180);
                ctx.lineTo(cardX + cardWidth - 40, qrY + qrSize + 180);
                ctx.stroke();

                // 7. Event Details
                const detailsY = qrY + qrSize + 250;

                ctx.font = "bold 24px Outfit, sans-serif";
                ctx.fillStyle = "#888888";
                ctx.fillText("EVENT", canvas.width / 2, detailsY);

                ctx.font = "900 40px Outfit, sans-serif";
                ctx.fillStyle = "#000000";
                const title = event.title.length > 25 ? event.title.substring(0, 25) + "..." : event.title;
                ctx.fillText(title, canvas.width / 2, detailsY + 50);

                ctx.font = "bold 24px Outfit, sans-serif";
                ctx.fillStyle = "#888888";
                ctx.fillText("GUEST", canvas.width / 2, detailsY + 120);

                ctx.font = "bold 35px Outfit, sans-serif";
                ctx.fillStyle = "#000000";
                ctx.fillText(bookingData.name, canvas.width / 2, detailsY + 170);

                // 8. Trigger Download
                const link = document.createElement("a");
                link.download = `TICKET-${bookingData.id}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            };
            qrImg.src = url;
        };
    };

    if (bookingSuccess && bookingData) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans text-white">
                <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]"></div>

                    {/* Branding Header */}
                    <div className="mb-6 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-3">
                            <img src="/images/logo-light.png" alt="BadminTour" className="w-10 h-10 object-contain" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter font-sans">BADMINTOUR<span className="text-[#ffbe00]">.</span></h2>
                        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Order Confirmation</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl mb-6 shadow-inner relative">
                        {/* Hidden Logo for Canvas Context if needed, but we load async */}
                        <div className="aspect-square w-full bg-white flex items-center justify-center mb-4">
                            <QRCode
                                id="ticket-qr-code"
                                value={JSON.stringify({
                                    id: bookingData.id,
                                    event: event.title,
                                    name: bookingData.name
                                })}
                                size={200}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <p className="text-black font-black text-2xl tracking-widest">{bookingData.id}</p>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Scan at Venue</p>
                    </div>

                    {/* Information Text (Excluded from Canvas usually, but here we just show it) */}
                    <div className="space-y-4 mb-8">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Event</p>
                            <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Guest</p>
                                <p className="text-white font-medium">{bookingData.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-white font-medium">{bookingData.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleDownloadTicket}
                            className="w-full h-14 bg-[#ffbe00] hover:bg-[#ffbe00]/90 text-black font-black rounded-xl text-lg shadow-lg flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            SIMPAN TIKET (GAMBAR)
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="ghost"
                            className="w-full text-gray-500 hover:text-white"
                        >
                            Booking Lagi
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) return <div className="min-h-screen bg-[#050505] text-white p-10">Event tidak ditemukan</div>;

    const isFull = (event.bookedSlot || 0) >= event.quota;
    const isDrilling = event.type === 'drilling';
    const isTournament = event.type === 'tournament';

    // Theme Colors (Strict BadminTour Branding: Red, Yellow, Dark)
    // We treat external tournaments/drilling as accents, but main theme is Red/Yellow.
    const accentColor = 'text-[#ca1f3d]';
    const accentBg = 'bg-[#ca1f3d]';
    const accentBorder = 'border-[#ca1f3d]/20';
    const badgeBg = isDrilling ? 'bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/20' :
        isTournament ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
            'bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/20';

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ffbe00] selection:text-black font-sans overflow-hidden relative">

            {/* Background Effects (Brand Colors) */}
            <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ca1f3d] opacity-10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#ffbe00] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Navbar Simple */}
            <nav className="absolute top-0 w-full p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
                <div className="flex items-center gap-3">
                    <img src="/images/logo-light.png" alt="BadminTour" className="w-8 h-8 object-contain" />
                    <span className="font-black text-xl tracking-tighter font-sans text-white">
                        BADMINTOUR<span className="text-[#ffbe00]">.</span>
                    </span>
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
                            <Badge className={`mb-4 px-4 py-2 text-xs font-bold uppercase tracking-widest ${badgeBg} backdrop-blur-md`}>
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
                                <p className="font-bold text-lg">
                                    {event.date.includes(' - ') ? (
                                        (() => {
                                            const [start, end] = event.date.split(' - ');
                                            const startDate = new Date(start);
                                            const endDate = new Date(end);
                                            return `${startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`;
                                        })()
                                    ) : (
                                        new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                    )}
                                </p>
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

                        {/* Drilling Specific Details (Skill & Curriculum) */}
                        {event.type === 'drilling' && (
                            <div className="mt-4 bg-[#ffbe00]/5 p-5 rounded-3xl border border-[#ffbe00]/20 space-y-3">
                                <div className="flex items-center gap-2 mb-2 border-b border-[#ffbe00]/20 pb-2">
                                    <Dumbbell className="w-5 h-5 text-[#ffbe00]" />
                                    <span className="text-xs font-bold text-[#ffbe00] uppercase tracking-wider">Drilling Info</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Focus Area</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="border-[#ffbe00] text-[#ffbe00] bg-[#ffbe00]/10 capitalize">
                                                {event.skillLevel === 'all' ? 'Semua Level' :
                                                    event.skillLevel === 'beginner' ? 'Beginner (Pemula)' :
                                                        event.skillLevel === 'intermediate' ? 'Intermediate (Menengah)' :
                                                            event.skillLevel === 'advanced' ? 'Advanced (Mahir)' : 'General'}
                                            </Badge>
                                        </div>
                                    </div>
                                    {event.curriculum && (
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Materi / Kurikulum</p>
                                            <p className="text-sm text-gray-300 leading-relaxed">{event.curriculum}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tournament Specific Details */}
                        {isTournament && (
                            <div className="mt-4 bg-purple-500/5 p-5 rounded-3xl border border-purple-500/20 space-y-5">
                                <div className="flex items-center gap-2 mb-2 border-b border-purple-500/20 pb-2">
                                    <Trophy className="w-5 h-5 text-purple-500" />
                                    <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Tournament Info</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {event.organizer && (
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Penyelenggara</p>
                                            <p className="text-white font-bold text-lg">{event.organizer}</p>
                                        </div>
                                    )}
                                    {event.playerCriteria && (
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Kriteria Peserta</p>
                                            <Badge variant="outline" className="border-purple-500 text-purple-500 bg-purple-500/10">
                                                {event.playerCriteria}
                                            </Badge>
                                        </div>
                                    )}
                                    {event.prizes && (
                                        <div className="col-span-2 bg-[#ffbe00]/5 p-4 rounded-xl border border-[#ffbe00]/20">
                                            <p className="text-[10px] text-[#ffbe00] uppercase font-bold mb-2 flex items-center gap-2">
                                                <Trophy className="w-3 h-3" /> Hadiah / Prize Pool
                                            </p>
                                            <p className="text-white font-bold whitespace-pre-wrap leading-relaxed">
                                                {event.prizes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Guest Form OR QR TICKET */}
                    <div className="lg:col-span-5">
                        <Card className="bg-[#101010]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            {/* Decorative Top Line */}
                            <div className={`absolute top-0 left-0 w-full h-2 ${accentBg}`}></div>

                            {bookingSuccess && bookingData ? (
                                // TAMPILAN QR CODE TICKET
                                <div className="flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                                    <div className="mb-6">
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                            <Ticket className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-2">Ticket Issued!</h2>
                                        <p className="text-gray-400 text-sm">Scan QR ini kepada Host/Coach.</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                        <QRCode
                                            value={bookingData.id}
                                            size={200}
                                            viewBox={`0 0 256 256`}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        />
                                    </div>

                                    <div className="space-y-1 mb-8">
                                        <p className="text-xs uppercase text-gray-500 font-bold">Booking ID</p>
                                        <p className="font-mono text-xl text-white tracking-widest">{bookingData.id}</p>
                                    </div>

                                    <Button
                                        onClick={() => window.print()}
                                        variant="outline"
                                        className="w-full border-white/10 hover:bg-white/10 text-white rounded-xl"
                                    >
                                        Simpan Tiket
                                    </Button>
                                    <p className="text-[10px] text-gray-600 mt-4 max-w-xs">
                                        Screenshot layar ini sebagai bukti tiket valid Anda.
                                    </p>
                                </div>
                            ) : (isTournament && (!event.allowedUserTypes || !event.allowedUserTypes.includes('guest'))) ? (
                                // MEMBER ONLY VIEW
                                <div className="text-center py-8">
                                    <Trophy className={`w-20 h-20 ${accentColor} mx-auto mb-6 animate-pulse`} />
                                    <Badge variant="outline" className="mb-4 border-red-500 text-red-500">MEMBER ONLY</Badge>
                                    <h2 className="text-2xl font-black text-white mb-2">Pendaftaran Khusus Member</h2>
                                    <p className="text-gray-500 text-sm mb-8">Silakan login untuk mendaftar turnamen ini.</p>

                                    <Button
                                        onClick={() => router.push('/login')}
                                        className={`w-full h-16 rounded-2xl text-lg font-black text-white ${accentBg} hover:brightness-110 shadow-lg transition-all`}
                                    >
                                        LOGIN MEMBER <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            ) : (
                                // GUEST FORM (Used for Tournament Guest & Regular Events)
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
                                                    onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                                                    onBlur={() => {
                                                        if (guestPhone) setGuestPhone(formatIndonesianPhoneNumber(guestPhone));
                                                    }}
                                                    placeholder="08xxxxxxxxxx"
                                                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:border-white/30 focus:bg-white/10 focus:ring-0 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* PARTNER INPUT (For Tournaments with User Pick) */}
                                        {isTournament && event.partnerMechanism === 'user' && (
                                            <div className="space-y-2 group">
                                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Partner Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                    <Input
                                                        required
                                                        value={partnerName}
                                                        onChange={(e) => setPartnerName(e.target.value)}
                                                        placeholder="Nama Pasangan (Partner)"
                                                        className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4">
                                            {isFull ? (
                                                event.allowWaitingList ? (
                                                    <Button
                                                        onClick={(e) => handleJoinWaitingList(e)}
                                                        disabled={submitting}
                                                        className={`w-full h-16 rounded-2xl text-lg font-black text-black bg-[#ffbe00] hover:brightness-110 shadow-[0_0_30px_-5px_rgba(255,190,0,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98]`}
                                                    >
                                                        {submitting ? <Loader2 className="animate-spin" /> : (
                                                            <span className="flex items-center gap-2">
                                                                JOIN WAITING LIST <ArrowRight className="w-5 h-5" />
                                                            </span>
                                                        )}
                                                    </Button>
                                                ) : (
                                                    <Button disabled className="w-full h-16 rounded-2xl bg-white/5 text-gray-500 font-bold border border-white/5 uppercase tracking-widest cursor-not-allowed">
                                                        Sold Out
                                                    </Button>
                                                )
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

            {/* MODAL ERROR DUPLICATE (RED CARD THEME) */}
            {/* MODAL FEEDBACK STANDARDIZED */}
            <FeedbackModal
                isOpen={isDuplicateError}
                onClose={() => setIsDuplicateError(false)}
                type="error"
                title="Double Fault!"
                description={
                    <span>
                        Ops! Nomor WhatsApp <span className="text-white font-bold underline decoration-[#ffbe00]">{guestPhone}</span> sudah terdaftar di event ini.
                        <br /><br />
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">1 Nomor = 1 Tiket Event</span>
                    </span>
                }
                primaryAction={{
                    label: "COBA NOMOR LAIN",
                    onClick: () => setIsDuplicateError(false)
                }}
                secondaryAction={{
                    label: "Batalkan",
                    onClick: () => window.location.reload()
                }}
            />
        </div >
    );
}
