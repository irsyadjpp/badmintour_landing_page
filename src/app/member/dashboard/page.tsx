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
    Ticket
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

  // Mock Data: Active Ticket
  const activeTicket = {
    id: "TIC-8821",
    event: "Mabar Senin Malam",
    date: "02 Jan 2026",
    time: "19:00 - 22:00",
    location: "GOR Wartawan",
    court: "Court 3",
    status: "Confirmed"
  };

  // Mock Data: Stats
  const playerStats = {
    rank: "Intermediate B",
    matches: 42,
    winRate: 68,
    points: 1250,
    nextRank: 1500
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. HEADER & GREETING */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-[#ffbe00] shadow-[0_0_20px_rgba(255,190,0,0.3)]">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-[#1A1A1A] text-[#ffbe00] font-black text-xl">
                        {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white">
                        Hi, {session?.user?.name?.split(' ')[0] || 'Baller'}! 👋
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[#ffbe00] border-[#ffbe00] bg-[#ffbe00]/10 text-[10px] uppercase tracking-widest font-bold">
                            Member
                        </Badge>
                        <span className="text-xs text-gray-500 font-medium">ID: #{session?.user?.id?.slice(0,6) || '---'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <Link href="/" className="flex-1 md:flex-none">
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-400">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                </Link>
                <Link href="/booking" className="flex-1 md:flex-none">
                    <Button className="w-full bg-[#ffbe00] text-black hover:bg-yellow-400 font-bold shadow-[0_0_20px_rgba(255,190,0,0.4)]">
                        <CalendarDays className="w-4 h-4 mr-2" /> Book Court
                    </Button>
                </Link>
            </div>
        </header>

        {/* 2. MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: STATS & TICKET (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* A. PLAYER STATS CARD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Rank Card */}
                    <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Trophy className="w-24 h-24 text-[#ffbe00]" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Rank</p>
                            <h3 className="text-2xl font-black text-white mb-4">{playerStats.rank}</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-[#ffbe00]">{playerStats.points} XP</span>
                                    <span className="text-gray-600">Target {playerStats.nextRank}</span>
                                </div>
                                <Progress value={(playerStats.points / playerStats.nextRank) * 100} className="h-2 bg-[#222]" indicatorClassName="bg-[#ffbe00]" />
                            </div>
                        </div>
                    </Card>

                    {/* Matches Card */}
                    <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Activity className="w-5 h-5" /></div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Matches</span>
                        </div>
                        <p className="text-4xl font-black text-white">{playerStats.matches}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Total games played</p>
                    </Card>

                    {/* Win Rate Card */}
                    <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Win Rate</span>
                        </div>
                        <p className="text-4xl font-black text-white">{playerStats.winRate}%</p>
                        <p className="text-[10px] text-gray-500 mt-1">Competitive performance</p>
                    </Card>
                </div>

                {/* B. ACTIVE TICKET (Digital Boarding Pass Style) */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-[#ffbe00]" /> Active Ticket
                        </h3>
                        <Link href="/member/tickets" className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="bg-gradient-to-r from-[#1A1A1A] to-[#151515] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col md:flex-row relative group">
                        {/* Left: Event Info */}
                        <div className="p-8 flex-1 relative z-10">
                            <div className="flex gap-2 mb-6">
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 text-[10px] uppercase font-bold px-3 py-1">
                                    {activeTicket.status}
                                </Badge>
                                <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px] uppercase font-bold px-3 py-1">
                                    {activeTicket.court}
                                </Badge>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-none">
                                {activeTicket.event}
                            </h2>
                            <p className="text-sm text-gray-400 mb-8 max-w-md">
                                Jangan lupa bawa raket dan air minum. Datang 15 menit sebelum jadwal.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Date</p>
                                    <p className="text-lg font-bold text-white">{activeTicket.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
                                    <p className="text-lg font-bold text-white">{activeTicket.time}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</p>
                                    <p className="text-lg font-bold text-white">{activeTicket.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Code (Perforated line visual) */}
                        <div className="relative p-8 bg-white text-black flex flex-col items-center justify-center md:w-64 md:border-l-2 md:border-dashed md:border-gray-300">
                             {/* Cutout Circles for Ticket effect */}
                            <div className="absolute -top-3 left-0 md:-left-3 md:top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>
                            <div className="absolute -bottom-3 left-0 md:-left-3 md:top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>

                            <QrCode className="w-32 h-32 mb-4" />
                            <p className="text-[10px] font-mono text-center uppercase tracking-widest opacity-60">Scan at Gate</p>
                            <p className="text-lg font-black font-mono mt-1 tracking-widest">{activeTicket.id}</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: HISTORY & NEWS (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* RECENT ACTIVITY */}
                <Card className="bg-[#151515] border-white/5 rounded-[2.5rem]">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-white">Match History</CardTitle>
                        <CardDescription>3 Permainan terakhir kamu.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5 group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-10 rounded-full ${i === 1 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    <div>
                                        <p className="font-bold text-white text-sm">vs Tim Gacor</p>
                                        <p className="text-[10px] text-gray-500">24 Dec • Ganda Putra</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className={`text-[10px] font-bold uppercase ${i === 1 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {i === 1 ? 'LOSE' : 'WIN'}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost" className="w-full text-xs font-bold text-gray-500 hover:text-white">View Full History</Button>
                    </CardFooter>
                </Card>

                {/* PROFILE COMPLETION */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-white/10 p-6 rounded-[2rem] text-center">
                    <div className="w-16 h-16 bg-[#ffbe00]/10 text-[#ffbe00] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <User className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-white text-lg mb-1">Lengkapi Profil</h3>
                    <p className="text-xs text-gray-400 mb-6 px-4">
                        Tambahkan nomor WA dan Jersey size untuk mendapatkan update turnamen.
                    </p>
                    <Button variant="outline" className="rounded-full border-[#ffbe00] text-[#ffbe00] hover:bg-[#ffbe00] hover:text-black font-bold w-full">
                        Edit Profile
                    </Button>
                </div>

            </div>
        </div>
      </div>
    </main>
  );
}
