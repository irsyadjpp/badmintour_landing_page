'use client';

import { useState } from 'react';
import { Check, X, Eye, Loader2, Search, ArrowUpRight, DollarSign, Clock, MoreVertical, CreditCard, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// TYPE DEFINITIONS
interface Transaction {
    id: string;
    user: string;
    event: string;
    amount: string;
    date: string;
    status: 'verification_pending' | 'paid' | 'rejected';
    proofImage: string | null;
    paymentMethod: string;
}

export default function AdminTransactionsPage() {
    const { toast } = useToast();
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'rejected'>('all');

    // MOCK DATA
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 'INV-2024-001',
            user: 'Budi Santoso',
            event: 'Mabar Senin Ceria',
            amount: '35.000',
            date: '28 Dec 2024, 10:00',
            status: 'verification_pending',
            proofImage: '/images/hero-bg.jpg',
            paymentMethod: 'BCA Transfer'
        },
        {
            id: 'INV-2024-002',
            user: 'Siti Aminah',
            event: 'Drilling Class Professional',
            amount: '50.000',
            date: '28 Dec 2024, 11:30',
            status: 'paid',
            proofImage: null,
            paymentMethod: 'QRIS'
        },
        {
            id: 'INV-2024-003',
            user: 'Rudi Hartono',
            event: 'Turnamen Lokal',
            amount: '150.000',
            date: '27 Dec 2024, 09:15',
            status: 'rejected',
            proofImage: '/images/hero-bg.jpg',
            paymentMethod: 'Mandiri Transfer'
        },
        {
            id: 'INV-2024-004',
            user: 'Kevin Sanjaya',
            event: 'Mabar Kamis Manis',
            amount: '40.000',
            date: '29 Dec 2024, 14:00',
            status: 'verification_pending',
            proofImage: '/images/hero-bg.jpg',
            paymentMethod: 'BCA Transfer'
        },
    ]);

    // STATS CALCULATION
    const totalRevenue = transactions.filter(t => t.status === 'paid').reduce((acc, curr) => acc + parseInt(curr.amount.replace('.', '')), 0);
    const pendingCount = transactions.filter(t => t.status === 'verification_pending').length;
    const totalTransactions = transactions.length;

    // FILTER LOGIC
    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.event.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'pending' && tx.status === 'verification_pending') ||
            (statusFilter === 'paid' && tx.status === 'paid') ||
            (statusFilter === 'rejected' && tx.status === 'rejected');
        return matchesSearch && matchesStatus;
    });

    const handleVerify = async (id: string, action: 'approve' | 'reject') => {
        setProcessing(true);
        // Simulate API Call
        setTimeout(() => {
            setTransactions(prev => prev.map(t =>
                t.id === id ? { ...t, status: action === 'approve' ? 'paid' : 'rejected' } : t
            ));

            toast({
                title: action === 'approve' ? "Pembayaran Diterima" : "Pembayaran Ditolak",
                description: `Transaksi ${id} berhasil diperbarui.`
            });

            setSelectedTx(null);
            setProcessing(false);
        }, 1000);
    };

    return (
        <div className="space-y-8 pb-20 fade-in animate-in">
            {/* HEADER & TITLE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase mb-2">
                        Keuangan <span className="text-[#ffbe00]">.</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Monitoring arus kas dan verifikasi pembayaran.</p>
                </div>
                <Button className="bg-[#151515] hover:bg-[#252525] text-white border border-white/10">
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Export Laporan
                </Button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-[#1a1a1a] border-white/5 rounded-3xl relative overflow-hidden group hover:border-[#ffbe00]/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-24 h-24 text-[#ffbe00]" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black text-white">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
                    <div className="mt-4 flex items-center text-xs text-green-500 font-bold bg-green-500/10 w-fit px-2 py-1 rounded">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> +12% vs last month
                    </div>
                </Card>

                <Card className="p-6 bg-[#1a1a1a] border-white/5 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock className="w-24 h-24 text-blue-500" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pending Verification</p>
                    <h3 className="text-3xl font-black text-white">{pendingCount} <span className="text-lg font-medium text-gray-500">Transaksi</span></h3>
                    <div className="mt-4 text-xs text-blue-400 font-bold">
                        Perlu tindakan segera
                    </div>
                </Card>

                <Card className="p-6 bg-[#1a1a1a] border-white/5 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-24 h-24 text-purple-500" />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Transaksi</p>
                    <h3 className="text-3xl font-black text-white">{totalTransactions} <span className="text-lg font-medium text-gray-500">Booking</span></h3>
                    <div className="mt-4 text-xs text-purple-400 font-bold">
                        All time records
                    </div>
                </Card>
            </div>

            {/* MAIN CONTENT CARD */}
            <Card className="bg-[#151515] border border-white/10 overflow-hidden rounded-[2rem]">
                {/* TOOLBAR */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        <Button
                            variant="ghost"
                            onClick={() => setStatusFilter('all')}
                            className={`rounded-full px-6 font-bold text-xs uppercase tracking-wider ${statusFilter === 'all' ? 'bg-white text-black hover:bg-gray-200' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            All
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setStatusFilter('pending')}
                            className={`rounded-full px-6 font-bold text-xs uppercase tracking-wider ${statusFilter === 'pending' ? 'bg-[#ffbe00] text-black hover:bg-[#e5ab00]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            Pending
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setStatusFilter('paid')}
                            className={`rounded-full px-6 font-bold text-xs uppercase tracking-wider ${statusFilter === 'paid' ? 'bg-green-500 text-black hover:bg-green-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            Lunas
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setStatusFilter('rejected')}
                            className={`rounded-full px-6 font-bold text-xs uppercase tracking-wider ${statusFilter === 'rejected' ? 'bg-red-500 text-white hover:bg-red-600' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            Ditolak
                        </Button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Cari ID / Nama..."
                            className="bg-[#0a0a0a] border-white/10 pl-10 text-white focus:border-[#ffbe00] h-10 rounded-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0a0a] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
                            <tr>
                                <th className="p-6">ID Transaksi</th>
                                <th className="p-6">Member / Event</th>
                                <th className="p-6">Metode</th>
                                <th className="p-6">Tanggal</th>
                                <th className="p-6">Nominal</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6 font-mono text-sm text-gray-400 group-hover:text-[#ffbe00] transition-colors">
                                        {tx.id}
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-white mb-1">{tx.user}</div>
                                        <div className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded w-fit">{tx.event}</div>
                                    </td>
                                    <td className="p-6 text-sm text-gray-400">
                                        {tx.paymentMethod}
                                    </td>
                                    <td className="p-6 text-sm text-gray-400">
                                        {tx.date}
                                    </td>
                                    <td className="p-6">
                                        <span className="font-black text-white text-lg">Rp {tx.amount}</span>
                                    </td>
                                    <td className="p-6">
                                        {tx.status === 'verification_pending' && <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/30">Pending</Badge>}
                                        {tx.status === 'paid' && <Badge className="bg-green-500/20 text-green-500 border-green-500/50 hover:bg-green-500/30">Lunas</Badge>}
                                        {tx.status === 'rejected' && <Badge className="bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30">Ditolak</Badge>}
                                    </td>
                                    <td className="p-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white">
                                                <DropdownMenuItem onClick={() => setSelectedTx(tx)} className="focus:bg-white/10 cursor-pointer">
                                                    <Eye className="mr-2 h-4 w-4" /> Detail Transaksi
                                                </DropdownMenuItem>
                                                {tx.status === 'verification_pending' && (
                                                    <DropdownMenuItem onClick={() => setSelectedTx(tx)} className="focus:bg-[#ffbe00]/20 text-[#ffbe00] focus:text-[#ffbe00] cursor-pointer">
                                                        <Check className="mr-2 h-4 w-4" /> Verifikasi Sekarang
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTransactions.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Tidak ada transaksi yang ditemukan.</p>
                        </div>
                    )}
                </div>

                {/* PAGINATION (STATIC FOR NOW) */}
                <div className="p-6 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <div>Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} entries</div>
                    <div className="flex gap-2">
                        <Button disabled size="sm" variant="ghost" className="text-gray-500">Previous</Button>
                        <Button disabled size="sm" variant="ghost" className="text-gray-500">Next</Button>
                    </div>
                </div>
            </Card>

            {/* MODAL VERIFIKASI */}
            <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
                <DialogContent className="max-w-4xl bg-[#1A1A1A] border-white/10 p-0 overflow-hidden rounded-[2rem] text-white">
                    <DialogTitle className="sr-only">Detail Transaksi</DialogTitle>
                    <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
                        {/* Kiri: Gambar Bukti */}
                        <div className="flex-1 bg-black relative min-h-[400px] flex items-center justify-center border-r border-white/10 p-4">
                            {selectedTx?.proofImage ? (
                                <div className="relative w-full h-full min-h-[300px]">
                                    <Image
                                        src={selectedTx.proofImage}
                                        alt="Bukti Bayar"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <div className="bg-white/5 rounded-full p-6 w-fit mx-auto mb-4"><CameraOff className="w-8 h-8" /></div>
                                    <p>Tidak ada bukti gambar</p>
                                </div>
                            )}
                            <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white border-white/10">ID: {selectedTx?.id}</Badge>
                        </div>

                        {/* Kanan: Detail & Action */}
                        <div className="flex-1 p-8 flex flex-col overflow-y-auto">
                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Verifikasi Transaksi</h3>
                                <p className="text-sm text-gray-400">Pastikan jumlah dan pengirim sesuai mutasi rekening.</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="bg-[#151515] p-4 rounded-xl border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Member</span>
                                        <span className="font-bold text-white text-base">{selectedTx?.user}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Metode</span>
                                        <span className="text-white">{selectedTx?.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Tanggal</span>
                                        <span className="text-white">{selectedTx?.date}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Total Nominal</span>
                                        <span className="font-black text-[#ffbe00] text-2xl">Rp {selectedTx?.amount}</span>
                                    </div>
                                </div>
                                <div className="bg-[#151515] p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Event</p>
                                    <p className="font-bold text-white">{selectedTx?.event}</p>
                                </div>
                            </div>

                            <div className="mt-auto space-y-3">
                                {selectedTx?.status === 'verification_pending' ? (
                                    <>
                                        <Button
                                            onClick={() => selectedTx && handleVerify(selectedTx.id, 'approve')}
                                            disabled={processing}
                                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-12 rounded-xl text-base shadow-[0_4px_20px_-5px_rgba(22,163,74,0.5)]"
                                        >
                                            {processing ? <Loader2 className="animate-spin" /> : <><Check className="w-5 h-5 mr-2" /> TERIMA PEMBAYARAN</>}
                                        </Button>
                                        <Button
                                            onClick={() => selectedTx && handleVerify(selectedTx.id, 'reject')}
                                            disabled={processing}
                                            variant="ghost"
                                            className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold h-12 rounded-xl"
                                        >
                                            <X className="w-5 h-5 mr-2" /> TOLAK TRANSAKSI
                                        </Button>
                                    </>
                                ) : (
                                    <div className={`w-full p-4 rounded-xl text-center font-bold border ${selectedTx?.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                        TRANSAKSI {selectedTx?.status === 'paid' ? 'LUNAS' : 'DITOLAK'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function CameraOff(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="2" x2="22" y1="2" y2="22" />
            <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16" />
            <path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5" />
            <path d="M14.121 15.121A3 3 0 1 1 9.88 10.88" />
        </svg>
    )
}
