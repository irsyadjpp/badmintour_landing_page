'use client';

import { 
    Bell, 
    Wallet, 
    Users, 
    Ticket,
    Trophy,
    MapPin,
    CalendarClock,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Data Mock untuk Live Match Turnamen
const liveMatch = {
    tournament: "Bandung Open 2025",
    stage: "Semi Final",
    court: "Court 1",
    teamA: { name: "Kevin/Marcus", score: 19, set: 1 },
    teamB: { name: "Fajar/Rian", score: 20, set: 1 },
    isLive: true
};

// Data Mock untuk Sesi Mabar Aktif
const activeSession = {
    title: "Mabar Rutin - Selasa",
    location: "GOR Koni Bandung",
    time: "19:00 - 23:00",
    registered: 18,
    checkedIn: 12,
    quota: 20,
    courts: ["Lap 1", "Lap 2", "Lap 3"]
};

const recentActivities = [
    { icon: Ticket, color: "text-bad-blue bg-bad-blue/10 border border-bad-blue/20", user: "Rian Ardianto", action: "booked session", time: "2 mins ago" },
    { icon: Wallet, color: "text-bad-green bg-bad-green/10 border border-bad-green/20", user: "Siti Aminah", action: "paid membership", time: "15 mins ago" },
    { icon: Trophy, color: "text-bad-yellow bg-bad-yellow/10 border border-bad-yellow/20", user: "Team Minions", action: "registered tourn.", time: "1 hour ago" },
]

export default function AdminDashboard() {
  return (
    <main>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-xs font-bold text-bad-blue uppercase tracking-widest mb-1">Selasa, 24 Agustus 2025</p>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Overview</span>
                </h1>
            </div>
            
            {/* Notification Button */}
            <button className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition relative group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-bad-red rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse"></span>
            </button>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-12 gap-6 mb-8">
            
            {/* Income Card (Tetap Ada - Penting untuk Bisnis) */}
            <div className="col-span-12 lg:col-span-8 bg-[#151515] rounded-[2.5rem] p-8 relative overflow-hidden border border-white/5 shadow-2xl group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-bad-yellow/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-bad-yellow/20 transition duration-700"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-bad-yellow/10 border border-bad-yellow/20 flex items-center justify-center text-bad-yellow">
                            <Wallet className="w-5 h-5"/>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Revenue (Aug)</p>
                    </div>
                    <span className="bg-bad-green/10 text-bad-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-bad-green/20 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12.5%
                    </span>
                </div>

                <div className="relative z-10 mb-8">
                    <h2 className="text-6xl md:text-7xl font-jersey text-white tracking-wide mb-2 drop-shadow-lg">
                        Rp 15.420.000
                    </h2>
                </div>

                {/* Animated Bars Graphic */}
                <div className="absolute bottom-0 left-0 right-0 h-28 px-8 flex items-end justify-between gap-3 opacity-80">
                    {[35, 55, 45, 75, 55, 95, 65, 50].map((height, i) => (
                         <div key={i} className="w-full h-full flex items-end relative group/bar">
                            <div 
                                style={{ height: `${height}%` }}
                                className={`w-full rounded-t-sm transition-all duration-500 ease-out 
                                ${i === 5 
                                    ? 'bg-bad-yellow shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
                                    : 'bg-white/10 hover:bg-white/30'
                                }`}
                            ></div>
                         </div>
                    ))}
                </div>
            </div>

            {/* Side Stats */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                
                {/* Members Card */}
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative overflow-hidden group hover:border-bad-blue/30 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-bad-blue/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-bad-blue/10 transition"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="w-10 h-10 bg-bad-blue/10 text-bad-blue border border-bad-blue/20 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5"/>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Total</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-5xl font-jersey font-normal mb-1 group-hover:text-bad-blue transition-colors">1,204</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Members</p>
                    </div>
                </div>

                {/* Slot Fill Rate (Ganti Occupancy) */}
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative overflow-hidden group hover:border-bad-red/30 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-bad-red/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-bad-red/10 transition"></div>

                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="w-10 h-10 bg-bad-red/10 text-bad-red border border-bad-red/20 rounded-xl flex items-center justify-center">
                            <Ticket className="w-5 h-5"/>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">This Week</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-5xl font-jersey font-normal mb-1 group-hover:text-bad-red transition-colors">92%</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Slot Fill Rate</p>
                    </div>
                </div>

            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LIVE UPDATES SECTION (Pengganti Live Court CCTV) */}
            <div className="lg:col-span-2 space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        Happening Now <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bad-green opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-bad-green"></span></span>
                    </h3>
                    <Button variant="link" className="text-xs font-bold text-gray-400 hover:text-white p-0 h-auto">View Schedule →</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Active Mabar Session */}
                    <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-white/20 transition">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10">
                                    <CalendarClock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-bad-green uppercase tracking-wider mb-0.5">Session Live</p>
                                    <h4 className="font-bold text-white text-sm">{activeSession.title}</h4>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-500 bg-[#121212] px-3 py-1 rounded-full border border-white/5">{activeSession.time}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <MapPin className="w-3 h-3" /> {activeSession.location}
                            </div>
                            
                            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5">
                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    <span>Attendance</span>
                                    <span className="text-white">{activeSession.checkedIn}/{activeSession.registered} <span className="text-[9px]">Checked In</span></span>
                                </div>
                                <div className="w-full bg-[#222] rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-bad-green h-full rounded-full transition-all duration-1000" 
                                        style={{ width: `${(activeSession.checkedIn / activeSession.quota) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    {activeSession.courts.map((court, idx) => (
                                        <span key={idx} className="text-[9px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">{court}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <Button className="w-full bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200">Manage Session</Button>
                        </div>
                    </div>

                    {/* Card 2: Tournament Live Match */}
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222] p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-bad-yellow/30 transition">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-bad-yellow/5 blur-[40px] rounded-full pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded-full bg-bad-yellow/10 flex items-center justify-center text-bad-yellow border border-bad-yellow/20">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-bad-yellow uppercase tracking-wider mb-0.5 animate-pulse">Match Live</p>
                                    <h4 className="font-bold text-white text-sm">{liveMatch.tournament}</h4>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 border border-white/10 px-2 py-1 rounded-md">{liveMatch.stage}</span>
                        </div>

                        <div className="bg-[#121212] rounded-2xl p-4 border border-white/5 relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400 w-24 truncate">{liveMatch.teamA.name}</span>
                                <span className="text-2xl font-jersey text-white">{liveMatch.teamA.score}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-white w-24 truncate">{liveMatch.teamB.name}</span>
                                <span className="text-2xl font-jersey text-bad-yellow">{liveMatch.teamB.score}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{liveMatch.court}</span>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Set {liveMatch.teamA.set}</span>
                            </div>
                        </div>

                        <Button className="w-full mt-4 bg-transparent border border-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/5 hover:border-white/30">Update Score</Button>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="lg:col-span-1">
                <h3 className="text-xl font-black text-white mb-6">Recent Activity</h3>
                
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] h-full border border-white/5 flex flex-col">
                    <div className="space-y-6 flex-1">
                        {recentActivities.map((activity, index) => (
                           <div key={index} className="flex gap-4 group cursor-default">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${activity.color}`}>
                                   <activity.icon className="w-4 h-4"/>
                                </div>
                               <div>
                                   <p className="text-sm font-medium leading-tight text-gray-300">
                                     <span className="font-bold text-white">{activity.user}</span> {activity.action}
                                   </p>
                                   <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">{activity.time}</p>
                               </div>
                           </div>
                        ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-8 py-4 rounded-xl border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 bg-transparent h-auto">
                        View All History
                    </Button>
                </div>
            </div>
        </div>
    </main>
  );
}

    