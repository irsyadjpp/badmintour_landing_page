
'use client';

import { DollarSign, TrendingUp, Download, CreditCard, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CoachFinancePage() {
    return (
        <div className="space-y-8 pb-20 p-6 md:p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-[#00f2ea]" /> EARNINGS
                    </h1>
                    <p className="text-gray-400">Laporan pendapatan dari sesi coaching.</p>
                </div>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12">
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-[#151515] to-[#0a0a0a] border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2ea]/5 rounded-full blur-[80px]"></div>
                    
                    <div className="relative z-10">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</p>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Rp 3.500.000</h2>
                        
                        <div className="flex gap-4">
                            <Button className="bg-[#00f2ea] text-black hover:bg-[#00c2bb] font-black h-12 px-8 rounded-xl">
                                WITHDRAW FUNDS
                            </Button>
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 px-6 rounded-xl">
                                Add Bank Account
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="bg-[#151515] border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Total Earned</p>
                            <p className="text-xl font-black text-white">Rp 12.450.000</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#ff0099]/10 rounded-2xl flex items-center justify-center text-[#ff0099]">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Pending Clearance</p>
                            <p className="text-xl font-black text-white">Rp 450.000</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transaction History */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-[#1A1A1A] border border-white/5 hover:border-[#00f2ea]/30 transition group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-bold border border-white/10">
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Session Payment - Budi Santoso</p>
                                    <p className="text-xs text-gray-500">24 Dec 2025 • 16:00</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[#00f2ea] font-mono font-bold">+ Rp 150.000</p>
                                <Badge variant="secondary" className="text-[9px] bg-green-500/10 text-green-500 border-0 mt-1 uppercase font-bold">Success</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
