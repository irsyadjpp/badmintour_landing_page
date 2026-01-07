
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
    Users,
    DatabaseZap // <--- Import Icon
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

// Tipe Data Updated
type Order = {
    id: string;
    orderId?: string; // Tambahkan optional
    type: 'MEMBER' | 'GUEST';
    realUserId?: string;
    fullName?: string;
    senderName?: string;
    backName: string;
    size: string;
    senderPhone: string;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    quantity: number;
    totalPrice?: number; // Tandai sebagai optional
    orderedAt: string;
};

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

// ... imports ...

export default function AdminJerseyPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient(); // Init Client
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [migrating, setMigrating] = useState(false);

    // 1. INFINITE QUERY FETCHING
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch
    } = useInfiniteQuery({
        queryKey: ['admin', 'jersey-orders'],
        queryFn: async ({ pageParam = undefined }) => {
            const url = new URL('/api/admin/jersey', window.location.origin);
            url.searchParams.set('limit', '50');
            if (pageParam) url.searchParams.set('cursor', pageParam as string);

            const res = await fetch(url.toString());
            const json = await res.json();
            // Adjust structure if API returns pure array or object
            // Our API returns { success: true, data: [...], meta: { cursor, hasMore } }
            return json;
        },
        getNextPageParam: (lastPage) => lastPage.meta?.hasMore ? lastPage.meta.cursor : undefined,
        initialPageParam: undefined,
        // Keep data fresh longer to avoid flickering during simple updates unless explicitly invalidated
        staleTime: 1000 * 60 * 5,
    });

    const orders = data?.pages.flatMap(page => page.data || []) || [];

    // 0. MIGRATE HANDLER
    const handleMigrate = async () => {
        if (!confirm("Start data migration from jersey_orders to orders?")) return;
        setMigrating(true);
        try {
            const res = await fetch('/api/system/migrate-orders', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                toast({ title: "Migration Log", description: data.message, className: "bg-blue-600 text-white" });
                refetch(); // Refresh list
            } else {
                throw new Error(data.error || "Migration failed");
            }
        } catch (error: any) {
            toast({ title: "Migration Error", description: error.message, variant: "destructive" });
        } finally {
            setMigrating(false);
        }
    };

    // 2. UPDATE STATUS
    const handleUpdateStatus = async (order: Order, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/jersey', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: order.id,
                    status: newStatus
                })
            });

            if (res.ok) {
                toast({ title: "Status Updated", description: `Pesanan diubah menjadi ${newStatus}`, className: "bg-green-600 text-white border-none" });
                // Optimistic update or Refetch
                // For simplicity, refetch. (Ideally optimize by updating cache directly)
                queryClient.invalidateQueries({ queryKey: ['admin', 'jersey-orders'] });
            }
        } catch (error) {
            toast({ title: "Gagal Update", variant: "destructive" });
        }
    };

    // 3. FILTERING (Client-Side on Loaded Data)
    const filteredOrders = orders.filter((order: Order) => {
        const name = order.senderName || order.fullName || "No Name";
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.backName && order.backName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.senderPhone && order.senderPhone.includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // We display ALL filtered orders (Infinite Scroll style), no sub-pagination slice using 'currentPage'
    const currentOrders = filteredOrders;


    // 4. STATS CALCULATION (Safe Calculation)
    const stats = {
        total: orders.length,
        revenue: orders.reduce((acc, curr) => {
            // Gunakan totalPrice jika ada, atau hitung manual sebagai fallback
            const price = curr.totalPrice !== undefined
                ? curr.totalPrice
                : (Math.max(0, (curr.quantity || 1) - 1) * 150000);
            return acc + price;
        }, 0),
        pending: orders.filter(o => o.status === 'pending').length,
        shipped: orders.filter(o => o.status === 'shipped' || o.status === 'completed').length
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'shipped': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    // 5. EDIT LOGIC
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editForm, setEditForm] = useState({
        fullName: '',
        backName: '',
        size: '',
        senderPhone: ''
    });

    const [generatedOptions, setGeneratedOptions] = useState({ A: '', B: '' });
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    // Logic Generate Options (Copied from Jersey Request Page)
    const generateOptions = (name: string) => {
        if (!name) return { A: '', B: '' };
        const cleanName = name.trim().toUpperCase().replace(/[^A-Z\s]/g, '');
        const parts = cleanName.split(/\s+/).filter(p => p.length > 0);
        if (parts.length === 0) return { A: '', B: '' };
        if (parts.length === 1) {
            return { A: parts[0], B: parts[0] };
        }
        const first = parts[0];
        const initialsTail = parts.slice(1).map(p => p[0]).join(' ');
        let optionA = `${first} ${initialsTail}`.trim();
        const last = parts[parts.length - 1];
        const initialsHead = parts.slice(0, parts.length - 1).map(p => p[0]).join(' ');
        let optionB = `${initialsHead} ${last}`.trim();
        if (optionA.length > 12) optionA = optionA.replace(/\s/g, '').slice(0, 12);
        if (optionB.length > 12) optionB = optionB.replace(/\s/g, '').slice(0, 12);
        return { A: optionA, B: optionB };
    };

    // Update options when Full Name changes in Edit Form
    useEffect(() => {
        if (isEditOpen && editForm.fullName) {
            setGeneratedOptions(generateOptions(editForm.fullName));
        }
    }, [editForm.fullName, isEditOpen]);

    const openEditModal = (order: Order) => {
        setEditingOrder(order);
        const currentFullName = order.fullName || order.senderName || '';
        setEditForm({
            fullName: currentFullName,
            backName: order.backName || '',
            size: order.size || 'L',
            senderPhone: order.senderPhone || ''
        });
        setGeneratedOptions(generateOptions(currentFullName));
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;

        try {
            const res = await fetch('/api/admin/jersey', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingOrder.id,
                    ...editForm
                })
            });

            if (res.ok) {
                toast({ title: "Sukses", description: "Data pesanan berhasil diperbarui!", className: "bg-green-600 text-white" });
                setIsEditOpen(false);
                queryClient.invalidateQueries({ queryKey: ['admin', 'jersey-orders'] });
            } else {
                throw new Error("Gagal update");
            }
        } catch (error) {
            toast({ title: "Error", description: "Gagal menyimpan perubahan.", variant: "destructive" });
        }
    };

    return (
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
                    <Button
                        variant="outline"
                        onClick={handleMigrate}
                        disabled={migrating}
                        className="border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-xl"
                    >
                        <DatabaseZap className={`w-4 h-4 mr-2 ${migrating ? 'animate-pulse' : ''}`} />
                        {migrating ? 'Migrating...' : 'Migrate Data'}
                    </Button>
                    <Button variant="outline" onClick={() => refetch()} className="border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl">
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
                <StatsCard title="Picked Up" value={stats.shipped} icon={Truck} color="text-green-500" />
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Cari nama pemesan, nama punggung, atau No WA..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#151515] border-white/10 pl-10 h-12 rounded-xl text-white placeholder:text-gray-500 focus:border-[#ffbe00] focus:ring-0"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'pending', 'paid', 'processing', 'shipped'].map((status) => {
                        // Helper Label
                        let label = status;
                        if (status === 'all') label = 'Semua';
                        if (status === 'shipped') label = 'Picked Up';

                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-6 h-12 rounded-xl text-sm font-bold uppercase transition-all whitespace-nowrap border ${statusFilter === status
                                    ? 'bg-[#ffbe00] text-black border-[#ffbe00]'
                                    : 'bg-[#151515] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TABLE CARD */}
            <Card className="bg-[#151515] border-white/5 rounded-[1.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold tracking-wider border-b border-white/5">
                            <tr>
                                <th className="p-6">Pemesan</th>
                                <th className="p-6">Detail Jersey</th>
                                <th className="p-6">Kontak</th>
                                <th className="p-6">Total</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${order.type === 'MEMBER' ? 'bg-[#ffbe00]/10 text-[#ffbe00]' : 'bg-white/5 text-gray-400'}`}>
                                                    {order.type === 'MEMBER' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-base tracking-tight">{order.senderName || order.fullName}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] border-white/10 text-gray-500">{order.type}</Badge>
                                                        <span className="text-xs text-gray-500 font-mono pt-0.5">{order.orderId || order.id?.substring(0, 8)}</span>
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
                                            <a href={`https://wa.me/${order.senderPhone?.replace(/^0/, '62')}`} target="_blank" className="text-xs font-bold text-[#ffbe00] hover:underline flex items-center gap-1 mt-1">
                                                Chat WA <ArrowUpRightMini />
                                            </a>
                                        </td>
                                        {/* FIX: Handle Undefined totalPrice */}
                                        <td className="p-6 font-bold text-white">
                                            Rp {(order.totalPrice || 0).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase border tracking-wide ${getStatusColor(order.status)}`}>
                                                {order.status === 'shipped' ? 'Picked Up' : order.status}
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
                                                    <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider">Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => openEditModal(order)} className="focus:bg-white/10 cursor-pointer rounded-lg font-medium mb-1">
                                                        Edit Detail
                                                    </DropdownMenuItem>

                                                    <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider mt-2">Update Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'paid')} className="focus:bg-[#ffbe00]/10 focus:text-[#ffbe00] cursor-pointer rounded-lg font-medium">Mark as Paid</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'processing')} className="focus:bg-[#ffbe00]/10 focus:text-[#ffbe00] cursor-pointer rounded-lg font-medium">Mark as Processing</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'shipped')} className="focus:bg-[#ffbe00]/10 focus:text-[#ffbe00] cursor-pointer rounded-lg font-medium">Mark as Picked Up</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order, 'cancelled')} className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer rounded-lg font-medium">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-24 text-center">
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

            {/* PAGINATION CONTROLS */}
            {/* LOAD MORE / FOOTER */}
            <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-sm text-gray-500">
                    Menampilkan <span className="text-white font-bold">{filteredOrders.length}</span> pesanan
                    {orders.length > filteredOrders.length && <span> (dari {orders.length} terambil)</span>}
                </p>

                {hasNextPage && (
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        variant="outline"
                        className="rounded-full px-8 border-white/10 hover:bg-white/10 text-white"
                    >
                        {isFetchingNextPage ? (
                            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Memuat...</>
                        ) : (
                            <>Tampilkan Lebih Banyak</>
                        )}
                    </Button>
                )}
            </div>

            {/* EDIT DIALOG */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <form onSubmit={handleEditSubmit} className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                        {/* HEADER */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold text-white">Edit Pesanan</h3>
                            <button type="button" onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                                <Input
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value.toUpperCase() })}
                                    className="bg-[#151515] border-white/10 text-white focus:border-[#ffbe00]"
                                    required
                                />
                            </div>

                            {/* NEW BACK NAME LOGIC */}
                            <div className="bg-[#151515] p-4 rounded-xl border border-white/10 space-y-3">
                                <label className="text-xs font-bold text-[#ffbe00] uppercase tracking-wider flex items-center gap-2">Pilih Nama Punggung</label>

                                <div onClick={() => setEditForm({ ...editForm, backName: generatedOptions.A })} className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between group ${editForm.backName === generatedOptions.A ? "border-[#ffbe00] bg-[#ffbe00]/10" : "border-white/5 bg-black/20 hover:border-white/20"}`}>
                                    <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 1</p><p className="text-lg font-black text-white tracking-widest">{generatedOptions.A || "..."}</p></div>
                                    {editForm.backName === generatedOptions.A && <div className="w-5 h-5 rounded-full bg-[#ffbe00] flex items-center justify-center text-black"><CheckCircle2 className="w-3 h-3" /></div>}
                                </div>

                                <div onClick={() => setEditForm({ ...editForm, backName: generatedOptions.B })} className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between group ${editForm.backName === generatedOptions.B ? "border-[#ffbe00] bg-[#ffbe00]/10" : "border-white/5 bg-black/20 hover:border-white/20"}`}>
                                    <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 2</p><p className="text-lg font-black text-white tracking-widest">{generatedOptions.B || "..."}</p></div>
                                    {editForm.backName === generatedOptions.B && <div className="w-5 h-5 rounded-full bg-[#ffbe00] flex items-center justify-center text-black"><CheckCircle2 className="w-3 h-3" /></div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ukuran</label>
                                        <button type="button" onClick={() => setIsSizeChartOpen(true)} className="text-[10px] font-bold text-[#ffbe00] hover:text-white hover:underline">Lihat Chart</button>
                                    </div>
                                    <select
                                        value={editForm.size}
                                        onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md bg-[#151515] border border-white/10 text-white focus:outline-none focus:border-[#ffbe00]"
                                    >
                                        {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No HP</label>
                                    <Input
                                        value={editForm.senderPhone}
                                        onChange={(e) => setEditForm({ ...editForm, senderPhone: e.target.value.replace(/\D/g, '') })}
                                        className="bg-[#151515] border-white/10 text-white focus:border-[#ffbe00]"
                                        required
                                        type="tel"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-6 border-t border-white/5 bg-[#1a1a1a] flex gap-3 shrink-0">
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="flex-1 text-gray-400 hover:text-white hover:bg-white/5">Batal</Button>
                            <Button type="submit" className="flex-1 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-bold">Simpan</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* SIZE CHART MODAL */}
            {isSizeChartOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setIsSizeChartOpen(false)}>
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
                    <div className="bg-[#1A1A1A] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#ffbe00] p-6 flex justify-between items-center">
                            <h3 className="text-black font-black text-2xl uppercase tracking-tighter">📏 Size Chart</h3>
                            <button onClick={() => setIsSizeChartOpen(false)} className="text-black bg-black/10 p-2 rounded-full hover:bg-black/20"><span className="sr-only">Close</span>✕</button>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-400 mb-6 text-center uppercase tracking-widest font-bold">Unisex Regular Fit (CM)</p>
                            <div className="space-y-2">
                                <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">S</span> <span className="text-white">47 x 67</span></div>
                                <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">M</span> <span className="text-white">50 x 70</span></div>
                                <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">L</span> <span className="text-white">52 x 72</span></div>
                                <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">XL</span> <span className="text-white">54 x 74</span></div>
                                <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">XXL</span> <span className="text-white">56 x 77</span></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 text-center">*Lebar Dada x Panjang Badan</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- HELPER COMPONENTS ---

function StatsCard({ title, value, icon: Icon, color }: any) {
    return (
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
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-5 blur-3xl ${color.replace('text-', 'bg-')}`}></div>
        </Card>
    );
}

function ArrowUpRightMini() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
    )
}
