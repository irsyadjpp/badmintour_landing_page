'use client';

import { Search, Star, MapPin, ChevronRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const coaches = [
    { id: 1, name: "Coach Hendra", exp: "10 Tahun", rate: "Rp 150k/jam", rating: 5.0, specialty: "Double Strategy", location: "GOR C-Tra" },
    { id: 2, name: "Coach Susy", exp: "Former Athlete", rate: "Rp 200k/jam", rating: 4.9, specialty: "Basic Footwork", location: "GOR Lodaya" },
];

export default function FindCoachPage() {
    return (
        <div className="space-y-8 pb-20">
            {/* Hero Search */}
            <div className="bg-[#151515] rounded-[3rem] p-8 md:p-12 text-center border border-white/5 relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00f2ea] to-[#ff0099] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic mb-4">
                    Level Up <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ea] to-[#ff0099]">Your Game</span>
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
                    Temukan pelatih profesional untuk meningkatkan skill badmintonmu. Dari basic footwork hingga strategi ganda.
                </p>
                
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input placeholder="Cari pelatih, lokasi, atau spesialisasi..." className="h-14 pl-12 rounded-full bg-black/50 border-white/10 text-white focus:border-[#00f2ea] text-lg" />
                </div>
            </div>

            {/* Coach List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach) => (
                    <Card key={coach.id} className="bg-[#1A1A1A] border-white/5 p-6 rounded-[2.5rem] hover:border-[#00f2ea]/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ea]/5 rounded-full blur-[40px] group-hover:bg-[#00f2ea]/10 transition"></div>
                        
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex gap-4">
                                <Avatar className="w-16 h-16 border-2 border-[#1A1A1A] shadow-lg">
                                    <AvatarFallback className="bg-[#222] text-white font-bold">{coach.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{coach.name}</h3>
                                    <div className="flex items-center gap-1 text-[#ffbe00] text-xs font-bold mt-1">
                                        <Star className="w-3 h-3 fill-current" /> {coach.rating}
                                    </div>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px] uppercase tracking-wider">{coach.exp}</Badge>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-[#00f2ea]" /> {coach.location}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-[#00f2ea]/10 text-[#00f2ea] border-0 hover:bg-[#00f2ea]/20">{coach.specialty}</Badge>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-lg font-black text-white">{coach.rate}</span>
                            <Button className="rounded-xl bg-white text-black font-bold hover:bg-gray-200 group-hover:scale-105 transition-transform">
                                Book Now <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </Card>
                ))}

                 {/* Join as Coach Card */}
                <Link href="/member/coaching/register" className="group">
                    <div className="bg-[#1A1A1A] border-2 border-dashed border-white/10 h-full rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-[#00f2ea] hover:bg-[#00f2ea]/5 transition-all">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10 mb-6 group-hover:scale-110 transition-transform">
                            <UserPlus className="w-10 h-10 text-[#00f2ea]" />
                        </div>
                        <h3 className="text-xl font-black text-white text-center">Become A Coach</h3>
                        <p className="text-sm text-gray-500 mt-2 text-center">Share your skills and earn extra income.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
