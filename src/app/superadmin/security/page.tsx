
'use client';

import { useState, useEffect } from 'react';
import {
    ShieldAlert,
    Search,
    Filter,
    History,
    Smartphone,
    Globe,
    LogOut,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Lock,
    Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// --- Types ---
type LogSeverity = 'info' | 'warning' | 'critical';
type LogStatus = 'success' | 'failed';

interface AuditLog {
    id: string;
    actor: { name: string; role: string; avatar: string };
    action: string;
    target: string;
    timestamp: string;
    ip: string;
    severity: LogSeverity;
    status: LogStatus;
}

interface ActiveSession {
    id: string;
    user: string;
    device: string;
    location: string;
    ip: string;
    lastActive: string;
    isMobile: boolean;
}

const initialSessions: ActiveSession[] = [
    { id: 'sess-01', user: 'SuperAdmin', device: 'MacBook Pro M1', location: 'Jakarta, ID', ip: '103.20.11.45', lastActive: 'Just now', isMobile: false },
    { id: 'sess-02', user: 'Budi Santoso (Coach)', device: 'iPhone 13 Pro', location: 'Bandung, ID', ip: '112.50.33.12', lastActive: '5m ago', isMobile: true },
    { id: 'sess-03', user: 'Admin Finance', device: 'Windows 11 PC', location: 'Surabaya, ID', ip: '36.88.10.99', lastActive: '1h ago', isMobile: false },
];

// --- Mock Data ---
export default function SecurityLogsPage() {
    const { toast } = useToast();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions);

    // --- Data Control States ---
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof AuditLog | 'actor.name', direction: 'asc' | 'desc' }>({ key: 'timestamp', direction: 'desc' });

    const itemsPerPage = 5;

    // Fetch Logs
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Fetch a larger pool for client-side manipulation (e.g., 100)
                const res = await fetch('/api/admin/security/logs?limit=100');
                const result = await res.json();

                if (result.success) {
                    const mappedLogs: AuditLog[] = result.data.map((item: any) => ({
                        id: item.id,
                        actor: {
                            name: item.userName || 'System',
                            role: item.role || 'system',
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName || 'System')}&background=random`
                        },
                        action: item.action?.toUpperCase() || 'UNKNOWN',
                        target: `${item.entity} ${item.entityId !== 'N/A' ? `(${item.entityId.substring(0, 8)}...)` : ''}`,
                        timestamp: new Date(item.createdAt).toLocaleString('id-ID'), // Simple formatting
                        rawTimestamp: item.createdAt, // Keep raw for sorting
                        ip: item.ip || 'Unknown',
                        severity: item.action === 'delete' ? 'critical' : item.action === 'update' ? 'warning' : 'info',
                        status: 'success'
                    }));
                    setLogs(mappedLogs);
                }
            } catch (error) {
                console.error("Failed to load security logs", error);
                toast({ title: "Error", description: "Gagal memuat log keamanan.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    // --- Helpers ---
    const getSeverityColor = (sev: LogSeverity) => {
        switch (sev) {
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'warning': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    const handleRevokeSession = (id: string, user: string) => {
        if (confirm(`Tendang user ${user} dari sesi ini?`)) {
            setSessions(prev => prev.filter(s => s.id !== id));
            toast({ title: "Session Killed", description: `Akses ${user} telah dicabut paksa.`, variant: "destructive" });
        }
    };

    const handleBanIP = (ip: string) => {
        toast({ title: "IP Blacklisted", description: `Alamat ${ip} telah dimasukkan ke firewall.`, className: "bg-red-600 text-white border-none" });
    }

    // --- Process Data (Filter -> Sort -> Paginate) ---
    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ip.includes(searchQuery) ||
            log.target.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;

        return matchesSearch && matchesSeverity;
    });

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof AuditLog] || '';
        const bValue = b[sortConfig.key as keyof AuditLog] || '';

        // Special case for timestamp mostly
        if (sortConfig.key === 'timestamp') {
            // @ts-ignore - using raw property if available or parse date
            const tA = new Date(a.rawTimestamp || a.timestamp).getTime();
            // @ts-ignore
            const tB = new Date(b.rawTimestamp || b.timestamp).getTime();
            return sortConfig.direction === 'asc' ? tA - tB : tB - tA;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
    const paginatedLogs = sortedLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (key: keyof AuditLog | 'actor.name') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <main className="pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-orange-600">Radar</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Audit jejak digital user dan pantau keamanan sistem secara real-time.</p>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-400">System Secure</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: AUDIT LOGS */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Controls Bar */}
                    <div className="bg-[#1A1A1A] p-3 rounded-[1.5rem] border border-white/5 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Cari Log ID, Actor, atau IP..."
                                className="bg-[#121212] border-none pl-11 h-11 text-white font-bold placeholder:text-gray-600 focus-visible:ring-0 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <Select value={filterSeverity} onValueChange={(val) => { setFilterSeverity(val); setCurrentPage(1); }}>
                            <SelectTrigger className="w-full md:w-[150px] bg-[#121212] border-none text-white font-bold rounded-xl h-11">
                                <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                <SelectItem value="all">Logs: All</SelectItem>
                                <SelectItem value="critical" className="text-red-500">Critical Only</SelectItem>
                                <SelectItem value="warning" className="text-orange-500">Warnings</SelectItem>
                                <SelectItem value="info" className="text-blue-500">Info</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortConfig.key} onValueChange={(val) => handleSort(val as any)}>
                            <SelectTrigger className="w-full md:w-[150px] bg-[#121212] border-none text-white font-bold rounded-xl h-11">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                <SelectItem value="timestamp">By Time</SelectItem>
                                <SelectItem value="severity">By Severity</SelectItem>
                                <SelectItem value="action">By Action</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Logs List */}
                    <div className="space-y-3 min-h-[500px]">
                        {paginatedLogs.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl">
                                Tidak ada log yang cocok dengan filter.
                            </div>
                        ) : (
                            paginatedLogs.map((log) => (
                                <div key={log.id} className="group bg-[#151515] hover:bg-[#1A1A1A] p-4 rounded-[1.5rem] border border-white/5 hover:border-[#ffbe00]/30 transition-all flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">

                                    {/* Severity Indicator Line */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.severity === 'critical' ? 'bg-red-500' :
                                        log.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                        }`}></div>

                                    {/* Actor Info */}
                                    <div className="flex items-center gap-3 w-full md:w-[200px]">
                                        <Avatar className="w-10 h-10 border border-white/10">
                                            <AvatarImage src={log.actor.avatar} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-none">{log.actor.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase mt-1">{log.actor.role}</p>
                                        </div>
                                    </div>

                                    {/* Action Detail */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className={`rounded-md text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border-0 ${getSeverityColor(log.severity)}`}>
                                                {log.action}
                                            </Badge>
                                            <span className="text-[10px] text-gray-500 font-mono">{log.id}</span>
                                        </div>
                                        <p className="text-xs text-gray-300">
                                            <span className={log.action.includes('DELETE') ? 'text-red-400 font-bold' : 'text-gray-400'}>{log.action.split('_')[0]}</span> {log.target}
                                        </p>
                                    </div>

                                    {/* IP & Time */}
                                    <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                                        <div className="flex items-center gap-2 group/ip cursor-pointer" onClick={() => handleBanIP(log.ip)}>
                                            <Globe className="w-3 h-3 text-gray-600 group-hover/ip:text-red-500" />
                                            <span className="text-[10px] font-mono text-gray-500 group-hover/ip:text-red-500 group-hover/ip:underline transition-colors">{log.ip}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400">{log.timestamp}</span>
                                            {log.status === 'success' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {sortedLogs.length > 0 && (
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <Button
                                variant="outline"
                                className="h-10 rounded-xl border-white/10 bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>

                            <span className="text-xs font-bold text-gray-500">
                                Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                                <span className="ml-2 opacity-50">({sortedLogs.length} items)</span>
                            </span>

                            <Button
                                variant="outline"
                                className="h-10 rounded-xl border-white/10 bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: ACTIVE SESSIONS */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Security Alert Card */}
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-20 animate-pulse">
                            <ShieldAlert className="w-16 h-16 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Security Alert</h3>
                        <p className="text-xs text-red-200/80 mb-4 leading-relaxed">
                            Terdeteksi 3 percobaan login gagal dari IP <span className="font-mono bg-black/20 px-1 rounded">10.0.0.5</span> dalam 10 menit terakhir.
                        </p>
                        <Button onClick={() => handleBanIP('10.0.0.5')} size="sm" className="bg-red-500 hover:bg-red-600 text-white border-0 font-bold rounded-lg text-xs w-full">
                            Block IP Address
                        </Button>
                    </div>

                    {/* Active Sessions List */}
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-[2rem] p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-[#ffbe00]" />
                            <h3 className="font-bold text-white">Active Sessions</h3>
                            <Badge className="ml-auto bg-[#ffbe00] text-black hover:bg-[#ffbe00]">{sessions.length}</Badge>
                        </div>

                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="relative pl-4 border-l-2 border-white/10 hover:border-[#ffbe00] transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-white mb-0.5">{session.user}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                {session.isMobile ? <Smartphone className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                                {session.device}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRevokeSession(session.id, session.user)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                            title="Revoke Access"
                                        >
                                            <LogOut className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="text-[9px] h-4 px-1 rounded bg-white/5 text-gray-400">{session.location}</Badge>
                                        <span className="text-[9px] font-mono text-gray-600">{session.ip}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

