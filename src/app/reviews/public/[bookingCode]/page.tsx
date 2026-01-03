'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Star, CheckCircle, Flame, Trophy, ChevronLeft, Quote, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GuestReviewPage({ params }: { params: Promise<{ bookingCode: string }> }) {
    const { bookingCode } = use(params);
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!bookingCode) return;
        const verifyBooking = async () => {
            try {
                const res = await fetch(`/api/public/bookings/${bookingCode}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Booking not found");
                if (data.data.hasReviewed) setSubmitted(true);
                setBooking(data.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        verifyBooking();
    }, [bookingCode]);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({ title: "Rate First! ⭐", description: "Give us some stars.", variant: "destructive" });
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingCode,
                    bookingId: booking.id,
                    eventId: booking.eventId,
                    rating,
                    comment,
                    isAnonymous: false,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit");
            setSubmitted(true);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    // --- Loading & Error States ---
    if (loading) return <FullScreenLoader />;
    if (error) return <ErrorScreen error={error} router={router} />;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ffbe00] selection:text-black overflow-hidden relative">

            {/* 1. Dynamic Background / Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#ffbe00]/10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#ca1f3d]/10 blur-[150px] rounded-full"></div>
            </div>

            {/* 2. Floating Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="pointer-events-auto"
                >
                    <Button
                        onClick={() => router.push('/')}
                        className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-[#ffbe00] hover:text-black rounded-full h-12 px-6 gap-2 font-bold transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        BACK
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="hidden md:flex gap-2 items-center bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full"
                >
                    <div className="w-2 h-2 bg-[#ffbe00] rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Guest Mode</span>
                </motion.div>
            </nav>

            {/* 3. Main Content Content */}
            <main className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-screen py-24">
                <AnimatePresence mode='wait'>
                    {!submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-lg"
                        >
                            {/* Header Text */}
                            <div className="text-center mb-10">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 shadow-2xl"
                                >
                                    {booking?.coachName ? (
                                        <div className="w-12 h-12 rounded-xl bg-[#ffbe00] flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(255,190,0,0.4)]">
                                            {booking.coachName.charAt(0)}
                                        </div>
                                    ) : (
                                        <Trophy className="w-8 h-8 text-[#ffbe00]" />
                                    )}
                                </motion.div>

                                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 leading-none uppercase">
                                    MATCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ffd700]">REPORT</span>
                                </h1>
                                <p className="text-gray-400 text-lg font-medium">
                                    How was your session with <span className="text-white font-bold">{booking?.coachName || "Coach"}</span>?
                                </p>
                            </div>

                            {/* Card Container */}
                            <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 p-1 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="bg-[#0f0f0f] rounded-[2.2rem] p-8 md:p-10 relative z-10 border border-white/5">

                                    {/* Star Rating Interaction */}
                                    <div className="flex justify-center gap-2 mb-8 relative">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="relative p-1 focus:outline-none"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-12 h-12 transition-all duration-300",
                                                        star <= (hoverRating || rating)
                                                            ? "fill-[#ffbe00] text-[#ffbe00] drop-shadow-[0_0_15px_rgba(255,190,0,0.6)]"
                                                            : "text-gray-800 fill-gray-900/50"
                                                    )}
                                                    strokeWidth={1.5}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Dynamic Feedback Text */}
                                    <div className="h-8 text-center mb-8">
                                        <AnimatePresence mode="wait">
                                            <motion.p
                                                key={hoverRating || rating}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-[#ffbe00] font-black uppercase tracking-widest text-sm"
                                            >
                                                {getRatingText(hoverRating || rating)}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>

                                    {/* Comment Visual Input */}
                                    <div className="relative group/input mb-8">
                                        <div className="absolute top-4 left-4 text-gray-600">
                                            <Quote className="w-5 h-5 opacity-50" />
                                        </div>
                                        <Textarea
                                            placeholder="Drop your thoughts here..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="bg-[#1a1a1a] border-transparent rounded-2xl pl-12 pt-4 min-h-[140px] text-lg text-white placeholder:text-gray-600 focus:bg-[#202020] focus:ring-2 focus:ring-[#ffbe00]/50 transition-all resize-none shadow-inner"
                                        />
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting || rating === 0}
                                        className="w-full h-16 bg-[#ffbe00] hover:bg-[#ffac00] text-black font-black text-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,190,0,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                                    >
                                        {submitting ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-6 h-6 animate-spin" /> POSTING...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                SUBMIT REVIEW <Send className="w-5 h-5" />
                                            </div>
                                        )}
                                    </Button>

                                </div>
                            </div>

                            {/* Footer Badge */}
                            <div className="mt-8 text-center flex justify-center">
                                <BadgeBookingCode code={bookingCode} />
                            </div>

                        </motion.div>
                    ) : (
                        <SuccessView booking={booking} router={router} />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

// --- Sub Components ---

function FullScreenLoader() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#1a1a1a] border-t-[#ffbe00] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[#ffbe00] animate-pulse" />
                </div>
            </div>
        </div>
    );
}

function ErrorScreen({ error, router }: { error: string, router: any }) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
                <h1 className="text-8xl md:text-9xl font-black text-[#1a1a1a] relative z-10 select-none">403</h1>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="bg-red-500 text-black font-bold px-3 py-1 rounded-full text-sm uppercase transform -rotate-6">Access Denied</span>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 max-w-md">{error}</h2>
            <p className="text-gray-500 mb-8">We couldn't verify your booking code. Check it carefully.</p>
            <Button onClick={() => router.push('/')} variant="outline" className="border-white/10 hover:bg-white/10 text-white rounded-full">
                Back to Home
            </Button>
        </div>
    )
}

function SuccessView({ booking, router }: { booking: any, router: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full max-w-md relative"
        >
            {/* Confetti / Burst Effect (CSS based simpler than canvas) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-[#ffbe00]/20 to-[#ca1f3d]/20 blur-[80px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ y: 20, rotate: -5 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-block mb-8"
            >
                <div className="w-28 h-28 bg-[#ffbe00] rounded-[2rem] flex items-center justify-center shadow-xl transform rotate-6 mx-auto border-4 border-[#050505]">
                    <CheckCircle className="w-14 h-14 text-black" strokeWidth={3} />
                </div>
            </motion.div>

            <h1 className="text-4xl font-black italic uppercase mb-2">Review Submitted!</h1>
            <p className="text-gray-400 text-lg mb-8">Thanks for the feedback, Legend.</p>

            <Card className="bg-[#121212] border-white/10 p-4 rounded-2xl flex items-center gap-4 mb-8 text-left hover:border-[#ffbe00]/30 transition-colors cursor-default">
                <div className="w-12 h-12 rounded-xl bg-[#202020] flex items-center justify-center text-lg font-bold text-gray-500">
                    {booking?.coachName ? booking.coachName.charAt(0) : "S"}
                </div>
                <div>
                    <h3 className="font-bold text-white leading-tight">{booking?.eventTitle}</h3>
                    <p className="text-xs text-gray-500">{new Date(booking.eventDate).toLocaleDateString()}</p>
                </div>
            </Card>

            <Button onClick={() => router.push('/')} className="w-full bg-white text-black font-bold h-14 rounded-xl hover:bg-gray-200 transition-colors">
                Back to Dashboard
            </Button>
        </motion.div>
    )
}

function BadgeBookingCode({ code }: { code: string }) {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-white/5 text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-copy">
            <div className="w-2 h-2 rounded-full bg-[#ffbe00] animate-pulse"></div>
            CODE: <span className="text-white font-bold tracking-widest">{code}</span>
        </div>
    )
}

function getRatingText(rating: number) {
    if (rating === 0) return "TAP TO RATE";
    if (rating === 1) return "OOF... BAD DAY? 💀";
    if (rating === 2) return "NOT GREAT, NOT TERRIBLE 😐";
    if (rating === 3) return "SOLID SESSION 👊";
    if (rating === 4) return "FIRE! ALMOST PERFECT 🔥";
    if (rating === 5) return "ABSOLUTE G.O.A.T! 🐐👑";
    return "";
}
