'use client';

import { useSession } from 'next-auth/react';
import { 
    Dumbbell, 
    CalendarCheck, 
    Users, 
    Star, 
    TrendingUp, 
    Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';

export default function CoachDashboard() {
  const { data: session } = useSession();

  // Mock Data
  const stats = {
      activeStudents: 24,
      totalSessions: 120,
      rating: 4.9,
      income: "Rp 3.500.000"
  };

  const upcomingSessions = [
      { id: 1, student: "Budi Santoso", type: "Private (1-on-1)", time: "16:00 - 18:00", status: "Confirmed" },
      { id: 2, student: "Group Pemula", type: "Group Class", time: "19:00 - 21:00", status: "Open Slot" },
  ];

  return (
    <div className="space-y-8 pb-20 p-6 md:p-12 max-w-7xl mx-auto">
        
        {/* HEADER: Glassmorphism & Sporty Gradient */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#151515] p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00f2ea] to-[#ff0099] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-6 relative z-10">
                <Avatar className="w-24 h-24 border-4 border-[#1A1A1A] shadow-2xl ring-2 ring-[#00f2ea]">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-[#00f2ea] text-black font-black text-3xl">C</AvatarFallback>
                </Avatar>
                <div>
                    <Badge variant="outline" className="mb-2 border-[#00f2ea] text-[#00f2ea] bg-[#00f2ea]/10 text-xs font-black uppercase tracking-widest px-3 py-1">
                        Professional Coach
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                        Coach <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ea] to-[#ff0099]">{session?.user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-gray-400 font-medium mt-1 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current"/> {stats.rating} Rating • {stats.totalSessions} Sessions Completed
                    </p>
                </div>
            </div>

            <div className="flex gap-4 relative z-10">
                 <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-gray-200 font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    <CalendarCheck className="w-5 h-5 mr-2" /> Set Schedule
                 </Button>
            </div>
        </header>

        {/* STATS GRID: Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} label="Active Students" value={stats.activeStudents} color="text-[#00f2ea]" bg="bg-[#00f2ea]/10" />
            <StatCard icon={Dumbbell} label="Total Hours" value="48h" color="text-[#ff0099]" bg="bg-[#ff0099]/10" />
            <StatCard icon={TrendingUp} label="This Month" value={stats.income} color="text-[#ffbe00]" bg="bg-[#ffbe00]/10" />
            <StatCard icon={Star} label="Reputation" value="Elite" color="text-purple-500" bg="bg-purple-500/10" />
        </div>

        {/* MAIN CONTENT: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Upcoming Sessions */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                        Upcoming <span className="text-gray-600">Sessions</span>
                    </h3>
                    <Link href="/coach/schedule" className="text-sm font-bold text-[#00f2ea] hover:underline">View Calendar</Link>
                </div>

                <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                        <div key={session.id} className="group flex items-center justify-between p-6 rounded-[2rem] bg-[#1A1A1A] border border-white/5 hover:border-[#00f2ea]/50 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00f2ea] to-[#ff0099] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-[#222] flex items-center justify-center text-white font-black text-xl border border-white/5">
                                    {session.time.split(':')[0]}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">{session.type}</h4>
                                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                                        <Users className="w-3 h-3"/> {session.student}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <Badge className={`mb-2 ${session.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} border-0 uppercase font-bold tracking-wider`}>
                                    {session.status}
                                </Badge>
                                <p className="text-xs font-mono text-gray-500">{session.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Tools */}
            <div className="space-y-6">
                 <Card className="bg-gradient-to-b from-[#1A1A1A] to-black border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2ea] to-[#ff0099]"></div>
                    <h3 className="text-xl font-black text-white mb-4">Coach Tools</h3>
                    
                    <div className="space-y-3">
                        <Button variant="ghost" className="w-full justify-start h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold">
                            <Dumbbell className="w-5 h-5 mr-3 text-[#00f2ea]" /> Create Training Plan
                        </Button>
                        <Button variant="ghost" className="w-full justify-start h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold">
                            <Users className="w-5 h-5 mr-3 text-[#ff0099]" /> Student Progress
                        </Button>
                        <Button variant="ghost" className="w-full justify-start h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold">
                            <Clock className="w-5 h-5 mr-3 text-[#ffbe00]" /> Availability Settings
                        </Button>
                    </div>
                 </Card>
            </div>

        </div>
    </div>
  );
}

// Helper Component
function StatCard({ icon: Icon, label, value, color, bg }: any) {
    return (
        <div className="bg-[#151515] p-6 rounded-[2.5rem] border border-white/5 hover:bg-[#1A1A1A] transition-all group">
            <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        </div>
    )
}
