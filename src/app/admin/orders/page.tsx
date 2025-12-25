
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
        case 'New': return 'bg-blue-50 text-bad-blue animate-pulse';
        case 'Pending Pay': return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
        case 'Done': return 'bg-gray-100 text-gray-500';
        default: return 'bg-green-50 text-bad-green';
    }
};

const getPriceDisplay = (qty: number) => {
    const paidQty = Math.max(0, qty - 1);
    const totalBill = paidQty * 150000;

    if (totalBill === 0) {
        return <span className="inline-block px-3 py-1 rounded-lg bg-green-50 text-bad-green font-black text-xs border border-green-200">FREE CLAIM</span>;
    } else {
        return (
            <div className="flex flex-col">
                <span className="text-bad-dark font-black">Rp {totalBill.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-gray-400 font-bold">1 Free + {paidQty} Paid</span>
            </div>
        );
    }
}


export default function JerseyOrdersPage() {
    return (
        <main>
             <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-5xl font-black text-bad-dark tracking-tighter mb-1">Incoming Orders</h1>
                    <p className="text-gray-500 font-medium">Daftar klaim Jersey Season 1 (Public & Member).</p>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="outline" className="px-5 py-2.5 rounded-full text-sm font-bold bg-white hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter Status
                    </Button>
                    <Button className="px-5 py-2.5 rounded-full text-sm font-bold bg-bad-green/10 text-bad-green border border-bad-green/20 hover:bg-bad-green hover:text-white flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                    </Button>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Claims</p>
                    <p className="text-4xl font-black text-bad-dark">42 <span className="text-sm text-gray-400 font-medium">Pcs</span></p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Perlu Pembayaran</p>
                    <p className="text-4xl font-black text-bad-red">5 <span className="text-sm text-gray-400 font-medium">Orang (Extra Qty)</span></p>
                </div>
                <div className="bg-bad-dark text-white p-6 rounded-[2rem] shadow-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Potential Revenue</p>
                    <p className="text-4xl font-black text-bad-yellow">Rp 750.000</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <div className="col-span-3">Pemesan</div>
                    <div className="col-span-2">Ukuran & Qty</div>
                    <div className="col-span-3">Tagihan</div>
                    <div className="col-span-2">Kontak</div>
                    <div className="col-span-2 text-right">Status</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {orders.map(order => (
                        <div key={order.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-gray-50 transition group">
                            <div className="col-span-3 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-bad-dark text-white flex items-center justify-center font-bold text-xs shadow-md">
                                    {order.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-bad-dark text-lg leading-none">{order.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{order.time}</p>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-sm border border-gray-200">{order.size}</span>
                                    <span className="text-xs font-bold text-gray-500">x {order.qty} Pcs</span>
                                </div>
                            </div>
                            <div className="col-span-3">
                                {getPriceDisplay(order.qty)}
                            </div>
                             <div className="col-span-2">
                                <a href={`https://wa.me/${order.wa.replace(/^0/, '62')}?text=Halo ${order.name}, konfirmasi pesanan Jersey BadminTour...`} target="_blank" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-bad-green transition">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                        <span>Hubungi WA</span>
                                    </a>
                                </div>
                            <div className="col-span-2 text-right">
                                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                                <button className="block w-full mt-2 text-[10px] font-bold text-gray-300 hover:text-bad-dark underline text-right">Update</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </main>
    )
}
