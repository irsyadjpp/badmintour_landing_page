'use client';
import { Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const orders = [
    { id: 'ORD-001', name: 'Kevin.S', time: '10 mins ago', size: 'L', qty: 1, wa: '081234567890', status: 'New' },
    { id: 'ORD-002', name: 'Budi.J', time: '1 hour ago', size: 'XL', qty: 2, wa: '081999887766', status: 'Pending Pay' },
    { id: 'ORD-003', name: 'Siti.A', time: '2 hours ago', size: 'M', qty: 1, wa: '085712345678', status: 'Process' },
    { id: 'ORD-004', name: 'Doni.R', time: 'Yesterday', size: 'XXL', qty: 3, wa: '081344556677', status: 'Paid' },
    { id: 'ORD-005', name: 'Rina.M', time: 'Yesterday', size: 'S', qty: 1, wa: '081122334455', status: 'Done' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'New': return 'bg-bad-blue/20 text-bad-blue animate-pulse border border-bad-blue/20';
        case 'Pending Pay': return 'bg-bad-yellow/10 text-bad-yellow border border-bad-yellow/20';
        case 'Done': return 'bg-white/10 text-gray-400 border border-white/5';
        default: return 'bg-bad-green/10 text-bad-green border border-bad-green/20';
    }
};

const getPriceDisplay = (qty: number) => {
    const paidQty = Math.max(0, qty - 1);
    const totalBill = paidQty * 150000;

    if (totalBill === 0) {
        return <span className="inline-block px-3 py-1 rounded-lg bg-bad-green/10 text-bad-green font-black text-[10px] border border-bad-green/20 uppercase tracking-wider">FREE CLAIM</span>;
    } else {
        return (
            <div className="flex flex-col">
                <span className="text-white font-jersey text-lg">Rp {totalBill.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-gray-500 font-bold">1 Free + {paidQty} Paid</span>
            </div>
        );
    }
}


export default function JerseyOrdersPage() {
    return (
        <main>
             <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-1">Incoming Orders</h1>
                    <p className="text-gray-400 font-medium">Daftar klaim Jersey Season 1 (Public & Member).</p>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="outline" className="px-5 py-2.5 rounded-full text-xs font-bold bg-transparent border-white/20 text-white hover:bg-white/10 flex items-center gap-2 h-auto">
                        <Filter className="w-4 h-4" />
                        Filter Status
                    </Button>
                    <Button className="px-5 py-2.5 rounded-full text-xs font-bold bg-bad-green text-black hover:bg-green-400 flex items-center gap-2 h-auto shadow-[0_0_15px_rgba(74,222,128,0.4)]">
                        <Download className="w-4 h-4" />
                        Export Data
                    </Button>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1A1A1A] p-6 rounded-[2rem] border border-white/5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Claims</p>
                    <p className="text-5xl font-jersey text-white">42 <span className="text-sm text-gray-500 font-sans font-medium">Pcs</span></p>
                </div>
                <div className="bg-[#1A1A1A] p-6 rounded-[2rem] border border-white/5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Perlu Pembayaran</p>
                    <p className="text-5xl font-jersey text-bad-red">5 <span className="text-sm text-gray-500 font-sans font-medium">Orang</span></p>
                </div>
                <div className="bg-[#121212] border border-bad-yellow/20 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-bad-yellow/20 rounded-full blur-[40px]"></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Potential Revenue</p>
                    <p className="text-5xl font-jersey text-bad-yellow relative z-10">Rp 750.000</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 bg-[#151515] text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <div className="col-span-3">Pemesan</div>
                    <div className="col-span-2">Ukuran & Qty</div>
                    <div className="col-span-3">Tagihan</div>
                    <div className="col-span-2">Kontak</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                <div className="divide-y divide-white/5">
                    {orders.map(order => (
                        <div key={order.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[#1F1F1F] transition group cursor-default">
                            <div className="col-span-3 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#121212] border border-white/10 text-white flex items-center justify-center font-bold text-xs shadow-md group-hover:border-white/30 transition">
                                    {order.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg leading-none">{order.name}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{order.time}</p>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-[#121212] border border-white/10 text-white flex items-center justify-center font-black text-sm">{order.size}</span>
                                    <span className="text-xs font-bold text-gray-500">x {order.qty} Pcs</span>
                                </div>
                            </div>
                            <div className="col-span-3">
                                {getPriceDisplay(order.qty)}
                            </div>
                             <div className="col-span-2">
                                <a href={`https://wa.me/${order.wa.replace(/^0/, '62')}?text=Halo ${order.name}, konfirmasi pesanan Jersey BadminTour...`} target="_blank" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-bad-green transition">
                                    <div className="w-6 h-6 rounded-full bg-bad-green/10 flex items-center justify-center text-bad-green">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                    </div>
                                    <span>Hubungi WA</span>
                                </a>
                            </div>
                            <div className="col-span-2 text-right">
                                <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </main>
    )
}
