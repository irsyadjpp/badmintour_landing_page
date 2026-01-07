'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
    Users,
    CalendarPlus,
    Wallet,
    Zap,
    Activity,
    Dumbbell,
    Swords,
    QrCode,
    MapPin,
    Ticket,
    TrendingUp,
    CalendarClock,
    Trophy,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';

export default function HostDashboard() {
    const { data: session } = useSession();

    // FETCH REAL STATS
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['host', 'dashboard-stats'],
        queryFn: async () => {
            const res = await fetch('/api/host/dashboard/stats');
            if (!res.ok) throw new Error('Failed to fetch stats');
            return res.json();
        }
    });

    const stats = statsData?.data || {
        activeEvents: 0,
        totalParticipants: 0,
        revenueToday: "Rp 0",
        revenueRaw: 0, // Assuming API returns raw number too, if not we parse it
        occupancyRate: 0,
        upcomingEvents: []
    };

    // Helper to parse revenue if string
    const revenueValue = typeof stats.revenueToday === 'string'
        ? parseInt(stats.revenueToday.replace(/[^0-9]/g, '')) || 0
        : stats.revenueToday || 0;

    const upcomingEvents = stats.upcomingEvents || [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#ffbe00]" />
            </div>
        );
    }

    return (
        <div className="pb-20">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <p className="text-xs font-bold text-[#ffbe00] uppercase tracking-widest mb-1">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        Host <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Dashboard</span>
                    </h1>
                </div>

                <div className="flex gap-3">
                    <Link href="/host/scan">
                        <Button variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5 text-gray-400 font-bold hover:text-[#ffbe00] hover:border-[#ffbe00]/50 gap-2">
                            <QrCode className="w-4 h-4" /> <span className="hidden md:inline">Scan Tiket</span>
                        </Button>
                    </Link>
                    <Link href="/host/events/create">
                        <Button className="h-12 px-6 rounded-xl bg-[#ca1f3d] text-white hover:bg-[#a01830] font-black shadow-[0_0_20px_rgba(202,31,61,0.4)] hover:scale-105 transition-transform gap-2">
                            <CalendarPlus className="w-4 h-4" /> <span className="hidden md:inline">BUAT EVENT</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-12 gap-6 mb-8">

                {/* Revenue Card (Hero) */}
                <div className="col-span-12 lg:col-span-8 bg-[#151515] rounded-[2.5rem] p-8 relative overflow-hidden border border-white/5 shadow-2xl group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ffbe00]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#ffbe00]/20 transition duration-700"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#ffbe00]/10 border border-[#ffbe00]/20 flex items-center justify-center text-[#ffbe00]">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Estimasi Pendapatan</p>
                        </div>
                        <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-500/20 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> TODAY
                        </span>
                    </div>

                    <div className="relative z-10 mb-8">
                        <h2 className="text-6xl md:text-7xl font-sans font-black text-white tracking-tighter mb-2 drop-shadow-lg">
                            Rp {revenueValue.toLocaleString('id-ID')}
                        </h2>
                    </div>

                    {/* Animated Bars Graphic */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 px-8 flex items-end justify-between gap-3 opacity-80">
                        {[35, 55, 45, 75, 55, 95, 65, 50, 40, 60].map((height, i) => (
                            <div key={i} className="w-full h-full flex items-end relative group/bar">
                                <div
                                    style={{ height: `${height}%` }}
                                    className={`w-full rounded-t-sm transition-all duration-500 ease-out 
                                ${i === 5
                                            ? 'bg-[#ffbe00] shadow-[0_0_20px_rgba(255,190,0,0.4)]'
                                            : 'bg-white/10 hover:bg-white/30'
                                        }`}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Stats Stack */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    {/* Participants Card */}
                    <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative overflow-hidden group hover:border-[#ca1f3d]/30 transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ca1f3d]/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#ca1f3d]/10 transition"></div>

                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="w-10 h-10 bg-[#ca1f3d]/10 text-[#ca1f3d] border border-[#ca1f3d]/20 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Total</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-5xl font-sans font-black mb-1 group-hover:text-[#ca1f3d] transition-colors tracking-tighter">
                                {stats.totalParticipants}
                            </h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Players</p>
                        </div>
                    </div>

                    {/* Occupancy Card */}
                    <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative overflow-hidden group hover:border-[#ffbe00]/30 transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffbe00]/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#ffbe00]/10 transition"></div>

                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="w-10 h-10 bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20 rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Rate</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-5xl font-sans font-black mb-1 group-hover:text-[#ffbe00] transition-colors tracking-tighter">
                                {stats.occupancyRate}%
                            </h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Occupancy Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* MAIN CONTENT (Events & Quick Actions) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CreateCard title="Mabar" icon={Users} desc="Sesi main bareng publik" href="/host/events/create?type=mabar" theme="red" />
                            <CreateCard title="Drilling" icon={Dumbbell} desc="Kelas latihan/Coaching" href="/host/events/create?type=drilling" theme="yellow" />
                            <CreateCard title="Sparring" icon={Swords} desc="Slot tantangan squad" href="/host/events/create?type=sparring" theme="dark" />
                        </div>
                    </div>

                    {/* Upcoming Events List */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white flex items-center gap-2">
                                Upcoming Schedule
                            </h3>
                            <Link href="/host/events" className="text-xs font-bold text-gray-500 hover:text-[#ffbe00]">View All</Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {upcomingEvents.length === 0 ? (
                                <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-white/5 text-center text-gray-500">
                                    No upcoming events found.
                                </div>
                            ) : (
                                upcomingEvents.map((event: any) => (
                                    <div key={event.id} className="bg-[#1A1A1A] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/20 transition flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex gap-3 items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/10
                                                        ${event.type === 'tournament' ? 'bg-[#ffbe00]/10 text-[#ffbe00]' : 'bg-[#ca1f3d]/10 text-[#ca1f3d]'}
                                                    `}>
                                                        {event.type === 'tournament' ? <Trophy className="w-5 h-5" /> : <CalendarClock className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                                                            {event.type || 'Event'}
                                                        </p>
                                                        <h4 className="font-bold text-white text-lg">{event.title}</h4>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarClock className="w-3 h-3" /> {new Date(event.date).toLocaleDateString()} • {event.time}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3 h-3" /> {event.location}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-48 bg-[#121212] p-4 rounded-2xl border border-white/5 shrink-0">
                                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                                <span>Quota</span>
                                                <span className="text-white">{event.bookedSlot || 0}/{event.quota}</span>
                                            </div>
                                            <div className="w-full bg-[#222] rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${event.type === 'tournament' ? 'bg-[#ffbe00]' : 'bg-[#ca1f3d]'}`}
                                                    style={{ width: `${Math.min(100, ((event.bookedSlot || 0) / event.quota) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* SIDE CONTENT (Active Events Summary) */}
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-black text-white mb-6">Live Status</h3>

                    <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] h-full border border-white/5 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]"></div>

                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-2">
                            <div className="w-16 h-16 rounded-3xl bg-[#ffbe00]/10 text-[#ffbe00] flex items-center justify-center mb-4 border border-[#ffbe00]/20 animate-pulse">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h4 className="text-4xl font-black text-white tracking-tighter">
                                {stats.activeEvents}
                            </h4>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Events</p>
                            <p className="text-xs text-gray-600 mt-2 px-4">Events currently running or starting today.</p>
                        </div>

                        <Link href="/host/events">
                            <Button variant="outline" className="w-full mt-auto py-6 rounded-2xl border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 bg-transparent">
                                Manage Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
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
