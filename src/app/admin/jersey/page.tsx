'use client';

import { useEffect, useState } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Shirt, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminJerseyPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/admin/jersey');
                if (res.ok) {
                    const data = await res.json();
                    if(data.success) setOrders(data.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => 
        (order.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
        (order.fullName || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-white">
                        <Shirt className="w-8 h-8 text-[#ca1f3d]" /> Jersey Orders
                    </h1>
                    <p className="text-gray-400">Manage pre-orders dan status pengambilan.</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Cari Order ID / Nama..." 
                        className="pl-10 bg-[#1A1A1A] border-white/10 rounded-xl text-white h-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="bg-[#151515] border-white/10 rounded-[2rem] overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/5 hover:bg-white/5">
                        <TableRow className="border-white/5">
                            <TableHead className="text-gray-400 font-bold uppercase text-xs">Order ID</TableHead>
                            <TableHead className="text-gray-400 font-bold uppercase text-xs">Customer</TableHead>
                            <TableHead className="text-gray-400 font-bold uppercase text-xs">Details</TableHead>
                            <TableHead className="text-gray-400 font-bold uppercase text-xs">Total</TableHead>
                            <TableHead className="text-gray-400 font-bold uppercase text-xs">Status</TableHead>
                            <TableHead className="text-gray-400 font-bold uppercase text-xs">Pickup</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center"><Loader2 className="animate-spin text-[#ca1f3d]"/></div>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                    <TableCell className="font-mono font-bold text-[#ffbe00]">{order.orderId}</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-white">{order.fullName}</div>
                                        <div className="text-xs text-gray-500">{order.senderPhone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-gray-300">
                                            Size: <b>{order.size}</b> | Qty: {order.quantity} | "{order.backName || '-'}"
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-white">Rp {order.totalPrice.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500/10 text-green-500 border-0 uppercase text-[10px] font-bold">
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant="outline" className={`text-[10px] font-bold ${order.pickupStatus === 'picked_up' ? 'text-green-500 border-green-500/50' : 'text-gray-500 border-gray-500/50'}`}>
                                            {order.pickupStatus === 'picked_up' ? 'DONE' : 'PENDING'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </main>
    );
}
