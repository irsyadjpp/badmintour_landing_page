'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Clock, ArrowRight, Zap, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils'; // Pastikan import cn utility

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
                            const filled = event.registeredCount || 0;
                            const total = event.quota || 12;
                            const percent = (filled / total) * 100;
                            const isFull = filled >= total;

                            return (
                                <div key={event.id} className="group relative">
                                    <div className="relative flex flex-col md:flex-row items-center bg-card border rounded-[2rem] p-3 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                                        {/* Tanggal & Jam */}
                                        <div className="flex flex-col items-center justify-center p-4 rounded-[1.5rem] w-full md:w-36 shrink-0 md:h-32 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                            <span className="text-[10px] font-black tracking-widest uppercase mb-1">EVENT</span>
                                            <span className="text-xl font-black leading-none text-center">{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                            <div className="mt-2 px-2 py-1 bg-black/10 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {event.time}
                                            </div>
                                        </div>

                                        {/* Info Utama */}
                                        <div className="flex-1 p-6 flex flex-col justify-center w-full">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {event.isRecurring && <Badge variant="secondary" className="text-[10px]">Rutin</Badge>}
                                                <Badge variant="outline" className="text-[10px] uppercase">{event.level}</Badge>
                                            </div>

                                            <h3 className="text-2xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors">
                                                {event.title}
                                            </h3>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-primary" />
                                                    Slot: {filled} / {total}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tombol Aksi */}
                                        <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto p-4 md:p-6 md:border-l border-dashed border-border gap-4 min-w-[180px]">
                                            <div className="w-full">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                                                    <span>{isFull ? 'FULL' : 'AVAILABLE'}</span>
                                                    <span>{Math.round(percent)}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${isFull ? 'bg-zinc-500' : 'bg-primary'}`} style={{ width: `${percent}%` }}></div>
                                                </div>
                                            </div>

                                            <Link
                                                href={
                                                    isFull ? '#' :
                                                        !session ? `/events/${event.id}` : // JIKA GUEST -> ROUTE KE PUBLIC PAGE
                                                            event.type === 'drilling' ? `/member/drilling?id=${event.id}` :
                                                                event.type === 'tournament' ? `/member/tournament?id=${event.id}` :
                                                                    `/member/mabar?id=${event.id}`
                                                }
                                                className="w-full"
                                            >
                                                <Button
                                                    className={`w-full h-12 rounded-xl font-bold ${isFull ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-black text-white hover:bg-primary'}`}
                                                    disabled={isFull}
                                                >
                                                    {isFull ? 'FULL BOOKED' : (event.type === 'tournament' ? 'DAFTAR DETAIL' : 'JOIN SEKARANG')}
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
