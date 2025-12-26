'use client';

import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Shirt, 
    Search, 
    MoreHorizontal, 
    CheckCircle2, 
    Clock, 
    Truck, 
    Download,
    RefreshCw,
    User,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Tipe Data
type Order = {
    id: string;
    type: 'MEMBER' | 'GUEST';
    realUserId?: string;
    fullName?: string;    
    senderName?: string;  
    backName: string;
    size: string;
    senderPhone: string;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    quantity: number;
    orderedAt: string;
};

export default function AdminJerseyPage() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // 1. FETCH DATA
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/jersey');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            toast({ title: "Error", description: "Gagal mengambil data pesanan.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 2. UPDATE STATUS
    const handleUpdateStatus = async (order: Order, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/jersey', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: order.id,
                    type: order.type,
                    realUserId: order.realUserId,
                    status: newStatus
                })
            });
            
            if (res.ok) {
                toast({ title: "Status Updated", description: `Pesanan diubah menjadi ${newStatus}`, className: "bg-green-600 text-white border-none" });
                fetchOrders(); 
            }
        } catch (error) {
            toast({ title: "Gagal Update", variant: "destructive" });
        }
    };

    // 3. FILTERING
    const filteredOrders = orders.filter(order => {
        const name = order.senderName || order.fullName || "No Name";
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              order.backName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              order.senderPhone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 4. STATS CALCULATION
    const stats = {
        total: orders.length,
        revenue: orders.reduce((acc, curr) => acc + (Math.max(0, (curr.quantity || 1) - 1) * 150000), 0),
        pending: orders.filter(o => o.status === 'pending').length,
        shipped: orders.filter(o => o.status === 'shipped' || o.status === 'completed').length
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'; 
            case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'shipped': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        // REVISI: Hapus bg-color hardcoded. Gunakan space-y-8 untuk layouting.
        <div className="space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white">
                        Jersey Manager
                    </h1>
                    <p className="text-gray-400">Pantau produksi, pembayaran, dan pengiriman Season 1.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchOrders} className="border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                    <Button className="bg-[#ca1f3d] hover:bg-[#a01830] text-white rounded-xl font-bold shadow-lg shadow-[#ca1f3d]/20">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Pesanan" value={stats.total} icon={LayoutDashboard} color="text-white" />
                <StatsCard title="Estimasi Revenue" value={`Rp ${stats.revenue.toLocaleString('id-ID')}`} icon={CheckCircle2} color="text-[#ffbe00]" />
                <StatsCard title="Menunggu Bayar" value={stats.pending} icon={Clock} color="text-yellow-500" />
                <StatsCard title="Terkirim / Selesai" value={stats.shipped} icon={Truck} color="text-green-500" />
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Cari nama pemesan, nama punggung, atau No WA..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        // REVISI: Background transparan/gelap sesuai tema card admin lain
                        className="bg-[#151515] border-white/10 pl-10 h-12 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ffbe00] focus:ring-0" 
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'pending', 'paid', 'processing', 'shipped'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 h-12 rounded-xl text-sm font-bold uppercase transition-all whitespace-nowrap border ${
                                statusFilter === status 
                                ? 'bg-[#ffbe00] text-black border-[#ffbe00]' 
                                : 'bg-[#151515] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE CARD */}
            {/* REVISI: Gunakan bg-[#151515] agar sama dengan halaman admin lain */}
            <Card className="bg-[#151515] border-white/5 rounded-[1.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold tracking-wider border-b border-white/5">
                            <tr>
                                <th className="p-6">Pemesan</th>
                                <th className="p-6">Detail Jersey</th>
                                <th className="p-6">Kontak</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${order.type === 'MEMBER' ? 'bg-[#ffbe00]/10 text-[#ffbe00]' : 'bg-white/5 text-gray-400'}`}>
                                                    {order.type === 'MEMBER' ? <User className="w-5 h-5"/> : <Users className="w-5 h-5"/>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-base tracking-tight">{order.senderName || order.fullName}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] border-white/10 text-gray-500">{order.type}</Badge>
                                                        <span className="text-xs text-gray-500 font-mono pt-0.5">{new Date(order.orderedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Shirt className="w-4 h-4 text-[#ca1f3d]" />
                                                    <span className="font-black text-white tracking-widest uppercase text-lg">{order.backName}</span>
                                                </div>
                                                <div className="flex gap-2 text-xs text-gray-400 pl-6">
                                                    <span>Size: <strong className="text-white">{order.size}</strong></span>
                                                    <span className="text-gray-600">|</span>
                                                    <span>Qty: <strong className="text-white">{order.quantity || 1}</strong></span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-mono text-gray-300 font-medium">{order.senderPhone}</p>
                                            <a href={`https://wa.me/${order.senderPhone.replace(/^0/, '62')}`} target="_blank" className="text-xs font-bold text-[#ffbe00] hover:underline flex items-center gap-1 mt-1">
                                                Chat WA <ArrowUpRightMini />
                                            </a>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase border tracking-wide ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-white/10 text-gray-400 hover:text-white rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white p-2 rounded-xl shadow-xl">
                                                    <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider">Update Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'paid')} className="focus:bg-[#ffbe00]/10 focus:text-[#ffbe00] cursor-pointer rounded-lg font-medium">Mark as Paid</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'processing')} className="focus:bg-[#ffbe00]/10 focus:text-[#ffbe00] cursor-pointer rounded-lg font-medium">Mark as Processing</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'shipped')} className="focus:bg-[#ffbe00]/10 focus:text-[#ffbe00] cursor-pointer rounded-lg font-medium">Mark as Shipped</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'cancelled')} className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer rounded-lg font-medium">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <Search className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-xl font-bold text-white mb-2">Belum ada pesanan</p>
                                            <p className="text-sm text-gray-400">Coba ubah filter atau tunggu pesanan masuk.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

// --- HELPER COMPONENTS ---

function StatsCard({ title, value, icon: Icon, color }: any) {
    return (
        // REVISI: Gunakan Card dengan bg-[#151515] agar konsisten
        <Card className="bg-[#151515] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
                        <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
            </div>
            {/* Subtle glow effect */}
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-5 blur-3xl ${color.replace('text-', 'bg-')}`}></div>
        </Card>
    );
}

function ArrowUpRightMini() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17l9.2-9.2M17 17V7H7"/>
        </svg>
    )
}
