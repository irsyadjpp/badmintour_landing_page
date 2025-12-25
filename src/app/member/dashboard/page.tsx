'use client';

import { useSession } from 'next-auth/react';
import { 
    Trophy, 
    CalendarDays, 
    Clock, 
    MapPin, 
    QrCode, 
    ArrowRight, 
    Ticket,
    Swords,
    Dumbbell,
    UserCog,
    Users,
    Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';

export default function MemberDashboard() {
  const { data: session } = useSession();

  // Mock Active Ticket
  const activeTicket = {
    id: "MABAR-001",
    event: "Mabar Ceria: Level Intermediate",
    date: "02 Jan 2026",
    time: "20:00 - 23:00",
    location: "GOR Wartawan",
    court: "Court 1 & 2",
    status: "Confirmed"
  };

  return (
    <div className="space-y-8 pb-20">
        
        {/* 1. HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex items-center gap-5 relative z-10">
                <Avatar className="w-20 h-20 border-4 border-[#1A1A1A] shadow-xl">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-[#ffbe00] text-black font-black text-2xl">
                        {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                        Hi, {session?.user?.name?.split(' ')[0] || 'Athlete'}!
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[#ffbe00] border-[#ffbe00]/30 bg-[#ffbe00]/10 text-[10px] uppercase tracking-widest font-bold">
                            Member
                        </Badge>
                        <span className="text-xs text-gray-500 font-mono">ID: {session?.user?.id?.slice(0,6).toUpperCase() || '---'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto relative z-10">
                <Link href="/member/profile" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto h-12 px-8 rounded-xl bg-[#ffbe00] text-black hover:bg-yellow-400 font-black shadow-[0_0_20px_rgba(255,190,0,0.4)] hover:scale-105 transition-transform">
                        <UserCog className="w-4 h-4 mr-2" /> LENGKAPI PROFILE
                    </Button>
                </Link>
            </div>
        </header>

        {/* 2. GAME MODE SELECTION (REPLACING BOOKING) */}
        <section>
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-[#ffbe00]" /> CHOOSE YOUR GAME
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Mabar */}
                <Link href="/member/mabar" className="group">
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] h-full relative overflow-hidden transition-all duration-300 group-hover:bg-[#1A1A1A] group-hover:border-[#ffbe00]/50 group-hover:-translate-y-1">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="w-24 h-24 text-blue-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black text-white mb-1">Mabar</h4>
                            <p className="text-xs text-gray-400">Gabung sesi main bareng komunitas. Perorangan welcome.</p>
                        </div>
                    </Card>
                </Link>

                {/* Card 2: Sparring */}
                <Link href="/member/mabar?type=sparring" className="group">
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] h-full relative overflow-hidden transition-all duration-300 group-hover:bg-[#1A1A1A] group-hover:border-[#ffbe00]/50 group-hover:-translate-y-1">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Swords className="w-24 h-24 text-red-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <Swords className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black text-white mb-1">Sparring</h4>
                            <p className="text-xs text-gray-400">Tantang komunitas lain. Khusus untuk Tim/Squad.</p>
                        </div>
                    </Card>
                </Link>

                {/* Card 3: Drilling/Coaching */}
                <Link href="/member/drilling" className="group">
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] h-full relative overflow-hidden transition-all duration-300 group-hover:bg-[#1A1A1A] group-hover:border-[#ffbe00]/50 group-hover:-translate-y-1">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Dumbbell className="w-24 h-24 text-green-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black text-white mb-1">Drilling</h4>
                            <p className="text-xs text-gray-400">Latihan intensif dengan pelatih atau robot.</p>
                        </div>
                    </Card>
                </Link>

                {/* Card 4: Tournament */}
                <Link href="/member/tournaments" className="group">
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] h-full relative overflow-hidden transition-all duration-300 group-hover:bg-[#1A1A1A] group-hover:border-[#ffbe00]/50 group-hover:-translate-y-1">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Trophy className="w-24 h-24 text-[#ffbe00]" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-[#ffbe00]/10 text-[#ffbe00] flex items-center justify-center mb-4 group-hover:bg-[#ffbe00] group-hover:text-black transition-colors">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black text-white mb-1">Turnamen</h4>
                            <p className="text-xs text-gray-400">Daftar kompetisi resmi dan menangkan hadiah.</p>
                        </div>
                    </Card>
                </Link>
            </div>
        </section>

        {/* 3. ACTIVE TICKET (BIG CARD) */}
        <section>
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[#ffbe00]" /> UPCOMING SESSION
                </h3>
            </div>
            
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0f0f0f] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col md:flex-row relative shadow-2xl group">
                {/* Status Strip */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffbe00] to-orange-500"></div>

                <div className="p-8 flex-1 relative z-10 flex flex-col justify-between">
                    <div>
                        <div className="flex gap-2 mb-4">
                            <Badge className="bg-green-500/10 text-green-500 border-0 text-[10px] uppercase font-bold px-3 py-1 animate-pulse">
                                ● READY
                            </Badge>
                            <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px] uppercase font-bold px-3 py-1">
                                {activeTicket.court}
                            </Badge>
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                            {activeTicket.event}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">Slot Mabar dikonfirmasi. Tunjukkan QR Code ini ke Host.</p>
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
                             <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</p>
                             <p className="text-base font-bold text-white">{activeTicket.location}</p>
                        </div>
                    </div>
                </div>

                {/* QR Section */}
                <div className="relative p-8 bg-white text-black flex flex-col items-center justify-center md:w-72 md:border-l-2 md:border-dashed md:border-gray-300">
                    <div className="absolute -top-4 md:top-auto md:-top-3 md:-left-3 left-1/2 -translate-x-1/2 md:translate-x-0 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>
                    <div className="absolute -bottom-4 md:bottom-auto md:-bottom-3 md:-left-3 left-1/2 -translate-x-1/2 md:translate-x-0 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>

                    <div className="bg-black p-2 rounded-xl mb-4">
                        <QrCode className="w-32 h-32 text-white" />
                    </div>
                    <p className="text-[10px] font-mono text-center uppercase tracking-widest opacity-60">Scan to Play</p>
                    <p className="text-xl font-black font-mono mt-1 tracking-widest">{activeTicket.id}</p>
                </div>
            </div>
        </section>

        {/* 4. TOURNAMENT TEASER (New Section) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-r from-[#1A1A1A] to-[#121212] rounded-[2rem] border border-white/5 p-6 flex items-center justify-between relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]"></div>
                 <div>
                    <Badge variant="destructive" className="mb-2 text-[10px] uppercase font-bold">Hot Event</Badge>
                    <h3 className="text-2xl font-black text-white">Bandung Open 2026</h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-md">Total Prize Pool Rp 50.000.000. Kategori Ganda Putra & Campuran.</p>
                 </div>
                 <Link href="/member/tournaments">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white hover:text-black font-bold rounded-xl h-12 px-6">
                        Detail <ArrowRight className="w-4 h-4 ml-2"/>
                    </Button>
                 </Link>
            </div>

            <div className="bg-[#1A1A1A] rounded-[2rem] border border-white/5 p-6 flex flex-col justify-center items-center text-center">
                 <Medal className="w-10 h-10 text-[#ffbe00] mb-3" />
                 <h4 className="font-black text-white text-lg">Achievement</h4>
                 <p className="text-xs text-gray-500">Main 5x lagi untuk unlock badge "Veteran".</p>
            </div>
        </section>

    </div>
  );
}
