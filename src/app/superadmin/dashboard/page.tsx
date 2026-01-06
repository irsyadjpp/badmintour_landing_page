
'use client';

import { useEffect, useState } from 'react';
import {
    Server,
    Database,
    ShieldAlert,
    Activity,
    Users,
    HardDrive,
    Cpu,
    CheckCircle2,
    Crown,
    User,
    Calendar,
    Dumbbell,
    RefreshCw // <-- Import Icon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // <-- Import Button
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function SuperAdminDashboard() {
    const { toast } = useToast();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false); // <-- Sync State

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

    const handleResync = async () => {
        setSyncing(true);
        try {
            const res = await fetch('/api/system/aggregates/recalc', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Sukses", description: "Data dashboard berhasil dihitung ulang.", className: "bg-green-600 text-white border-0" });
                // Refresh data manually or reload
                window.location.reload();
            } else {
                throw new Error("Failed");
            }
        } catch (e) {
            toast({ title: "Gagal", description: "Sync gagal.", variant: "destructive" });
        } finally {
            setSyncing(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex h-[80vh] items-center justify-center text-gray-500">
                <Activity className="w-10 h-10 animate-pulse text-[#ca1f3d] mb-4" />
            </div>
        );
    }

    // Helper: Warna status dot berdasarkan action log
    const getActionColor = (action: string) => {
        switch (action) {
            case 'delete': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
            case 'create': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
            case 'update': return 'bg-blue-500';
            case 'login': return 'bg-purple-500';
            case 'verify': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Server className="w-8 h-8 text-[#ca1f3d]" /> SYSTEM CONTROL
                    </h1>
                    <p className="text-gray-400">Monitoring infrastruktur, user database, dan keamanan.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleResync}
                        disabled={syncing}
                        variant="outline"
                        className="bg-[#151515] text-white border-white/10 hover:bg-white/5"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Resync Data'}
                    </Button>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2 flex gap-2 h-10">
                        <CheckCircle2 className="w-4 h-4" /> SYSTEM OPERATIONAL
                    </Badge>
                </div>
            </div>

            {/* 1. TOP SYSTEM METRICS (No Finance) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total User Database"
                    value={stats.userStats.total}
                    sub="Registered Identities"
                    icon={Users}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    label="Database Records"
                    value={stats.system.totalRecords.toLocaleString()}
                    sub="Total Documents Stored"
                    icon={Database}
                    color="text-[#ca1f3d]"
                    bg="bg-[#ca1f3d]/10"
                />
                <StatCard
                    label="Security Logs"
                    value={stats.system.totalLogs.toLocaleString()}
                    sub="Recorded Activities"
                    icon={ShieldAlert}
                    color="text-[#ffbe00]"
                    bg="bg-[#ffbe00]/10"
                />
                <StatCard
                    label="Active Events"
                    value={stats.operational.activeEvents}
                    sub="Scheduled Tasks"
                    icon={Cpu}
                    color="text-[#ca1f3d]"
                    bg="bg-[#ca1f3d]/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. USER BREAKDOWN (System Access) */}
                <Card className="lg:col-span-1 bg-[#151515] border border-white/5 p-6 rounded-[2rem]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-gray-400" /> Access Distribution
                    </h3>

                    <div className="space-y-5">
                        <DemographicBar
                            label="Member (End User)"
                            count={stats.userStats.members}
                            total={stats.userStats.total}
                            color="bg-gray-500"
                            icon={User}
                        />
                        <DemographicBar
                            label="Coach (Trainer)"
                            count={stats.userStats.coaches}
                            total={stats.userStats.total}
                            color="bg-[#ffbe00]"
                            icon={Dumbbell}
                        />
                        <DemographicBar
                            label="Host (Manager)"
                            count={stats.userStats.hosts}
                            total={stats.userStats.total}
                            color="bg-blue-600"
                            icon={Calendar}
                        />
                        <DemographicBar
                            label="Admin (System)"
                            count={stats.userStats.admins}
                            total={stats.userStats.total}
                            color="bg-[#ca1f3d]"
                            icon={Crown}
                        />
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-400 space-y-2">
                        <div className="flex justify-between">
                            <span>Last Backup:</span>
                            <span className="text-white font-mono">{stats.system.lastBackup}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Server Region:</span>
                            <span className="text-white font-mono">Asia-Southeast (JKT)</span>
                        </div>
                    </div>
                </Card>

                {/* 3. AUDIT & SECURITY FEED */}
                <Card className="lg:col-span-2 bg-[#151515] border border-white/5 p-6 rounded-[2rem]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-[#ffbe00]" /> Live Security Audit
                        </h3>
                        <Badge variant="outline" className="text-xs text-gray-500 border-gray-700 animate-pulse">Live Monitoring</Badge>
                    </div>

                    <div className="space-y-3">
                        {stats.recentLogs.length > 0 ? (
                            stats.recentLogs.map((log: any) => (
                                <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl bg-black/40 border border-white/5 hover:bg-white/5 transition-colors group">
                                    <div className={`w-2 h-2 rounded-full ${getActionColor(log.action)}`}></div>

                                    <Avatar className="w-8 h-8 border border-white/10">
                                        <AvatarFallback className="bg-[#222] text-[10px] font-bold text-white">
                                            {log.userName?.charAt(0) || "?"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className="text-sm font-bold text-gray-200 truncate">
                                                {log.userName}
                                                <span className="text-gray-500 font-normal text-xs ml-2">[{log.role}]</span>
                                            </p>
                                            <span className="text-[10px] text-gray-600 font-mono whitespace-nowrap">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate group-hover:text-gray-300 transition-colors">
                                            <span className="uppercase font-bold text-gray-400 mr-1">{log.action}:</span>
                                            {log.details}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-sm">System logs are empty.</div>
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
            <div className={`absolute -right-6 -top-6 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                <Icon className="w-32 h-32" />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">{label}</p>
                <h3 className="text-3xl font-black text-white mt-1 font-mono">{value}</h3>
                <p className={`text-xs mt-2 font-bold flex items-center gap-1 ${color}`}>
                    {sub}
                </p>
            </div>
        </Card>
    );
}

function DemographicBar({ label, count, total, color, icon: Icon }: any) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between items-center text-xs mb-2">
                <div className="flex items-center gap-2 text-gray-300">
                    <Icon className="w-3 h-3 text-gray-500" />
                    <span>{label}</span>
                </div>
                <span className="font-bold text-white font-mono">{count}</span>
            </div>
            <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
