'use client';

import { Search, Star, MapPin, ChevronRight, UserPlus, Dumbbell, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

export default function FindCoachPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Real Coaches from API
    const { data: coaches = [], isLoading } = useQuery({
        queryKey: ['coaches'],
        queryFn: async () => {
            const res = await fetch('/api/coaches');
            const data = await res.json();
            return data.data || [];
        }
    });

    const filteredCoaches = coaches.filter((coach: any) =>
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coach.nickname && coach.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleWhatsApp = (coachName: string) => {
        const message = `Halo Coach ${coachName}, saya ingin tanya jadwal private coaching di BadminTour.`;
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center">
                <Loader2 className="animate-spin w-10 h-10 text-[#ffbe00] mb-4" />
                <p className="font-mono text-[#ffbe00]">LOADING COACH DATA...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">

            {/* STANDARD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#ffbe00]/10 flex items-center justify-center border border-[#ffbe00]/20">
                        <GraduationCap className="w-8 h-8 text-[#ffbe00]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            FIND A <span className="text-[#ffbe00]">COACH</span>
                        </h1>
                        <p className="text-gray-400 mt-1 max-w-xl text-sm">
                            Latihan private intensif dengan pelatih terbaik kami.
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Cari Coach..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-[#1A1A1A] border-white/10 rounded-xl text-white focus:border-[#ffbe00]"
                    />
                </div>
            </div>

            {/* COACH GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">

                {/* Join Block */}
                <Link href="/member/coaching/register" className="group h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1A1A1A] border-2 border-dashed border-white/10 h-full rounded-[2rem] flex flex-col items-center justify-center p-8 hover:border-[#00f2ea] hover:bg-[#00f2ea]/5 transition-all text-center min-h-[300px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10 mb-4 group-hover:scale-110 transition-transform">
                            <UserPlus className="w-8 h-8 text-[#ffbe00]" />
                        </div>
                        <h3 className="text-xl font-black text-white">Join as Coach</h3>
                        <p className="text-xs text-gray-500 mt-2">Daftar jadi pelatih & buka kelas.</p>
                    </motion.div>
                </Link>

                {filteredCoaches.map((coach: any, index: number) => (
                    <motion.div
                        key={coach.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] h-full relative overflow-hidden group hover:border-[#ffbe00]/50 transition-all hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffbe00]/5 rounded-full blur-[40px] group-hover:bg-[#ffbe00]/10 transition"></div>

                            <div className="flex gap-4 mb-6 relative z-10">
                                <Avatar className="w-16 h-16 border-2 border-[#1A1A1A] shadow-lg">
                                    <AvatarImage src={`https://placehold.co/100x100/1e1e1e/FFF?text=${(coach.nickname || coach.name).charAt(0)}`} />
                                    <AvatarFallback className="bg-[#222] text-white font-bold">{(coach.nickname || coach.name).charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-black text-white line-clamp-1">{coach.nickname || coach.name}</h3>
                                    <div className="flex items-center gap-1 text-[#ffbe00] text-xs font-bold mt-1">
                                        <Star className="w-3 h-3 fill-current" /> 5.0 <span className="text-gray-600 font-normal ml-1">• Coach</span>
                                    </div>
                                    <Badge variant="outline" className="mt-2 border-white/10 text-gray-400 text-[10px] uppercase tracking-wider bg-white/5">
                                        Badminton Pro
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 relative z-10">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <MapPin className="w-4 h-4 text-[#ffbe00]" /> GOR BadminTour
                                </div>
                                <div className="text-xs text-gray-500 line-clamp-2">
                                    Specialist in Single & Double Strategy. Former National Athlete.
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Rate / Session</span>
                                    <span className="text-sm font-black text-white">Rp 150.000</span>
                                </div>
                                <Button
                                    onClick={() => handleWhatsApp(coach.nickname || coach.name)}
                                    className="rounded-xl bg-[#ffbe00] text-black font-bold hover:bg-[#e6ac00] shadow-[0_0_15px_rgba(255,190,0,0.3)]"
                                >
                                    Chat Coach <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
