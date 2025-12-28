'use client';

import { useEffect, useState } from 'react';
import { 
    Users, 
    TrendingUp, 
    Calendar, 
    Activity, 
    ShieldCheck, 
    ArrowUpRight,
    Loader2,
    Crown,
    CheckCircle,
    User,
    Dumbbell
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function SuperAdminDashboard() {
    const { toast } = useToast();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/superadmin/dashboard');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (e) {
                toast({ title: "Gagal", description: "Gagal memuat data dashboard.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [toast]);

    if (loading || !stats) {
        return (
            <div className="flex h-[80vh] items-center justify-center text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Activity className="w-8 h-8 text-[#ca1f3d]" /> SYSTEM OVERVIEW
                </h1>
                <p className="text-gray-400">Real-time data monitoring Badmintour App.</p>
            </div>

            {/* 1. TOP STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Pendapatan" 
                    value={`Rp ${stats.financial.totalRevenue.toLocaleString('id-ID')}`} 
                    sub="Gross Income"
                    icon={TrendingUp}
                    color="text-green-500"
                    bg="bg-green-500/10"
                />
                <StatCard 
                    label="Total User" 
                    value={stats.userStats.total} 
                    sub="Registered Accounts"
                    icon={Users}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard 
                    label="Total Booking" 
                    value={stats.operational.totalBookings} 
                    sub="Lifetime Transactions"
                    icon={CheckCircle}
                    color="text-[#ffbe00]"
                    bg="bg-[#ffbe00]/10"
                />
                <StatCard 
                    label="Event Aktif" 
                    value={stats.operational.activeEvents} 
                    sub="Upcoming Schedule"
                    icon={Calendar}
                    color="text-[#ca1f3d]"
                    bg="bg-[#ca1f3d]/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 2. USER DEMOGRAPHICS */}
                <Card className="lg:col-span-1 bg-[#151515] border border-white/5 p-6 rounded-[2rem]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" /> User Demographics
                    </h3>
                    
                    <div className="space-y-4">
                        <DemographicBar 
                            label="Member (Pemain)" 
                            count={stats.userStats.members} 
                            total={stats.userStats.total} 
                            color="bg-gray-500" 
                            icon={User}
                        />
                        <DemographicBar 
                            label="Coach (Pelatih)" 
                            count={stats.userStats.coaches} 
                            total={stats.userStats.total} 
                            color="bg-[#00f2ea]" 
                            icon={Dumbbell}
                        />
                        <DemographicBar 
                            label="Host (GOR)" 
                            count={stats.userStats.hosts} 
                            total={stats.userStats.total} 
                            color="bg-blue-600" 
                            icon={Calendar}
                        />
                        <DemographicBar 
                            label="Admin/Superadmin" 
                            count={stats.userStats.admins} 
                            total={stats.userStats.total} 
                            color="bg-[#ca1f3d]" 
                            icon={Crown}
                        />
                    </div>
                </Card>

                {/* 3. RECENT SYSTEM LOGS */}
                <Card className="lg:col-span-2 bg-[#151515] border border-white/5 p-6 rounded-[2rem]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-[#ffbe00]" /> Recent System Activity
                        </h3>
                        <Badge variant="outline" className="text-xs text-gray-500 border-gray-700">Live Audit</Badge>
                    </div>

                    <div className="space-y-4">
                        {stats.recentLogs.length > 0 ? (
                            stats.recentLogs.map((log: any) => (
                                <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <Avatar className="w-10 h-10 border border-white/10">
                                        <AvatarFallback className="bg-[#222] text-xs font-bold text-white">
                                            {log.userName?.charAt(0) || "S"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-white">
                                                {log.userName} 
                                                <span className="text-gray-500 font-normal ml-2 text-xs">({log.role})</span>
                                            </p>
                                            <span className="text-[10px] text-gray-500 font-mono">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge className="text-[9px] h-4 bg-black border border-white/10 text-gray-400 px-1 py-0 uppercase">
                                                {log.action}
                                            </Badge>
                                            <span className="text-[10px] text-gray-600 font-mono">ID: {log.entityId}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-sm">Belum ada aktivitas tercatat.</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Sub-components
function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
    return (
        <Card className="bg-[#151515] border border-white/5 p-6 rounded-[2rem] hover:bg-[#1A1A1A] transition-colors relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">{label}</p>
                <h3 className="text-3xl font-black text-white mt-1">{value}</h3>
                <p className={`text-xs mt-2 font-bold flex items-center gap-1 ${color}`}>
                    <ArrowUpRight className="w-3 h-3" /> {sub}
                </p>
            </div>
        </Card>
    );
}

function DemographicBar({ label, count, total, color, icon: Icon }: any) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
        <div className="group">
            <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex items-center gap-2 text-gray-300">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span>{label}</span>
                </div>
                <span className="font-bold text-white">{count} <span className="text-gray-600 text-xs">({percentage.toFixed(1)}%)</span></span>
            </div>
            <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
