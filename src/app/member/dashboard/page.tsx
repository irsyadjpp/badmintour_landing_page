'use client';

import { useSession } from 'next-auth/react';
import { 
    Trophy, 
    CalendarDays, 
    Clock, 
    MapPin, 
    QrCode, 
    ArrowRight, 
    TrendingUp, 
    Activity,
    User,
    LogOut,
    Ticket,
    Zap,
    Crown,
    Swords
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';

export default function MemberDashboard() {
  const { data: session } = useSession();

  // --- MOCK DATA ---
  // Idealnya data ini diambil dari API/Firestore
  const activeTicket = {
    id: "TIC-8821",
    event: "Mabar Senin Malam: Competitive",
    date: "02 Jan 2026",
    time: "19:00 - 22:00",
    location: "GOR Wartawan",
    court: "Court 3",
    status: "Confirmed"
  };

  const playerStats = {
    rank: "Intermediate B",
    matches: 42,
    winRate: 68,
    points: 1250,
    nextRank: 1500, // Target poin untuk naik rank
    streak: 3 // Kemenangan beruntun
  };

  const recentMatches = [
    { id: 1, opponent: "Tim Gacor", date: "24 Dec", result: "WIN", score: "30-28" },
    { id: 2, opponent: "PB Santuy", date: "22 Dec", result: "LOSE", score: "21-25" },
    { id: 3, opponent: "Badminton Kuy", date: "20 Dec", result: "WIN", score: "30-15" },
  ];

  return (
    <div className="space-y-8 pb-10">
        
        {/* 1. HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex items-center gap-5 relative z-10">
                <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-[#1A1A1A] shadow-xl">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-[#ffbe00] text-black font-black text-2xl">
                            {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-[#ffbe00] text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-[#151515]">
                        LVL 12
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                        Hi, {session?.user?.name?.split(' ')[0] || 'Baller'}!
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[#ffbe00] border-[#ffbe00]/30 bg-[#ffbe00]/10 text-[10px] uppercase tracking-widest font-bold">
                            Member Access
                        </Badge>
                        <span className="text-xs text-gray-500 font-mono">ID: {session?.user?.id?.slice(0,6).toUpperCase() || '---'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto relative z-10">
                <Link href="/" className="flex-1 md:flex-none">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 text-gray-400 font-bold">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                </Link>
                <Link href="/booking" className="flex-1 md:flex-none">
                    <Button className="w-full h-12 rounded-xl bg-[#ffbe00] text-black hover:bg-yellow-400 font-black shadow-[0_0_20px_rgba(255,190,0,0.4)] hover:scale-105 transition-transform">
                        <CalendarDays className="w-4 h-4 mr-2" /> BOOK COURT
                    </Button>
                </Link>
            </div>
        </header>

        {/* 2. BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* A. ACTIVE TICKET (Boarding Pass Style) */}
                <div className="relative group">
                    <div className="flex items-center justify-between mb-3 px-2">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-[#ffbe00]" /> YOUR TICKET
                        </h3>
                        <Link href="/member/tickets" className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                            View History <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0f0f0f] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col md:flex-row relative shadow-2xl transition-all duration-300 hover:border-[#ffbe00]/20">
                        {/* Status Strip */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffbe00] to-orange-500"></div>

                        {/* Left: Info */}
                        <div className="p-8 flex-1 relative z-10 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-2 mb-4">
                                    <Badge className="bg-green-500/10 text-green-500 border-0 text-[10px] uppercase font-bold px-3 py-1 animate-pulse">
                                        ● CONFIRMED
                                    </Badge>
                                    <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px] uppercase font-bold px-3 py-1">
                                        {activeTicket.court}
                                    </Badge>
                                </div>
                                
                                <h2 className="text-2xl md:text-4xl font-black text-white mb-2 leading-[0.9] tracking-tight">
                                    {activeTicket.event}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">Scan QR di meja registrasi 15 menit sebelum main.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Date</p>
                                    <p className="text-xl font-black text-white font-jersey">{activeTicket.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
                                    <p className="text-xl font-black text-white font-jersey">{activeTicket.time}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Venue</p>
                                    <p className="text-base font-bold text-white">{activeTicket.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Code (Ticket Stub) */}
                        <div className="relative p-8 bg-white text-black flex flex-col items-center justify-center md:w-72 md:border-l-2 md:border-dashed md:border-gray-300">
                             {/* Cutout Circles */}
                            <div className="absolute -top-4 md:top-auto md:-top-3 md:-left-3 left-1/2 -translate-x-1/2 md:translate-x-0 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>
                            <div className="absolute -bottom-4 md:bottom-auto md:-bottom-3 md:-left-3 left-1/2 -translate-x-1/2 md:translate-x-0 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>

                            <div className="bg-black p-2 rounded-xl mb-4">
                                <QrCode className="w-32 h-32 text-white" />
                            </div>
                            <p className="text-[10px] font-mono text-center uppercase tracking-widest opacity-60">Entry Pass</p>
                            <p className="text-xl font-black font-mono mt-1 tracking-widest">{activeTicket.id}</p>
                        </div>
                    </div>
                </div>

                {/* B. STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rank Card */}
                    <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-[#1A1A1A] transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Crown className="w-32 h-32 text-[#ffbe00]" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="w-5 h-5 text-[#ffbe00]" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Skill Rank</span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2">{playerStats.rank}</h3>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-[#ffbe00]">{playerStats.points} XP</span>
                                    <span className="text-gray-600">Next: {playerStats.nextRank}</span>
                                </div>
                                <Progress value={(playerStats.points / playerStats.nextRank) * 100} className="h-2 bg-[#222]" indicatorClassName="bg-[#ffbe00]" />
                                <p className="text-[10px] text-gray-500 mt-2">Menangkan 3 match lagi untuk naik ke Intermediate A.</p>
                            </div>
                        </div>
                    </Card>

                    {/* Performance Card */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-5 flex flex-col justify-between group hover:border-[#ffbe00]/20 transition-colors">
                            <div className="p-2 bg-green-500/10 w-fit rounded-lg text-green-500 mb-2">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">{playerStats.winRate}%</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Win Rate</p>
                            </div>
                        </Card>
                        <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-5 flex flex-col justify-between group hover:border-[#ffbe00]/20 transition-colors">
                            <div className="p-2 bg-blue-500/10 w-fit rounded-lg text-blue-500 mb-2">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">{playerStats.streak}x</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Win Streak</p>
                            </div>
                        </Card>
                        <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-5 flex flex-col justify-between col-span-2 group hover:border-[#ffbe00]/20 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-purple-500/10 w-fit rounded-lg text-purple-500 mb-2">
                                    <Swords className="w-5 h-5" />
                                </div>
                                <span className="text-2xl font-black text-white">{playerStats.matches}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Matches Played</p>
                        </Card>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* MATCH HISTORY */}
                <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] h-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" /> Recent Matches
                        </CardTitle>
                        <CardDescription>Performa kamu minggu ini.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentMatches.map((match) => (
                            <div key={match.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition group cursor-pointer">
                                <div>
                                    <p className="font-bold text-white text-sm">vs {match.opponent}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{match.date} • Score {match.score}</p>
                                </div>
                                <Badge variant="secondary" className={`text-[10px] font-black uppercase tracking-wider ${match.result === 'LOSE' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {match.result}
                                </Badge>
                            </div>
                        ))}
                        
                        {recentMatches.length === 0 && (
                            <div className="text-center py-8 text-gray-600 text-xs">
                                Belum ada pertandingan.
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost" className="w-full text-xs font-bold text-gray-500 hover:text-white rounded-xl">
                            Lihat Semua History
                        </Button>
                    </CardFooter>
                </Card>

                {/* PROFILE COMPLETION CTA */}
                <div className="bg-gradient-to-b from-[#1A1A1A] to-black border border-white/10 p-6 rounded-[2rem] text-center relative overflow-hidden">
                    <div className="w-16 h-16 bg-[#ffbe00]/10 text-[#ffbe00] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <User className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-white text-lg mb-1">Lengkapi Profil</h3>
                    <p className="text-xs text-gray-400 mb-6 px-4 leading-relaxed">
                        Tambahkan nomor WA dan ukuran Jersey untuk mendapatkan hadiah eksklusif akhir tahun.
                    </p>
                    <Button variant="outline" className="rounded-xl border-[#ffbe00] text-[#ffbe00] hover:bg-[#ffbe00] hover:text-black font-bold w-full h-12 transition-all">
                        Edit Profile
                    </Button>
                </div>

            </div>
        </div>
    </div>
  );
}

    