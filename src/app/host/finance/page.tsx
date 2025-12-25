'use client';

import { useState } from 'react';
import { 
    Wallet, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Download, 
    DollarSign, 
    CreditCard, 
    Building2,
    History,
    FileSpreadsheet,
    Zap,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { toast } from '@/hooks/use-toast';

// --- MOCK DATA ---
const chartData = [
    { name: 'Mon', revenue: 400000, profit: 360000 },
    { name: 'Tue', revenue: 300000, profit: 270000 },
    { name: 'Wed', revenue: 550000, profit: 495000 },
    { name: 'Thu', revenue: 450000, profit: 405000 },
    { name: 'Fri', revenue: 800000, profit: 720000 },
    { name: 'Sat', revenue: 1200000, profit: 1080000 }, // Weekend Spike
    { name: 'Sun', revenue: 950000, profit: 855000 },
];

const transactions = [
    { id: "TRX-001", event: "Mabar Senin Ceria", date: "05 Jan 2026", gross: 420000, fee: 42000, net: 378000, status: "Settled" },
    { id: "TRX-002", event: "Private Coaching", date: "04 Jan 2026", gross: 150000, fee: 15000, net: 135000, status: "Settled" },
    { id: "TRX-003", event: "Sparring Night", date: "03 Jan 2026", gross: 600000, fee: 60000, net: 540000, status: "Settled" },
    { id: "TRX-004", event: "Mabar Kamis Manis", date: "01 Jan 2026", gross: 350000, fee: 35000, net: 315000, status: "Pending" },
];

export default function HostFinancePage() {
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    // Format Rupiah
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    const handleWithdraw = () => {
        toast({
            title: "Request Submitted 💸",
            description: `Permintaan penarikan sebesar ${formatRupiah(Number(withdrawAmount))} sedang diproses (Max 1x24 Jam).`,
            className: "bg-[#ffbe00] text-black border-none font-bold"
        });
        setWithdrawAmount("");
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            toast({
                title: "Report Downloaded 📊",
                description: "Laporan keuangan bulan Januari berhasil diunduh.",
                className: "bg-[#ca1f3d] text-white border-none font-bold"
            });
        }, 1500);
    };

    return (
        <div className="space-y-8 pb-24">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Finance <span className="text-[#ffbe00]">Manager</span></h1>
                    <p className="text-gray-400 mt-2">Pantau arus kas, pendapatan bersih, dan pencairan dana.</p>
                </div>
                
                <div className="flex gap-3">
                    <Button 
                        onClick={handleExport}
                        variant="outline" 
                        className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                    >
                        {isExporting ? "Downloading..." : <><FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel</>}
                    </Button>
                </div>
            </div>

            {/* 1. WALLET & KEY METRICS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Wallet Card */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-[#ca1f3d] to-[#8a1428] border-none rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[250px] shadow-2xl group">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <Badge className="bg-[#ffbe00] text-black hover:bg-[#ffbe00] font-bold border-none">
                                ACTIVE
                            </Badge>
                        </div>
                        <div>
                            <p className="text-white/80 font-medium mb-1">Total Balance</p>
                            <h2 className="text-4xl font-black tracking-tighter mb-1">Rp 4.850.000</h2>
                            <p className="text-xs text-white/60 font-mono">Last updated: Just now</p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-6">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full h-12 bg-white text-[#ca1f3d] hover:bg-gray-100 font-black rounded-xl shadow-lg border-none">
                                    <ArrowUpRight className="w-4 h-4 mr-2" /> WITHDRAW FUNDS
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#151515] border-white/10 text-white sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Tarik Dana (Withdraw)</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        Dana akan ditransfer ke rekening terdaftar dalam 1x24 jam kerja.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="p-4 bg-[#0a0a0a] rounded-xl border border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
                                                <Building2 className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Bank BCA</p>
                                                <p className="text-xs text-gray-500">**** 8821</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-[#ffbe00] h-8 text-xs">Change</Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nominal Penarikan</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                            <Input 
                                                type="number" 
                                                placeholder="0" 
                                                className="bg-[#0a0a0a] border-white/10 pl-10 h-12 text-white font-mono text-lg"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 text-right">Min: Rp 50.000 • Max: Rp 4.850.000</p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleWithdraw} className="w-full bg-[#ffbe00] hover:bg-yellow-400 text-black font-bold h-12 rounded-xl">
                                        CONFIRM WITHDRAWAL
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card>

                {/* Secondary Metrics */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#ffbe00]/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-[#ffbe00]/10 rounded-2xl text-[#ffbe00]">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <Badge variant="outline" className="border-green-500/20 text-green-500 flex gap-1 items-center">
                                <ArrowUpRight className="w-3 h-3" /> +12%
                            </Badge>
                        </div>
                        <div>
                            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Gross Revenue</p>
                            <h3 className="text-3xl font-black text-white">Rp 5.250.000</h3>
                            <p className="text-xs text-gray-600 mt-2">Bulan ini (Januari)</p>
                        </div>
                    </Card>

                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#ca1f3d]/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-[#ca1f3d]/10 rounded-2xl text-[#ca1f3d]">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500">Platform Fee</p>
                                <p className="text-xs font-bold text-white">10% per Tx</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Platform Fees Paid</p>
                            <h3 className="text-3xl font-black text-white">Rp 525.000</h3>
                            <p className="text-xs text-gray-600 mt-2">Dipotong otomatis</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 2. PROFIT TREND CHART */}
            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            Profit Trend <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-lg">Last 7 Days</span>
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                            <div className="w-3 h-3 rounded-full bg-[#ca1f3d]"></div> Revenue
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                            <div className="w-3 h-3 rounded-full bg-[#ffbe00]"></div> Net Profit
                        </div>
                    </div>
                </div>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ca1f3d" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ca1f3d" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffbe00" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ffbe00" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                formatter={(value: number) => formatRupiah(value)}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#ca1f3d" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="profit" stroke="#ffbe00" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 3. TRANSACTION HISTORY (AUTO SPLIT) */}
            <div className="space-y-4">
                <h3 className="text-xl font-black text-white px-2">Recent Transactions</h3>
                <div className="grid gap-4">
                    {transactions.map((trx) => (
                        <div key={trx.id} className="bg-[#151515] border border-white/5 hover:border-[#ffbe00]/30 p-5 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 transition-all group">
                            
                            {/* Left: Info */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#ffbe00]/10 group-hover:text-[#ffbe00] transition-colors">
                                    <History className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{trx.event}</h4>
                                    <p className="text-xs text-gray-500 font-mono">{trx.id} • {trx.date}</p>
                                </div>
                            </div>

                            {/* Middle: Auto Split Calculation */}
                            <div className="flex-1 w-full md:w-auto bg-[#0a0a0a] rounded-xl p-3 border border-white/5 flex justify-around items-center text-center">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Gross</p>
                                    <p className="text-sm font-bold text-white">{formatRupiah(trx.gross)}</p>
                                </div>
                                <div className="text-gray-600">-</div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">Fee <Info className="w-3 h-3"/></p>
                                    <p className="text-sm font-bold text-red-500">({formatRupiah(trx.fee)})</p>
                                </div>
                                <div className="text-gray-600">=</div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Net Income</p>
                                    <p className="text-sm font-black text-[#ffbe00]">{formatRupiah(trx.net)}</p>
                                </div>
                            </div>

                            {/* Right: Status */}
                            <div className="w-full md:w-auto text-right">
                                <Badge className={`${trx.status === 'Settled' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} border-0 font-bold uppercase`}>
                                    {trx.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
