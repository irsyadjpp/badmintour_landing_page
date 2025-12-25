'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const monthlyData = [
    { name: 'Jan', In: 12, Out: 2 },
    { name: 'Feb', In: 19, Out: 3 },
    { name: 'Mar', In: 3, Out: 20 },
    { name: 'Apr', In: 5, Out: 5 },
    { name: 'May', In: 2, Out: 1 },
];

const transactions = [
    { id: 1, type: 'in', category: 'Mabar Rutin', amount: 850000, date: '24 Aug', icon: ArrowDownLeft },
    { id: 2, type: 'out', category: 'Sewa GOR', amount: 300000, date: '23 Aug', icon: ArrowUpRight },
];

export default function FinancePage() {
    return (
    <main>
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-5xl font-black text-white tracking-tighter">Finance</h1>
                <p className="text-gray-400 mt-2 font-medium">Monitoring arus kas.</p>
            </div>
            <Button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] h-auto flex items-center gap-2">
                <Plus className="w-4 h-4"/> Transaksi Baru
            </Button>
        </div>

        <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-10 mb-8 relative overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-bad-green/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-bad-green/10 transition duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        Total Balance <span className="w-2 h-2 rounded-full bg-bad-green animate-pulse"></span>
                    </p>
                    <h2 className="text-6xl md:text-8xl font-jersey text-white tracking-wide">Rp 20.350.000</h2>
                </div>
                <div className="text-right bg-[#121212] p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Income (Aug)</p>
                    <p className="text-3xl font-jersey text-bad-green">+ 12.5 Jt</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 text-white p-8 rounded-[2.5rem]">
                <h3 className="font-black text-xl mb-6">Cash Flow</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={false} />
                            <Tooltip
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{
                                    backgroundColor: '#1A1A1A',
                                    borderRadius: '1rem',
                                    border: '1px solid #333',
                                    padding: '0.75rem 1rem',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{fontWeight: 'bold', color: '#888', marginBottom: '0.5rem'}}
                                formatter={(value: number) => [`${value} Jt`, '']}
                            />
                            <Bar dataKey="In" fill="#4ADE80" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="Out" fill="#F87171" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* History Section */}
            <div className="lg:col-span-1 bg-[#1A1A1A] border border-white/5 text-white p-8 rounded-[2.5rem]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl">History</h3>
                    <Button variant="ghost" className="text-xs font-bold text-bad-blue bg-bad-blue/10 h-auto px-3 py-1.5 rounded-full hover:bg-bad-blue hover:text-white transition">Export</Button>
                </div>
                <div className="space-y-4">
                    {transactions.map(trx => (
                        <div key={trx.id} className="flex justify-between items-center p-3 hover:bg-[#121212] rounded-xl transition cursor-default group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${trx.type === 'in' ? 'bg-bad-green/10 text-bad-green group-hover:bg-bad-green group-hover:text-black' : 'bg-bad-red/10 text-bad-red group-hover:bg-bad-red group-hover:text-white'}`}>
                                    <trx.icon className="w-5 h-5"/>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">{trx.category}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{trx.date}</p>
                                </div>
                            </div>
                            <span className={`font-jersey text-xl ${trx.type === 'in' ? 'text-bad-green' : 'text-bad-red'}`}>{trx.type === 'in' ? '+' : '-'} {trx.amount.toLocaleString('id-ID', {notation: 'compact', compactDisplay: 'short'})}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </main>
    )
}
