'use client';

import { useState, useEffect } from 'react';
import {
    Activity,
    Cpu,
    HardDrive,
    Zap,
    Server,
    AlertOctagon,
    Terminal,
    RefreshCw,
    Wifi,
    CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// --- Types ---
interface SystemLog {
    id: string;
    timestamp: string;
    level: 'ERROR' | 'WARN' | 'INFO';
    message: string;
    service: string;
}

// --- Mock Data ---
export default function SystemHealthPage() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [isLive, setIsLive] = useState(true);
    const [vitalStats, setVitalStats] = useState({
        cpuLoad: 0,
        memoryUsed: 0,
        memoryTotal: 0,
        uptime: 0
    });

    useEffect(() => {
        if (!isLive) return;

        const fetchData = async () => {
            try {
                const res = await fetch('/api/system/health');
                const result = await res.json();

                if (result.success) {
                    const { uptime, memory, cpuLoad, logs } = result.data;

                    // Update Pulse Stats
                    setVitalStats({
                        cpuLoad: Math.round(cpuLoad * 100) / 100 || 0, // Load Avg can be small float
                        memoryUsed: memory.heapUsed,
                        memoryTotal: memory.heapTotal,
                        uptime: uptime
                    });

                    // Update Logs
                    const mappedLogs = logs.map((l: any) => ({
                        id: l.id,
                        timestamp: new Date(l.timestamp).toLocaleTimeString(),
                        level: l.level,
                        message: l.message,
                        service: l.service
                    }));
                    setLogs(mappedLogs);

                    // Update Chart Data (Keep last 10 points)
                    setPerformanceData(prev => {
                        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                        const newPoint = {
                            time: now,
                            cpu: Math.min(100, Math.round((cpuLoad || 0) * 10)), // Simulated scale for charts
                            ram: Math.round((memory.heapUsed / memory.heapTotal) * 100)
                        };
                        const newData = [...prev, newPoint];
                        if (newData.length > 20) newData.shift(); // Keep logs clean
                        return newData;
                    });
                }
            } catch (error) {
                console.error("Health Check Failed", error);
            }
        };

        fetchData(); // Initial call
        const interval = setInterval(fetchData, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [isLive]);

    return (
        <main className="pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]">Vitality</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Real-time server monitoring & crash analytics.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsLive(!isLive)}
                        variant="outline"
                        className={`h-10 border-white/10 ${isLive ? 'text-green-500 bg-green-500/10' : 'text-gray-500'}`}
                    >
                        <Activity className={`w-4 h-4 mr-2 ${isLive ? 'animate-pulse' : ''}`} />
                        {isLive ? 'Live Monitoring' : 'Paused'}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-gray-400 hover:text-white rounded-xl bg-[#1A1A1A] border border-white/10">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* 1. VITAL SIGNS (Top Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

                {/* Uptime */}
                <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Activity className="w-5 h-5" /></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uptime</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-4xl font-jersey text-white">{Math.floor(vitalStats.uptime / 60)}<span className="text-xl text-gray-600">min</span></h3>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Stable (Node Process)
                    </p>
                </div>

                {/* CPU Load */}
                <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                    {/* Background Animation */}
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#ca1f3d]/5 blur-2xl"></div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#ca1f3d]/10 text-[#ca1f3d] rounded-lg"><Cpu className="w-5 h-5" /></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">CPU Load</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-4xl font-jersey text-white">{vitalStats.cpuLoad}<span className="text-xl text-gray-600">avg</span></h3>
                    </div>
                    <div className="w-full bg-[#222] rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${vitalStats.cpuLoad > 2 ? 'bg-red-500' : 'bg-[#ca1f3d]'}`}
                            style={{ width: `${Math.min(100, vitalStats.cpuLoad * 20)}%` }} // Visualize load
                        ></div>
                    </div>
                </div>

                {/* Memory / RAM */}
                <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#ffbe00]/10 text-[#ffbe00] rounded-lg"><HardDrive className="w-5 h-5" /></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Node Heap</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-4xl font-jersey text-white">{vitalStats.memoryUsed}<span className="text-xl text-gray-600">MB</span></h3>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 font-bold">
                        of {vitalStats.memoryTotal} MB Allocated
                    </p>
                </div>

                {/* Latency */}
                <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-4 right-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><Wifi className="w-5 h-5" /></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Latency</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-4xl font-jersey text-white">24<span className="text-xl text-gray-600">ms</span></h3>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 font-bold">
                        Region: Jakarta (cgk-1)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. PERFORMANCE CHART (Main) */}
                <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Zap className="w-6 h-6 text-[#ca1f3d]" />
                            <div>
                                <h3 className="text-xl font-black text-white">Load Analysis</h3>
                                <p className="text-xs text-gray-500">Traffic vs Resources</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="bg-[#ca1f3d]/10 text-[#ca1f3d] border-0">CPU</Badge>
                            <Badge variant="outline" className="bg-[#ffbe00]/10 text-[#ffbe00] border-0">RAM</Badge>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ca1f3d" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ca1f3d" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffbe00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ffbe00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="cpu" stroke="#ca1f3d" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
                                <Area type="monotone" dataKey="ram" stroke="#ffbe00" strokeWidth={3} fillOpacity={1} fill="url(#colorRam)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. ERROR LOGS (Terminal Style) */}
                <div className="lg:col-span-1 flex flex-col">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-6 flex-1 flex flex-col font-mono shadow-2xl relative overflow-hidden">
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-400">system_logs.log</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>

                        {/* Logs Content */}
                        <ScrollArea className="flex-1 pr-4 -mr-4">
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <div key={log.id} className="text-[10px] leading-relaxed border-l-2 pl-3 py-1 relative group">
                                        <div className={`absolute left-[-2px] top-0 bottom-0 w-[2px] ${log.level === 'ERROR' ? 'bg-red-500' :
                                            log.level === 'WARN' ? 'bg-yellow-500' : 'bg-gray-500'
                                            }`}></div>

                                        <div className="flex justify-between items-start opacity-70 mb-0.5">
                                            <span className="text-gray-500">[{log.timestamp}]</span>
                                            <span className={`font-bold ${log.level === 'ERROR' ? 'text-red-500' :
                                                log.level === 'WARN' ? 'text-yellow-500' : 'text-gray-400'
                                                }`}>{log.level}</span>
                                        </div>
                                        <p className="text-gray-300 group-hover:text-white transition-colors">
                                            <span className="text-[#ffbe00]">[{log.service}]</span> {log.message}
                                        </p>
                                    </div>
                                ))}
                                <div className="h-4"></div>
                                <div className="flex items-center gap-2 text-gray-600 text-[10px] animate-pulse">
                                    <span className="text-green-500">➜</span> Listening for new events...
                                </div>
                            </div>
                        </ScrollArea>

                        <Button variant="secondary" className="w-full mt-4 h-10 rounded-xl text-xs font-bold bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
                            Download Full Log
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom: Server Node Status */}
            <div className="mt-8">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <Server className="w-5 h-5" /> Nodes Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Node-Alpha (Primary)', 'Node-Beta (Replica)', 'Node-Gamma (Backup)'].map((node, i) => (
                        <div key={i} className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
                                <span className="font-bold text-sm text-gray-300">{node}</span>
                            </div>
                            <span className="text-xs font-mono text-gray-500">{i === 0 ? '12ms' : 'Idle'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
