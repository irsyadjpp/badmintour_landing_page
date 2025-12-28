'use client';

import { useSession } from 'next-auth/react';
import { 
    Dumbbell, 
    CalendarCheck, 
    Users, 
    Star, 
    TrendingUp, 
    Clock,
    MapPin,
    Trophy,
    ArrowRight,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function CoachDashboard() {
  const { data: session } = useSession();

  // Mock Data
  const stats = {
      activeStudents: 24,
      totalHours: 120,
      rating: 4.9,
      income: "Rp 3.500.000",
      monthlyGoal: 70 
  };

  const upcomingSessions = [
      { id: 1, student: "Budi Santoso", type: "Private Drill", time: "16:00 - 18:00", location: "GOR C-Tra", status: "Confirmed" },
      { id: 2, student: "PB Djarum Jr", type: "Group Class", time: "19:00 - 21:00", location: "GOR Lodaya", status: "Open Slot" },
  ];

  return (
    <div className="space-y-8 pb-20">
        
        {/* 1. HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2ea]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#00f2ea]/10 transition-all duration-500"></div>

            <div className="flex items-center gap-5 relative z-10">
                <Avatar className="w-20 h-20 border-4 border-[#1A1A1A] shadow-xl">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-[#00f2ea] text-black font-black text-2xl">
                        {session?.user?.name?.charAt(0) || "C"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                        Coach {session?.user?.name?.split(' ')[0] || 'Master'}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[#00f2ea] border-[#00f2ea]/30 bg-[#00f2ea]/10 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
                            Certified Pro
                        </Badge>
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1 font-bold">
                            <Star className="w-3 h-3 text-yellow-500 fill-current"/> {stats.rating} Rating
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto relative z-10">
                <Link href="/coach/schedule" className="flex-1 md:flex-none">
                    {/* BUTTON FIX: Contrast text */}
                    <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 bg-transparent text-white font-bold hover:bg-white hover:text-black transition-colors">
                        <CalendarCheck className="w-4 h-4 mr-2" /> Atur Jadwal
                    </Button>
                </Link>
                <Link href="/coach/students" className="flex-1 md:flex-none">
                    {/* BUTTON FIX: Cyan BG -> Black Text */}
                    <Button className="w-full h-12 px-8 rounded-xl bg-[#00f2ea] text-black hover:bg-[#00c2bb] font-black shadow-[0_0_20px_rgba(0,242,234,0.4)] hover:scale-105 transition-transform">
                        <Users className="w-4 h-4 mr-2" /> DATA MURID
                    </Button>
                </Link>
            </div>
        </header>

        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard 
                icon={Users} 
                label="Active Students" 
                value={stats.activeStudents} 
                sub="+2 new" 
                color="text-[#00f2ea]" 
                bg="bg-[#00f2ea]" 
            />
            <StatsCard 
                icon={Dumbbell} 
                label="Total Hours" 
                value={`${stats.totalHours}h`} 
                sub="This Month" 
                color="text-[#ff0099]" 
                bg="bg-[#ff0099]" 
            />
            <StatsCard 
                icon={TrendingUp} 
                label="Total Earnings" 
                value={stats.income} 
                sub="On Track" 
                color="text-[#ffbe00]" 
                bg="bg-[#ffbe00]" 
            />
             <StatsCard 
                icon={Trophy} 
                label="Reputation" 
                value="Elite" 
                sub="Top 5%" 
                color="text-purple-500" 
                bg="bg-purple-500" 
            />
        </div>

        {/* 3. MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Upcoming Sessions */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-[#151515] border border-white/10 rounded-[2rem] p-6">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#00f2ea]" /> UPCOMING SESSIONS
                        </h3>
                        <Link href="/coach/schedule" className="text-xs font-bold text-gray-400 hover:text-[#00f2ea] transition-colors">View Calendar</Link>
                    </div>

                    <div className="space-y-3">
                        {upcomingSessions.map((session) => (
                            <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[#00f2ea]/50 transition group relative overflow-hidden gap-4">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f2ea] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-[#00f2ea]/10 text-[#00f2ea] border border-[#00f2ea]/20">
                                        <Dumbbell className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{session.type}</h4>
                                        <div className="text-xs text-gray-400 flex items-center gap-3 mt-1 font-medium">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {session.time}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {session.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right w-full sm:w-auto pl-16 sm:pl-0">
                                    <p className="text-sm font-bold text-white mb-1">{session.student}</p>
                                    <Badge variant="secondary" className={`text-[10px] uppercase font-bold ${session.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'} border`}>
                                        {session.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem] hover:bg-[#1A1A1A] transition cursor-pointer group border hover:border-[#ff0099]/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#ff0099]/10 rounded-2xl flex items-center justify-center text-[#ff0099] border border-[#ff0099]/20 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold group-hover:text-[#ff0099] transition-colors">Create New Drill</h4>
                                <p className="text-xs text-gray-500">Buat modul latihan baru</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem] hover:bg-[#1A1A1A] transition cursor-pointer group border hover:border-[#ffbe00]/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#ffbe00]/10 rounded-2xl flex items-center justify-center text-[#ffbe00] border border-[#ffbe00]/20 group-hover:scale-110 transition-transform">
                                <Star className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold group-hover:text-[#ffbe00] transition-colors">Student Reviews</h4>
                                <p className="text-xs text-gray-500">Lihat feedback murid</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Right: Performance */}
            <div className="lg:col-span-4 space-y-6">
                 <Card className="bg-gradient-to-b from-[#1A1A1A] to-black border-white/10 rounded-[2.5rem] p-6 h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2ea] to-[#ff0099]"></div>
                    <h3 className="text-lg font-black text-white mb-6">PERFORMANCE</h3>
                    
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Monthly Goal</p>
                                <span className="text-xs font-bold text-[#00f2ea]">{stats.monthlyGoal}%</span>
                            </div>
                            <Progress value={stats.monthlyGoal} className="h-2 bg-[#222]" indicatorClassName="bg-gradient-to-r from-[#00f2ea] to-[#ff0099]" />
                            <p className="text-[10px] text-gray-500 mt-2">Target: 40 Jam Latihan / Bulan</p>
                        </div>

                         <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#00f2ea]/10 rounded-full blur-xl"></div>
                            <div className="flex justify-between mb-2 relative z-10">
                                <span className="text-xs text-gray-400 font-bold">Total Income</span>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-2xl font-mono font-bold text-white relative z-10">{stats.income}</p>
                            <p className="text-[10px] text-green-500 mt-1 relative z-10 font-bold">+Rp 500k dari bulan lalu</p>
                        </div>
                        
                        {/* BUTTON FIX: White Button -> Black Text (High Contrast) */}
                         <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-xl border-none h-12 shadow-lg">
                            View Finance Report <ArrowRight className="w-4 h-4 ml-2" />
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
        <Card className="bg-[#151515] border-white/10 p-5 rounded-[2rem] hover:bg-[#1A1A1A] transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bg}/10 ${color} border border-white/5`}>
                    <Icon className="w-5 h-5" />
                </div>
                {sub && <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/5">{sub}</span>}
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{value}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">{label}</p>
        </Card>
    )
}
