
'use client';

import { useState, useEffect } from 'react';
import { 
    Activity, 
    Search, 
    ShieldCheck, 
    Clock, 
    User, 
    FileText,
    Filter,
    Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AuditLogsPage() {
    const { toast } = useToast();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterAction, setFilterAction] = useState('all');

    // Fetch Logs Real-time
    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/superadmin/audit');
            const data = await res.json();
            if (data.success) {
                setLogs(data.data);
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Gagal memuat logs.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // Helper Badge Warna
    const getActionBadge = (action: string) => {
        const style = "uppercase font-bold text-[10px] px-2 py-0.5 border";
        switch(action) {
            case 'create': return <Badge className={`bg-green-500/10 text-green-500 border-green-500/20 ${style}`}>CREATE</Badge>;
            case 'update': return <Badge className={`bg-blue-500/10 text-blue-500 border-blue-500/20 ${style}`}>UPDATE</Badge>;
            case 'delete': return <Badge className={`bg-red-500/10 text-red-500 border-red-500/20 ${style}`}>DELETE</Badge>;
            case 'login': return <Badge className={`bg-purple-500/10 text-purple-500 border-purple-500/20 ${style}`}>LOGIN</Badge>;
            case 'verify': return <Badge className={`bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/20 ${style}`}>VERIFY</Badge>;
            default: return <Badge variant="outline" className="text-gray-400">OTHER</Badge>;
        }
    };

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.userName?.toLowerCase().includes(search.toLowerCase()) || 
            log.details?.toLowerCase().includes(search.toLowerCase()) ||
            log.entity?.toLowerCase().includes(search.toLowerCase());
        
        const matchesFilter = filterAction === 'all' || log.action === filterAction;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Activity className="w-8 h-8 text-[#ca1f3d]" /> SYSTEM AUDIT LOGS
                    </h1>
                    <p className="text-gray-400">Jejak aktivitas dan keamanan sistem secara real-time.</p>
                </div>
                
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                            placeholder="Cari user, aktivitas..." 
                            className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl focus:border-[#ca1f3d]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <Select value={filterAction} onValueChange={setFilterAction}>
                        <SelectTrigger className="w-[140px] bg-[#151515] border-white/10 text-white rounded-xl">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                            <SelectItem value="all">Semua Aksi</SelectItem>
                            <SelectItem value="create">Create</SelectItem>
                            <SelectItem value="update">Update</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                            <SelectItem value="login">Login</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Logs Table */}
            <Card className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12 text-gray-500">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : filteredLogs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#1A1A1A] text-xs uppercase text-gray-500 font-bold border-b border-white/5">
                                <tr>
                                    <th className="p-6">Timestamp</th>
                                    <th className="p-6">User (Actor)</th>
                                    <th className="p-6">Action</th>
                                    <th className="p-6">Entity</th>
                                    <th className="p-6 w-1/3">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6 text-sm text-gray-400 font-mono">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {new Date(log.createdAt).toLocaleString('id-ID', {
                                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8 border border-white/10">
                                                    <AvatarFallback className="bg-[#222] text-xs font-bold text-white">
                                                        {log.userName?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{log.userName}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase">{log.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <FileText className="w-4 h-4 text-[#ffbe00]" />
                                                {log.entity}
                                                <span className="text-[10px] text-gray-600 bg-black px-1 rounded ml-1 font-mono">
                                                    #{log.entityId?.substring(0, 4)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-sm text-gray-400">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-bold">Tidak ada log aktivitas ditemukan.</h3>
                        <p className="text-gray-600 text-sm">Sistem belum mencatat aktivitas apapun.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
