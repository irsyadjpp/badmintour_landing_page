'use client';

import { DollarSign, TrendingUp, Download, CreditCard, ArrowUpRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CoachFinancePage() {
    return (
        <div className="space-y-8 pb-20 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-[#00f2ea]" /> EARNINGS
                    </h1>
                    <p className="text-gray-400">Laporan pendapatan dari sesi coaching.</p>
                </div>
                {/* BUTTON FIX: Outline White -> Hover White BG Black Text */}
                <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black rounded-xl h-12 font-bold transition-colors w-full md:w-auto">
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </div>

            {/* Main Stats Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Balance Card */}
                <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-[#151515] to-[#0a0a0a] border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    {/* Background Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2ea]/5 rounded-full blur-[80px] group-hover:bg-[#00f2ea]/10 transition-all duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Available Balance</p>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">Rp 3.500.000</h2>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* BUTTON FIX: Cyan BG -> Black Text (High Contrast) */}
                            <Button className="bg-[#00f2ea] text-black hover:bg-[#00c2bb] font-black h-14 px-8 rounded-xl shadow-[0_0_20px_rgba(0,242,234,0.3)] hover:scale-105 transition-transform">
                                WITHDRAW FUNDS
                            </Button>
                            {/* BUTTON FIX: Transparent -> White Border/Text */}
                            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white hover:text-black h-14 px-6 rounded-xl font-bold transition-all">
                                Add Bank Account
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Secondary Stats */}
                <Card className="bg-[#151515] border-white/10 p-6 rounded-[2.5rem] flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 border border-green-500/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Earned</p>
                            <p className="text-xl font-black text-white">Rp 12.450.000</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <div className="w-12 h-12 bg-[#ff0099]/10 rounded-xl flex items-center justify-center text-[#ff0099] border border-[#ff0099]/20">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pending Clearance</p>
                            <p className="text-xl font-black text-white">Rp 450.000</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transaction History */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5 text-[#00f2ea]" /> Recent Transactions
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-[#151515] border border-white/10 hover:border-[#00f2ea]/30 transition group gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-white font-bold border border-white/5 group-hover:bg-[#00f2ea]/10 group-hover:text-[#00f2ea] transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm group-hover:text-[#00f2ea] transition-colors">Session Payment - Budi Santoso</p>
                                    <p className="text-xs text-gray-500 mt-0.5">24 Dec 2025 • 16:00 • Private Drill</p>
                                </div>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto pl-16 sm:pl-0">
                                <p className="text-[#00f2ea] font-mono font-bold text-lg">+ Rp 150.000</p>
                                <Badge variant="secondary" className="text-[9px] bg-green-500/10 text-green-500 border border-green-500/20 mt-1 uppercase font-bold px-2 py-0.5">
                                    Success
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
