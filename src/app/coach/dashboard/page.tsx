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
    Plus,
    Wallet,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { UserMinus } from 'lucide-react'; // Icon for Sub Request

const fetchDashboardData = async () => {
    const res = await fetch('/api/coach/dashboard');
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
};

export default function CoachDashboard() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [subRequestSession, setSubRequestSession] = useState<any>(null);
    const [subReason, setSubReason] = useState('');
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

    // Mutation for Substitute Request
    const subRequestMutation = useMutation({
        mutationFn: async () => {
            if (!subRequestSession) return;
            const res = await fetch(`/api/coach/session/${subRequestSession.id}/substitute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: subReason })
            });
            if (!res.ok) throw new Error('Failed to request substitute');
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Request Sent", description: "Admin will find a substitute for you.", className: "bg-green-600 text-white" });
            setSubRequestSession(null);
            setSubReason('');
        },
        onError: () => {
            toast({ title: "Failed", description: "Could not send request.", variant: "destructive" });
        }
    });

    const { data: apiData, isLoading } = useQuery({
        queryKey: ['coach-dashboard'],
        queryFn: fetchDashboardData
    });

    const dashboard = apiData?.data || {
        stats: {
            activeStudents: 0,
            totalHours: 0,
            rating: 5.0,
            income: "Rp 0",
            monthlyGoal: 0
        },
        upcomingSessions: [],
        pastSessions: []
    };

    // Fallback if stats is missing in data structure (safety check)
    const stats = dashboard.stats || {
        activeStudents: 0,
        totalHours: 0,
        rating: 5.0,
        income: "Rp 0",
        monthlyGoal: 0
    };

    const upcomingSessions = dashboard.upcomingSessions || [];
    const pastSessions = dashboard.pastSessions || [];

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="w-10 h-10 animate-spin text-[#ca1f3d]" /></div>;
    }

    return (
        <div className="space-y-8 pb-20">

            {/* 1. HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ca1f3d]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#ca1f3d]/20 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#ffbe00]/5 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="flex items-center gap-5 relative z-10">
                    <Avatar className="w-20 h-20 border-4 border-[#1A1A1A] shadow-2xl ring-2 ring-[#ffbe00]/20">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-[#ffbe00] text-black font-black text-2xl">
                            {session?.user?.name?.charAt(0) || "C"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic">
                            HEAD COACH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d]">{session?.user?.name?.split(' ')[0] || 'MASTER'}</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-[#ffbe00] border-[#ffbe00]/30 bg-[#ffbe00]/10 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                                Certified Pro
                            </Badge>
                            <span className="text-xs text-gray-400 font-mono flex items-center gap-1 font-bold">
                                <Star className="w-3 h-3 text-[#ffbe00] fill-current" /> {stats.rating} Rating
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto relative z-10">
                    <Link href="/coach/schedule" className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 bg-transparent text-white font-bold hover:bg-white hover:text-black transition-all hover:scale-105">
                            <CalendarCheck className="w-4 h-4 mr-2" /> Atur Jadwal
                        </Button>
                    </Link>
                    <Link href="/coach/students" className="flex-1 md:flex-none">
                        <Button className="w-full h-12 px-8 rounded-xl bg-[#ca1f3d] text-white hover:bg-[#a61932] font-black shadow-[0_0_20px_rgba(202,31,61,0.4)] hover:shadow-[0_0_30px_rgba(202,31,61,0.6)] hover:scale-105 transition-all">
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
                    sub={stats.isMock ? "Mock Data" : "Realtime"}
                    color="text-[#ffbe00]"
                    bg="bg-[#ffbe00]"
                />
                <StatsCard
                    icon={Dumbbell}
                    label="Total Hours"
                    value={`${stats.totalHours}`}
                    sub="All Time"
                    color="text-[#ca1f3d]"
                    bg="bg-[#ca1f3d]"
                />
                <StatsCard
                    icon={Wallet}
                    label="Total Earnings"
                    value={stats.income}
                    sub="Withdrawable"
                    color="text-[#22c55e]"
                    bg="bg-[#22c55e]"
                />
                <StatsCard
                    icon={Trophy}
                    label="Rank"
                    value="Elite"
                    sub="Top 5%"
                    color="text-[#ffbe00]"
                    bg="bg-[#ffbe00]"
                />
            </div>

            {/* 3. MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Upcoming Sessions */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                                <Clock className="w-6 h-6 text-[#ca1f3d]" /> Sesi Latihan
                            </h3>
                            <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-white/5 gap-1">
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'upcoming' ? 'bg-[#ffbe00] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                >
                                    UPCOMING
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                >
                                    HISTORY
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {activeTab === 'upcoming' ? (
                                upcomingSessions.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 border border-white/5 border-dashed rounded-2xl">
                                        Tidak ada sesi yang akan datang.
                                    </div>
                                ) : upcomingSessions.map((session: any) => (
                                    <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#ffbe00]/30 transition-all duration-300 group relative overflow-hidden gap-4 hover:translate-x-2 cursor-pointer">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffbe00] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <Link href={`/coach/session/${session.id}/assess`} className="flex-1 flex items-center gap-5">
                                            <div className="p-4 rounded-2xl bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20 group-hover:bg-[#ffbe00] group-hover:text-black transition-colors">
                                                <Dumbbell className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white text-lg">{session.type || 'Training Session'}</h4>
                                                <div className="text-xs text-gray-400 flex items-center gap-4 mt-1.5 font-bold uppercase tracking-wide">
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#ca1f3d]" /> {session.time}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#ca1f3d]" /> {session.location}</span>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-4 w-full sm:w-auto pl-20 sm:pl-0">
                                            <div className="text-left sm:text-right">
                                                <p className="text-sm font-bold text-gray-300 mb-2">{session.student}</p>
                                                <Badge variant="secondary" className={`text-[10px] uppercase font-bold px-3 py-1 ${session.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'} border`}>
                                                    {session.status || 'Scheduled'}
                                                </Badge>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setSubRequestSession(session);
                                                }}
                                                title="Request Substitute"
                                            >
                                                <UserMinus className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // HISTORY TAB
                                pastSessions.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 border border-white/5 border-dashed rounded-2xl">
                                        Belum ada riwayat sesi.
                                    </div>
                                ) : pastSessions.map((session: any) => (
                                    <Link key={session.id} href={`/coach/session/${session.id}/assess`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-300 group relative overflow-hidden gap-4 hover:translate-x-2 cursor-pointer">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="flex-1 flex items-center gap-5">
                                            <div className="p-4 rounded-2xl bg-white/5 text-gray-400 border border-white/10 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                                <Dumbbell className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white text-lg">{session.student || 'Training Session'}</h4>
                                                <div className="text-xs text-gray-400 flex items-center gap-4 mt-1.5 font-bold uppercase tracking-wide">
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" /> {session.time}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {session.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-left sm:text-right pl-20 sm:pl-0">
                                            <p className="text-xs text-gray-500 mb-2">{session.date}</p>
                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold px-3 py-1 bg-gray-800 text-gray-400 border-gray-700">
                                                COMPLETED
                                            </Badge>
                                        </div>
                                    </Link>
                                ))
                            )}

                            {/* Substitute Dialog */}
                            <Dialog open={!!subRequestSession} onOpenChange={(open) => !open && setSubRequestSession(null)}>
                                <DialogContent className="bg-[#151515] border-white/10 text-white rounded-[2rem]">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black uppercase italic text-[#ca1f3d] flex items-center gap-2">
                                            <UserMinus className="w-6 h-6" /> Request Substitute
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <p className="text-sm text-gray-400">
                                            Anda akan mengajukan permintaan pengganti untuk sesi <strong>{subRequestSession?.type}</strong> dengan <strong>{subRequestSession?.student}</strong>.
                                        </p>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-gray-500">Alasan</label>
                                            <Textarea
                                                placeholder="Contoh: Sakit mendadak, Urgent matter..."
                                                value={subReason}
                                                onChange={(e) => setSubReason(e.target.value)}
                                                className="bg-[#0a0a0a] border-white/10 rounded-xl min-h-[100px]"
                                            />
                                        </div>
                                        <Button
                                            className="w-full bg-[#ca1f3d] hover:bg-[#a61932] text-white font-bold h-12 rounded-xl"
                                            onClick={() => subRequestMutation.mutate()}
                                            disabled={!subReason || subRequestMutation.isPending}
                                        >
                                            {subRequestMutation.isPending ? <Loader2 className="animate-spin" /> : "SUBMIT REQUEST"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/coach/modules/new" className="block">
                            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] hover:bg-[#1A1A1A] transition cursor-pointer group border hover:border-[#ca1f3d]/50 h-full">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-[#ca1f3d]/10 rounded-2xl flex items-center justify-center text-[#ca1f3d] border border-[#ca1f3d]/20 group-hover:bg-[#ca1f3d] group-hover:scale-110 group-hover:text-white transition-all shadow-lg">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-lg group-hover:text-[#ca1f3d] transition-colors uppercase italic">New Drill</h4>
                                        <p className="text-xs text-gray-500 font-medium">Buat modul latihan baru</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] hover:bg-[#1A1A1A] transition cursor-pointer group border hover:border-[#ffbe00]/50 h-full">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#ffbe00]/10 rounded-2xl flex items-center justify-center text-[#ffbe00] border border-[#ffbe00]/20 group-hover:bg-[#ffbe00] group-hover:scale-110 group-hover:text-black transition-all shadow-lg">
                                    <Star className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-lg group-hover:text-[#ffbe00] transition-colors uppercase italic">Reviews</h4>
                                    <p className="text-xs text-gray-500 font-medium">Lihat feedback murid</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right: Performance */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] p-8 h-full relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ffbe00] via-[#ca1f3d] to-[#ffbe00]"></div>
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ca1f3d]/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div>
                            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-2 uppercase italic tracking-tighter">
                                <TrendingUp className="w-6 h-6 text-[#ffbe00]" /> Performance
                            </h3>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-3">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Monthly Goal</p>
                                        <span className="text-sm font-black text-[#ffbe00]">{stats.monthlyGoal}%</span>
                                    </div>
                                    <Progress value={stats.monthlyGoal} className="h-3 bg-[#0a0a0a] border border-white/5" indicatorClassName="bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d]" />
                                    <p className="text-[10px] text-gray-500 mt-2 font-mono">Target: 40 Jam / Bulan</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 relative overflow-hidden group hover:border-[#22c55e]/30 transition-colors">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#22c55e]/10 rounded-full blur-xl group-hover:bg-[#22c55e]/20 transition-all"></div>
                                    <div className="flex justify-between mb-3 relative z-10">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Income</span>
                                        <Wallet className="w-4 h-4 text-[#22c55e]" />
                                    </div>
                                    <p className="text-3xl font-black text-white relative z-10 tracking-tight">{stats.income}</p>
                                    <p className="text-[10px] text-[#22c55e] mt-2 relative z-10 font-bold bg-[#22c55e]/10 inline-block px-2 py-1 rounded-full border border-[#22c55e]/20">Earned so far</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-white text-black hover:bg-[#ffbe00] hover:text-black font-black rounded-xl border-none h-14 shadow-lg mt-8 transition-all hover:scale-[1.02]">
                            View Finance Report <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Card>
                </div>
            </div>
        </div >
    );
}

function StatsCard({ icon: Icon, label, value, sub, color, bg }: any) {
    return (
        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] hover:bg-[#1A1A1A] transition-all group hover:-translate-y-1 hover:shadow-2xl hover:border-[#ca1f3d]/20">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-2xl ${bg}/10 ${color} border border-white/5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                {sub && <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 group-hover:text-white transition-colors">{sub}</span>}
            </div>
            <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2 group-hover:text-gray-300 transition-colors">{label}</p>
        </Card>
    )
}
