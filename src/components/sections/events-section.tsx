'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Clock, ArrowRight, Zap, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils'; // Pastikan import cn utility
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function EventsSection() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'MABAR' | 'DRILLING'>('ALL'); // STATE FILTER
    const { data: session } = useSession();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events'); // Fetch dari API Database
                const data = await res.json();
                if (data.success) {
                    setEvents(data.data);
                }
            } catch (error) {
                console.error("Gagal ambil event", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // LOGIC FILTER
    const filteredEvents = events.filter(event => {
        if (filter === 'ALL') return true;
        // Asumsi di data event ada field 'type' atau deteksi dari judul
        // Jika belum ada field type, kita cek keyword di title
        const isDrilling = event.title?.toLowerCase().includes('drilling') || event.title?.toLowerCase().includes('coaching') || event.type === 'Drilling';

        if (filter === 'DRILLING') return isDrilling;
        if (filter === 'MABAR') return !isDrilling;
        return true;
    });

    return (
        <section id="schedule" className="w-full py-20 bg-background dark:bg-black/95 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">

                {/* Header Section dengan TOMBOL FILTER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-xs font-bold tracking-widest uppercase text-red-500">Live Schedule</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-3 leading-none">
                            Jadwal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Kegiatan</span>
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium">
                            Slot terbatas! Pilih jadwal dan amankan posisimu sekarang.
                        </p>
                    </div>

                    {/* FITUR FILTER BARU */}
                    <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", filter === 'ALL' ? "bg-white text-black" : "text-gray-500 hover:text-white")}
                        >
                            SEMUA
                        </button>
                        <button
                            onClick={() => setFilter('MABAR')}
                            className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", filter === 'MABAR' ? "bg-[#ffbe00] text-black" : "text-gray-500 hover:text-white")}
                        >
                            MABAR
                        </button>
                        <button
                            onClick={() => setFilter('DRILLING')}
                            className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", filter === 'DRILLING' ? "bg-[#00f2ea] text-black" : "text-gray-500 hover:text-white")}
                        >
                            DRILLING
                        </button>
                    </div>
                </div>

                {/* LIST EVENT (Gunakan filteredEvents) */}
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        // SKELETON LOADING
                        [1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-[2rem] bg-zinc-800" />)
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => {
                            const filled = event.bookedSlot || 0;
                            const total = event.quota || 12;
                            const percent = (filled / total) * 100;
                            const isFull = filled >= total;

                            return (
                                <div key={event.id} className="group relative">
                                    <div className="relative flex flex-col lg:flex-row bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#ffbe00]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:-translate-y-1">

                                        {/* LEFT: Date Block (Sporty Vertical) */}
                                        <div className="flex lg:flex-col items-center justify-center p-6 bg-[#1A1A1A] lg:w-32 shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 gap-2 lg:gap-0">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1 lg:mb-2 text-center w-full">DATE</span>
                                            <span className="text-4xl lg:text-5xl font-black text-white leading-none">
                                                {new Date(event.date).getDate()}
                                            </span>
                                            <span className="text-sm font-bold uppercase text-[#ffbe00] tracking-wider mt-1">
                                                {new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}
                                            </span>
                                            <div className="hidden lg:flex items-center gap-1 mt-4 text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                                                <Clock className="w-3 h-3" /> {event.time}
                                            </div>
                                        </div>

                                        {/* MIDDLE: Main Content */}
                                        <div className="flex-1 p-6 flex flex-col justify-center relative">

                                            {/* Badges & Meta */}
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <Badge className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider border-0 px-3 py-1",
                                                    event.type?.toLowerCase() === 'drilling' ? "bg-[#ca1f3d] text-white" :
                                                        event.type?.toLowerCase() === 'tournament' ? "bg-[#ca1f3d] text-white" :
                                                            event.type?.toLowerCase() === 'sparring' ? "bg-[#ca1f3d] text-white" :
                                                                "bg-[#ffbe00] text-black"
                                                )}>
                                                    {event.type || 'EVENT'}
                                                </Badge>

                                                {/* Coach / Host Info */}
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                    {event.type?.toLowerCase() === 'drilling' ?
                                                        `COACH: ${event.coachNickname || event.hostNickname || "PRO"}` :
                                                        `HOST: ${event.hostNickname || event.organizer || "ADMIN"}`
                                                    }
                                                </span>

                                                {/* Mobile Time (Visible only on small screens) */}
                                                <div className="lg:hidden flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-full ml-auto">
                                                    <Clock className="w-3 h-3" /> {event.time}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-2 group-hover:text-[#ffbe00] transition-colors">
                                                {event.title}
                                            </h3>

                                            {/* Location & Level */}
                                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-400 font-medium mb-3">
                                                <div className="flex items-center gap-1.5 text-white/80">
                                                    <MapPin className="w-4 h-4 text-[#ca1f3d]" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Zap className="w-4 h-4 text-[#ffbe00]" />
                                                    <span className="uppercase text-xs font-bold tracking-wider">{event.level || event.skillLevel || "All Level"}</span>
                                                </div>
                                            </div>

                                            {/* Participants Stack (Social Proof) */}
                                            {event.avatars && event.avatars.length > 0 && (
                                                <div className="flex items-center gap-3 mt-auto">
                                                    <div className="flex -space-x-3">
                                                        {event.avatars.slice(0, 4).map((img: string, idx: number) => (
                                                            <Avatar key={idx} className="w-8 h-8 border-2 border-[#151515]">
                                                                <AvatarImage src={img} className="object-cover" />
                                                                <AvatarFallback className="bg-[#1A1A1A] text-[10px] text-gray-400">P{idx + 1}</AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                        {filled > 4 && (
                                                            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border-2 border-[#151515] flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                                +{filled - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        <span className="text-white font-bold">{filled}</span> Ballers Joined
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* RIGHT: Action & Status */}
                                        <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center p-6 bg-[#1A1A1A]/50 border-t lg:border-t-0 lg:border-l border-white/5 lg:w-48 shrink-0 gap-4">

                                            {/* Slot Progress */}
                                            <div className="flex flex-col items-end lg:items-center w-full">
                                                <div className="flex items-center gap-1 mb-1.5">
                                                    <Users className="w-3 h-3 text-gray-500" />
                                                    <span className={cn("text-xs font-bold uppercase tracking-wider", isFull ? "text-red-500" : "text-green-500")}>
                                                        {isFull ? "FULL BOOKED" : `${total - filled} Slot Left`}
                                                    </span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all duration-1000", isFull ? "bg-zinc-600" : "bg-[#ffbe00]")}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right lg:text-center">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest line-through decoration-red-500/50">
                                                    {event.price > 100000 ? `Rp ${(event.price * 1.2).toLocaleString('id-ID')}` : ''}
                                                </p>
                                                <p className="text-lg font-black text-white">
                                                    {event.price === 0 ? 'FREE' : `Rp ${event.price.toLocaleString('id-ID')}`}
                                                </p>
                                            </div>

                                            {/* Button */}
                                            <Link
                                                href={!session ? `/events/${event.id}` :
                                                    event.type === 'drilling' ? `/member/drilling?id=${event.id}` :
                                                        event.type === 'tournament' ? `/member/tournament?id=${event.id}` :
                                                            `/member/mabar?id=${event.id}`}
                                                className="w-full"
                                            >
                                                <Button
                                                    className={cn(
                                                        "w-full h-10 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg transition-all hover:scale-105",
                                                        isFull
                                                            ? "bg-zinc-800 text-gray-400 hover:bg-zinc-700 cursor-not-allowed"
                                                            : "bg-white text-black hover:bg-[#ffbe00]"
                                                    )}
                                                >
                                                    {isFull ? 'WAITING LIST' : 'JOIN NOW'}
                                                </Button>
                                            </Link>

                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-[2rem]">
                            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">Tidak ada jadwal untuk kategori ini.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
