'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FinanceNav } from '@/components/admin/finance-nav';
import { Loader2, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function ReportsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-reports'],
        queryFn: async () => {
            const res = await fetch('/api/admin/finance/reports');
            if (!res.ok) throw new Error('Failed to fetch reports');
            return res.json();
        }
    });

    const report = data?.data;
    const chartData = report?.chartData || [];

    // Helper to format currency
    const fmt = (n: number) => `Rp ${n?.toLocaleString('id-ID') || 0}`;
    const fmtShort = (n: number) => `Rp ${n >= 1000000 ? (n / 1000000).toFixed(1) + 'jt' : (n / 1000).toFixed(0) + 'rb'}`;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] pb-20 p-6 md:p-8">
                <FinanceNav />
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="animate-spin text-[#ffbe00] w-12 h-12" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] pb-20">
            <FinanceNav />

            <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-white px-2">Laba Rugi (Profit & Loss)</h1>
                    <p className="text-gray-400 px-2">Laporan Kinerja Keuangan Real-time.</p>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-[#1A1A1A] border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Total Pendapatan (Revenue)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{fmt(report?.summary.revenue)}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1A1A1A] border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Beban Pokok (COGS)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-400">{fmt(report?.summary.cogs)}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1A1A1A] border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Beban Operasional (OPEX)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-400">{fmt(report?.summary.opex)}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#1A1A1A] border-white/5 border-l-4 border-l-[#ffbe00]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white">Laba Bersih (Net Profit)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-black ${report?.summary.netProfit >= 0 ? 'text-[#ffbe00]' : 'text-red-500'}`}>
                                {fmt(report?.summary.netProfit)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CASHFLOW CHART */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.0rem] p-6 h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="text-[#ffbe00] w-5 h-5" /> Arus Kas (Cashflow Trend)
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#666"
                                tick={{ fill: '#666', fontSize: 12 }}
                                tickFormatter={(val) => {
                                    const d = new Date(val);
                                    return `${d.getDate()}/${d.getMonth() + 1}`;
                                }}
                            />
                            <YAxis
                                stroke="#666"
                                tick={{ fill: '#666', fontSize: 12 }}
                                tickFormatter={(val) => fmtShort(val)}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                                formatter={(val: number) => fmt(val)}
                                labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar name="Pendapatan" dataKey="revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
                            <Bar name="Pengeluaran" dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* DETAILED TABLES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* REVENUE TABLE */}
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.0rem] p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="text-green-500 w-5 h-5" /> Rincian Pendapatan
                        </h3>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-gray-500">Account</TableHead>
                                    <TableHead className="text-right text-gray-500">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report?.details.revenue.map((item: any) => (
                                    <TableRow key={item.code} className="border-white/5 hover:bg-white/5">
                                        <TableCell className="text-gray-300">
                                            <span className="font-mono text-xs text-gray-500 mr-2">{item.code}</span>
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-400">{fmt(item.amount)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="border-t border-white/10 hover:bg-transparent">
                                    <TableCell className="font-bold text-white">Total Revenue</TableCell>
                                    <TableCell className="text-right font-bold text-green-500 text-lg">{fmt(report?.summary.revenue)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* EXPENSES TABLE (COGS + OPEX) */}
                    <div className="space-y-8">
                        {/* COGS */}
                        <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.0rem] p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Package className="text-red-400 w-5 h-5" /> Beban Pokok (COGS)
                            </h3>
                            <Table>
                                <TableBody>
                                    {report?.details.cogs.map((item: any) => (
                                        <TableRow key={item.code} className="border-white/5 hover:bg-white/5">
                                            <TableCell className="text-gray-300">
                                                <span className="font-mono text-xs text-gray-500 mr-2">{item.code}</span>
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-red-300">{fmt(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="border-t border-white/10 hover:bg-transparent">
                                        <TableCell className="font-bold text-white">Total COGS</TableCell>
                                        <TableCell className="text-right font-bold text-red-400 text-lg">{fmt(report?.summary.cogs)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* OPEX */}
                        <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.0rem] p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingDown className="text-red-400 w-5 h-5" /> Beban Operasional (OPEX)
                            </h3>
                            <Table>
                                <TableBody>
                                    {report?.details.opex.map((item: any) => (
                                        <TableRow key={item.code} className="border-white/5 hover:bg-white/5">
                                            <TableCell className="text-gray-300">
                                                <span className="font-mono text-xs text-gray-500 mr-2">{item.code}</span>
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-red-300">{fmt(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="border-t border-white/10 hover:bg-transparent">
                                        <TableCell className="font-bold text-white">Total OPEX</TableCell>
                                        <TableCell className="text-right font-bold text-red-400 text-lg">{fmt(report?.summary.opex)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Package(props: any) {
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
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22v-9" />
        </svg>
    )
}
