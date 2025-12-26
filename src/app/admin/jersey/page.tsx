'use client';

import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Shirt, 
    Search, 
    Filter, 
    MoreHorizontal, 
    CheckCircle2, 
    Clock, 
    Truck, 
    XCircle,
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
    fullName?: string;    // Backwards compatibility
    senderName?: string;  // New standard
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
                fetchOrders(); // Refresh data
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
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-10 font-sans text-white">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-1">
                        JERSEY <span className="text-[#ffbe00]">MANAGER</span>
                    </h1>
                    <p className="text-gray-400">Pantau produksi, pembayaran, dan pengiriman Season 1.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchOrders} className="border-white/10 hover:bg-white/10 text-white rounded-xl">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                    <Button className="bg-[#ca1f3d] hover:bg-[#a01830] text-white rounded-xl font-bold">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatsCard title="Total Pesanan" value={stats.total} icon={LayoutDashboard} color="text-white" />
                <StatsCard title="Estimasi Revenue" value={`Rp ${stats.revenue.toLocaleString('id-ID')}`} icon={CheckCircle2} color="text-[#ffbe00]" />
                <StatsCard title="Menunggu Bayar" value={stats.pending} icon={Clock} color="text-yellow-500" />
                <StatsCard title="Terkirim / Selesai" value={stats.shipped} icon={Truck} color="text-green-500" />
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Cari nama pemesan, nama punggung, atau No WA..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#151515] border-white/10 pl-10 h-12 rounded-xl text-white focus:border-[#ffbe00]" 
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
                                : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE LIST */}
            <div className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/20 text-gray-400 uppercase text-xs font-bold tracking-wider">
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
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.type === 'MEMBER' ? 'bg-[#ffbe00]/10 text-[#ffbe00]' : 'bg-gray-800 text-gray-400'}`}>
                                                    {order.type === 'MEMBER' ? <User className="w-5 h-5"/> : <Users className="w-5 h-5"/>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-base">{order.senderName || order.fullName}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] border-white/10 text-gray-500">{order.type}</Badge>
                                                        <span className="text-xs text-gray-500">{new Date(order.orderedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Shirt className="w-4 h-4 text-[#ca1f3d]" />
                                                    <span className="font-black text-white tracking-widest uppercase">{order.backName}</span>
                                                </div>
                                                <div className="flex gap-2 text-xs text-gray-400 pl-6">
                                                    <span>Size: <strong className="text-white">{order.size}</strong></span>
                                                    <span>•</span>
                                                    <span>Qty: <strong className="text-white">{order.quantity || 1}</strong></span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-mono text-gray-300">{order.senderPhone}</p>
                                            <a href={`https://wa.me/${order.senderPhone.replace(/^0/, '62')}`} target="_blank" className="text-[10px] text-[#ffbe00] hover:underline">Chat WA</a>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white">
                                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'paid')}>Mark as Paid</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'processing')}>Mark as Processing</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'shipped')}>Mark as Shipped</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'cancelled')} className="text-red-500">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <Search className="w-12 h-12 mb-4 text-gray-600" />
                                            <p className="text-xl font-bold text-gray-400">Belum ada pesanan</p>
                                            <p className="text-sm text-gray-600">Coba ubah filter atau tunggu pesanan masuk.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
    return (
        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
                        <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl">
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                </div>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-2xl ${color.replace('text-', 'bg-')}`}></div>
        </Card>
    );
}
