'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const monthlyData = [
    { name: 'Jan', In: 12, Out: 2 },
    { name: 'Feb', In: 19, Out: 3 },
    { name: 'Mar', In: 3, Out: 20 },
    { name: 'Apr', In: 5, Out: 5 },
    { name: 'May', In: 2, Out: 1 },
];

const transactions = [
    { id: 1, type: 'in', category: 'Mabar Rutin', amount: 850000, date: '24 Aug', icon: '🏸' },
    { id: 2, type: 'out', category: 'Sewa GOR', amount: 300000, date: '23 Aug', icon: '🏟️' },
];

export default function FinancePage() {
    return (
    <main className="ml-28 mr-6 py-8">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-5xl font-black text-white tracking-tight">Finance</h1>
                <p className="text-gray-400 mt-2 font-medium">Monitoring arus kas.</p>
            </div>
            <Button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-lg h-auto flex items-center gap-2">
                <Plus className="w-4 h-4"/> Transaksi Baru
            </Button>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Balance</p>
                    <h2 className="text-6xl font-black text-white tracking-tighter mt-2">Rp 20.350.000</h2>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Income (Aug)</p>
                    <p className="text-2xl font-bold text-bad-green">+ 12.5 Jt</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white text-black p-8 rounded-[2.5rem]">
                <h3 className="font-black text-xl mb-6">Cash Flow</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={false} />
                            <Tooltip
                                cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '1rem',
                                    border: '1px solid #e5e7eb',
                                    padding: '0.5rem 1rem'
                                }}
                                labelStyle={{fontWeight: 'bold'}}
                                formatter={(value: number) => `${value} Jt`}
                            />
                            <Bar dataKey="In" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Out" fill="#F87171" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="lg:col-span-1 bg-white text-black p-8 rounded-[2.5rem]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl">History</h3>
                    <Button variant="ghost" className="text-xs font-bold text-bad-blue bg-blue-50 h-auto px-3 py-1 rounded-full hover:bg-blue-100">Export</Button>
                </div>
                <div className="space-y-4">
                    {transactions.map(trx => (
                        <div key={trx.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${trx.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>{trx.icon}</div>
                                <div>
                                    <p className="font-bold text-sm">{trx.category}</p>
                                    <p className="text-xs text-gray-400 uppercase">{trx.date}</p>
                                </div>
                            </div>
                            <span className={`font-black ${trx.type === 'in' ? 'text-bad-green' : 'text-bad-red'}`}>{trx.type === 'in' ? '+' : '-'} {trx.amount.toLocaleString('id-ID', {notation: 'compact', compactDisplay: 'short'})}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </main>
    )
}