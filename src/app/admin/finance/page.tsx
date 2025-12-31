'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, FileText, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { FinanceNav } from '@/components/admin/finance-nav';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// FETCH FUNCTION
const fetchLedger = async () => {
    const res = await fetch('/api/admin/finance/ledger');
    if (!res.ok) throw new Error('Failed to fetch ledger');
    return res.json();
};

export default function FinancePage() {
    // --- MAIN RENDER ---
    const { data: ledgerData, isLoading: isLedgerLoading } = useQuery({ queryKey: ['finance-ledger'], queryFn: fetchLedger, refetchInterval: 5000 });
    const ledgerEntries = ledgerData?.data || [];

    // Simple Calculate Balance (Mock)
    const currentBalance = ledgerEntries.reduce((acc: any, curr: any) => {
        if (curr.category === 'REVENUE') return acc + curr.totalAmount;
        if (curr.category === 'EXPENSE') return acc - curr.totalAmount;
        return acc;
    }, 0);

    return (
        <main>
            <FinanceNav />
            <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-[#ffbe00]" /> FINANCE & LEDGER
                        </h1>
                        <p className="text-gray-400 mt-1">Pusat kendali arus kas dan pembukuan akuntansi.</p>
                    </div>

                    <Link href="/admin/finance/transactions/new">
                        <Button className="bg-[#ffbe00] hover:bg-[#d9a200] text-black font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(255,190,0,0.3)]">
                            <Plus className="w-5 h-5 mr-2" /> BUAT TRANSAKSI BARU
                        </Button>
                    </Link>
                </div>

                {/* --- DASHBOARD WIDGET --- */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-10 mb-8 relative overflow-hidden group">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-bad-green/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-bad-green/10 transition duration-700"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                Est. Saldo Kas (Realtime) <span className="w-2 h-2 rounded-full bg-bad-green animate-pulse"></span>
                            </p>
                            <h2 className="text-6xl md:text-8xl font-jersey text-white tracking-wide">
                                Rp {currentBalance.toLocaleString('id-ID', { notation: 'compact', compactDisplay: 'short' })}
                            </h2>
                        </div>
                        <div className="text-right bg-[#121212] p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Sistem</p>
                            <div className="text-lg font-bold text-white flex items-center gap-2 justify-end"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Online</div>
                        </div>
                    </div>
                </div>

                {/* --- TRANSACTIONS TABLE --- */}
                <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h3 className="font-bold text-xl text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" /> Riwayat Transaksi
                        </h3>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/5">
                        <Table>
                            <TableHeader className="bg-[#1A1A1A]">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest p-4">Tanggal / Ref</TableHead>
                                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest p-4">Deskripsi & Akun</TableHead>
                                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-right p-4">Mutasi (Rp)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-[#121212]">
                                {isLedgerLoading ? (
                                    <TableRow><TableCell colSpan={3} className="h-24 text-center"><Loader2 className="animate-spin mx-auto text-[#ffbe00]" /></TableCell></TableRow>
                                ) : ledgerEntries.length === 0 ? (
                                    <TableRow><TableCell colSpan={3} className="h-24 text-center text-gray-500">Belum ada transaksi.</TableCell></TableRow>
                                ) : (
                                    ledgerEntries.map((trx: any) => (
                                        <TableRow key={trx.id} className="border-white/5 hover:bg-white/5 transition">
                                            <TableCell className="p-4 align-top w-[180px]">
                                                <div className="font-mono text-xs text-white  bg-white/10 px-2 py-1 rounded inline-block mb-1">{trx.date.substring(0, 10)}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{trx.refId}</div>
                                            </TableCell>
                                            <TableCell className="p-4 align-top">
                                                <div className="font-bold text-white text-sm mb-1">{trx.description}</div>
                                                <div className="space-y-1">
                                                    {/* Show simple entries preview */}
                                                    {trx.entries.slice(0, 3).map((e: any, i: number) => (
                                                        <div key={i} className="flex justify-between text-[10px] text-gray-400 border-b border-white/5 pb-1 last:border-0">
                                                            <span>{e.accountCode}</span>
                                                            <span>
                                                                {e.debit > 0 ? <span className="text-green-500/70">Dr {e.debit.toLocaleString()}</span> : <span className="text-red-500/70">Cr {e.credit.toLocaleString()}</span>}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {trx.entries.length > 3 && <div className="text-[10px] text-gray-600 italic">+ {trx.entries.length - 3} more lines</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4 text-right align-top">
                                                <Badge className={trx.category === 'REVENUE' ? 'bg-green-500/20 text-green-500' : trx.category === 'EXPENSE' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}>
                                                    {trx.category}
                                                </Badge>
                                                <div className="mt-2 text-lg font-bold text-white">
                                                    {trx.category === 'REVENUE' ? '+' : trx.category === 'EXPENSE' ? '-' : ''} {trx.totalAmount?.toLocaleString()}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </main >
    );
}
