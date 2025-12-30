'use client';

import {
    Wallet,
    Users,
    Ticket,
    Trophy,
    MapPin,
    CalendarClock,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/layout/notification-bell';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminDashboard() {

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: async () => {
            const res = await fetch('/api/admin/dashboard');
            if (!res.ok) throw new Error('Failed to fetch dashboard data');
            const json = await res.json();
            return json;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#ffbe00]" />
            </div>
        );
    }

    const { stats, recentActivities, upcomingEvents } = dashboardData || { stats: {}, recentActivities: [], upcomingEvents: [] };

    return (
        <main className="pb-20">

            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-xs font-bold text-bad-blue uppercase tracking-widest mb-1">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Overview</span>
                    </h1>
                </div>

                <NotificationBell />

            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-12 gap-6 mb-8">

                {/* Income Card */}
                <div className="col-span-12 lg:col-span-8 bg-[#151515] rounded-[2.5rem] p-8 relative overflow-hidden border border-white/5 shadow-2xl group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-bad-yellow/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-bad-yellow/20 transition duration-700"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-bad-yellow/10 border border-bad-yellow/20 flex items-center justify-center text-bad-yellow">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Revenue</p>
                        </div>
                        {/* Placeholder Trend - Real trend requires historical data comparison */}
                        <span className="bg-bad-green/10 text-bad-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-bad-green/20 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> LIVE
                        </span>
                    </div>

                    <div className="relative z-10 mb-8">
                        <h2 className="text-6xl md:text-7xl font-jersey text-white tracking-wide mb-2 drop-shadow-lg">
                            Rp {stats?.totalRevenue?.toLocaleString('id-ID') || 0}
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
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Total</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-5xl font-jersey font-normal mb-1 group-hover:text-bad-blue transition-colors">
                                {stats?.totalMembers?.toLocaleString('id-ID') || 0}
                            </h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Members</p>
                        </div>
                    </div>

                    {/* Slot Fill Rate */}
                    <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative overflow-hidden group hover:border-bad-red/30 transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-bad-red/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-bad-red/10 transition"></div>

                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="w-10 h-10 bg-bad-red/10 text-bad-red border border-bad-red/20 rounded-xl flex items-center justify-center">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Forecast</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-5xl font-jersey font-normal mb-1 group-hover:text-bad-red transition-colors">
                                {stats?.fillRate || 0}%
                            </h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Slot Fill Rate</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* UPCOMING EVENTS SECTION */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            Upcoming Events
                        </h3>
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
                                                ${event.type === 'tournament' ? 'bg-bad-yellow/10 text-bad-yellow' : 'bg-bad-blue/10 text-bad-blue'}
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
                                                className={`h-full rounded-full transition-all duration-1000 ${event.type === 'tournament' ? 'bg-bad-yellow' : 'bg-bad-blue'}`}
                                                style={{ width: `${Math.min(100, ((event.bookedSlot || 0) / event.quota) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RECENT ACTIVITY SECTION */}
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-black text-white mb-6">Recent Bookings</h3>

                    <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] h-full border border-white/5 flex flex-col">
                        <div className="space-y-6 flex-1">
                            {recentActivities.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No recent activity.</p>
                            ) : (
                                recentActivities.map((activity: any, index: number) => (
                                    <div key={index} className="flex gap-4 group cursor-default">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 
                                    ${activity.amount > 100000 ? 'text-bad-yellow bg-bad-yellow/10 border border-bad-yellow/20' : 'text-bad-green bg-bad-green/10 border border-bad-green/20'}
                                `}>
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-tight text-gray-300">
                                                <span className="font-bold text-white">{activity.user}</span> booked session (Rp {activity.amount?.toLocaleString()})
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">
                                                {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Button variant="outline" className="w-full mt-8 py-4 rounded-xl border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 bg-transparent h-auto">
                            View All Activity
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
