'use client';

import { useSession } from 'next-auth/react';
import { 
    Users, 
    CalendarPlus, 
    DollarSign, 
    Zap, 
    Activity, 
    Dumbbell, 
    Swords, 
    QrCode,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function HostDashboard() {
  const { data: session } = useSession();

  const stats = {
      activeEvents: 3,
      totalParticipants: 48,
      revenueToday: "Rp 1.250.000",
      occupancyRate: 85
  };

  const upcomingEvents = [
      { id: 1, title: "Mabar Senin Ceria", type: "Mabar", time: "19:00", quota: "12/12", status: "Full" },
      { id: 2, title: "Private Coaching", type: "Drilling", time: "16:00", quota: "1/4", status: "Open" },
  ];

  return (
    <div className="space-y-8 pb-20">
        
        {/* 1. HOST HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ca1f3d]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#ca1f3d]/20 transition-all duration-500"></div>

            <div className="flex items-center gap-5 relative z-10">
                <Avatar className="w-20 h-20 border-4 border-[#1A1A1A] shadow-xl">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-[#ca1f3d] text-white font-black text-2xl">
                        {session?.user?.name?.charAt(0) || "H"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                        {session?.user?.name || 'Host'}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[#ffbe00] border-[#ffbe00]/30 bg-[#ffbe00]/10 text-[10px] uppercase tracking-widest font-bold">
                            Official Host
                        </Badge>
                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#ca1f3d]"/> GOR Wartawan
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto relative z-10">
                <Link href="/host/scan" className="flex-1 md:flex-none">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 text-gray-400 font-bold hover:text-[#ffbe00] hover:border-[#ffbe00]/50">
                        <QrCode className="w-4 h-4 mr-2" /> Scan
                    </Button>
                </Link>
                <Link href="/host/events/create" className="flex-1 md:flex-none">
                    <Button className="w-full h-12 px-8 rounded-xl bg-[#ca1f3d] text-white hover:bg-[#a01830] font-black shadow-[0_0_20px_rgba(202,31,61,0.4)] hover:scale-105 transition-transform">
                        <CalendarPlus className="w-4 h-4 mr-2" /> BUAT EVENT
                    </Button>
                </Link>
            </div>
        </header>

        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard 
                icon={Users} 
                label="Total Peserta" 
                value={stats.totalParticipants} 
                sub="+12 hari ini" 
                color="text-[#ca1f3d]" 
                bg="bg-[#ca1f3d]" 
            />
            <StatsCard 
                icon={DollarSign} 
                label="Pendapatan" 
                value={stats.revenueToday} 
                sub="Target: Rp 2jt" 
                color="text-[#ffbe00]" 
                bg="bg-[#ffbe00]" 
            />
            <StatsCard 
                icon={Activity} 
                label="Occupancy Rate" 
                value={`${stats.occupancyRate}%`} 
                sub="High Traffic" 
                color="text-white" 
                bg="bg-gray-600" 
            />
             <StatsCard 
                icon={Zap} 
                label="Active Events" 
                value={stats.activeEvents} 
                sub="Running Now" 
                color="text-[#ffbe00]" 
                bg="bg-[#ffbe00]" 
            />
        </div>

        {/* 3. MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Quick Actions */}
            <div className="lg:col-span-8 space-y-6">
                <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-[#ffbe00]" /> QUICK CREATE
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CreateCard title="Mabar" icon={Users} desc="Sesi main bareng publik" href="/host/events/create?type=mabar" theme="red" />
                        <CreateCard title="Drilling" icon={Dumbbell} desc="Kelas latihan/Coaching" href="/host/events/create?type=drilling" theme="yellow" />
                        <CreateCard title="Sparring" icon={Swords} desc="Slot tantangan squad" href="/host/events/create?type=sparring" theme="dark" />
                    </div>
                </div>

                {/* Live Events */}
                <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-6">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-white">TODAY'S SCHEDULE</h3>
                        <Link href="/host/events" className="text-xs font-bold text-gray-500 hover:text-[#ffbe00]">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[#ca1f3d]/30 transition group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${event.type === 'Mabar' ? 'bg-[#ca1f3d]/10 text-[#ca1f3d]' : 'bg-[#ffbe00]/10 text-[#ffbe00]'}`}>
                                        {event.type === 'Mabar' ? <Users className="w-5 h-5"/> : <Dumbbell className="w-5 h-5"/>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{event.title}</h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                            <span className="bg-white/10 px-1.5 rounded text-[10px]">{event.type}</span>
                                            {event.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="secondary" className={`text-[10px] uppercase font-bold mb-1 ${event.status === 'Full' ? 'bg-red-500/10 text-red-500' : 'bg-[#ffbe00]/10 text-[#ffbe00]'}`}>
                                        {event.status}
                                    </Badge>
                                    <p className="text-xs font-mono text-gray-400">{event.quota}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Revenue */}
            <div className="lg:col-span-4 space-y-6">
                 <Card className="bg-gradient-to-b from-[#1A1A1A] to-black border-white/10 rounded-[2.5rem] p-6 h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]"></div>
                    <h3 className="text-lg font-black text-white mb-6">FINANCIAL INSIGHT</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Weekly Goal</p>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-black text-white">65%</span>
                                <span className="text-xs text-gray-400 mb-1">achieved</span>
                            </div>
                            <Progress value={65} className="h-2 bg-[#222]" indicatorClassName="bg-[#ca1f3d]" />
                        </div>

                         <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs text-gray-400">Mabar Income</span>
                                <span className="text-xs font-bold text-[#ffbe00]">+12%</span>
                            </div>
                            <p className="font-mono text-white">Rp 4.200.000</p>
                        </div>
                        
                         <Button className="w-full bg-white/5 text-white hover:bg-[#ffbe00] hover:text-black font-bold rounded-xl border border-white/10 transition-colors">
                            Withdraw Funds
                        </Button>
                    </div>
                 </Card>
            </div>
        </div>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, sub, color, bg }: any) {
    return (
        <Card className="bg-[#151515] border-white/5 p-5 rounded-[2rem] hover:bg-[#1A1A1A] transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bg}/10 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {sub && <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-2 py-1 rounded-full">{sub}</span>}
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{value}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">{label}</p>
        </Card>
    )
}

function CreateCard({ title, icon: Icon, desc, href, theme }: any) {
    const themeClasses: any = {
        red: "hover:bg-[#ca1f3d] hover:border-[#ca1f3d] group-hover:text-white",
        yellow: "hover:bg-[#ffbe00] hover:border-[#ffbe00] group-hover:text-black",
        dark: "hover:bg-white hover:border-white group-hover:text-black",
    };
    
    const iconColor = theme === 'red' ? 'text-[#ca1f3d]' : theme === 'yellow' ? 'text-[#ffbe00]' : 'text-white';

    return (
        <Link href={href} className="group">
            <Card className={`bg-[#151515] border-white/5 p-6 rounded-[2rem] h-full transition-all duration-300 ${themeClasses[theme]} hover:-translate-y-1 relative overflow-hidden`}>
                <div className="relative z-10 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-2xl bg-[#0a0a0a] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg group-hover:bg-white/20`}>
                        <Icon className={`w-6 h-6 ${iconColor} group-hover:text-white`} />
                    </div>
                    <h4 className="text-white font-black group-hover:text-inherit">{title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 group-hover:text-inherit opacity-80">{desc}</p>
                </div>
            </Card>
        </Link>
    )
}
