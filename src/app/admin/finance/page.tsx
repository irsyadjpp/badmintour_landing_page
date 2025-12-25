'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Download, Plus, TrendingUp, TrendingDown, Wallet, Shirt, Building, Users, Trophy, Rocket, Box, Backpack, Milestone, Zap } from 'lucide-react';

const monthlyData = [
    { name: 'Jan', In: 15, Out: 6 },
    { name: 'Feb', In: 18, Out: 7 },
    { name: 'Mar', In: 12, Out: 8 },
    { name: 'Apr', In: 20, Out: 9 },
    { name: 'May', In: 25, Out: 10 },
    { name: 'Jun', In: 22, Out: 9 },
    { name: 'Jul', In: 28, Out: 11 },
    { name: 'Aug', In: 32.5, Out: 12.2 },
];

const transactions = [
    { id: 1, type: 'in', category: 'Mabar', amount: 850000, date: '24 Aug', desc: 'Sesi Rutin Selasa' },
    { id: 2, type: 'out', category: 'Sewa Lapangan', amount: 300000, date: '23 Aug', desc: 'GOR Koni' },
    { id: 3, type: 'in', category: 'Merch', amount: 450000, date: '23 Aug', desc: 'Jersey Sales' },
    { id: 4, type: 'in', category: 'Event', amount: 1500000, date: '22 Aug', desc: 'Bandung Open' },
    { id: 5, type: 'out', category: 'Shuttlecock', amount: 280000, date: '21 Aug', desc: '3 Slop Samurai' },
];

const getIcon = (category: string) => {
    switch(category) {
        case 'Mabar': return '🏸';
        case 'Coaching': return '🚀';
        case 'Merch': return '👕';
        case 'Event': return '🏆';
        case 'Sewa Lapangan': return '🏟️';
        case 'Shuttlecock': return '📦';
        case 'Alat Coaching': return '🎒';
        default: return '📄';
    }
}

const incomeCategories = [
    { value: 'Mabar', label: 'Mabar', icon: '🏸' },
    { value: 'Coaching', label: 'Coaching', icon: '🚀' },
    { value: 'Merch', label: 'Merch', icon: '👕' },
    { value: 'Event', label: 'Event', icon: '🏆' },
];

const expenseCategories = [
    { value: 'Sewa Lapangan', label: 'Lapangan', icon: '🏟️' },
    { value: 'Shuttlecock', label: 'Beli Kok', icon: '🏸' },
    { value: 'Alat Coaching', label: 'Alat', icon: '🎒' },
];


export default function FinancePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
    
    const totalIncome = 32500000;
    const totalExpense = 12200000;
    const netProfit = totalIncome - totalExpense;

    const exportToCsv = () => {
        alert('Mengunduh CSV...');
    }

    return (
    <main>
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
                <h1 className="text-5xl font-black text-bad-dark tracking-tighter mb-1">Treasury</h1>
                <p className="text-gray-500 font-medium">Monitoring arus kas BadminTour.</p>
            </div>
            
            <div className="flex gap-3">
                 <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                         <Button className="bg-bad-dark text-white px-8 py-4 h-auto rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 group">
                            <span className="bg-white/20 p-1 rounded-full"><Plus className="w-4 h-4" strokeWidth={3}/></span>
                            <span>Transaksi Baru</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl transform transition-all data-[state=open]:!slide-in-from-bottom-full md:data-[state=open]:!slide-in-from-top-[48%] data-[state=closed]:!slide-out-to-bottom-full md:data-[state=closed]:!slide-out-to-top-[48%] data-[state=open]:!zoom-in-100 data-[state=closed]:!zoom-out-100">
                        <DialogTitle className="sr-only">Tambah Transaksi Baru</DialogTitle>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden"></div>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Transaksi Tersimpan!'); setIsModalOpen(false); }}>
                            <div className="bg-gray-100 p-1.5 rounded-2xl flex relative mb-8">
                                <div id="typeIndicator" className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]" style={{ transform: transactionType === 'in' ? 'translateX(0)' : 'translateX(100%)' }}></div>
                                
                                <button type="button" onClick={() => setTransactionType('in')} className={`flex-1 relative z-10 py-3 text-sm font-black text-center transition-colors duration-300 ${transactionType === 'in' ? 'text-bad-dark' : 'text-gray-400'}`}>
                                    PEMASUKAN
                                </button>
                                <button type="button" onClick={() => setTransactionType('out')} className={`flex-1 relative z-10 py-3 text-sm font-black text-center transition-colors duration-300 ${transactionType === 'out' ? 'text-bad-dark' : 'text-gray-400'}`}>
                                    PENGELUARAN
                                </button>
                            </div>

                            <div className="mb-8 text-center relative group">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nominal (Rp)</label>
                                <div className="relative inline-block w-full">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">Rp</span>
                                    <Input type="number" id="inputAmount" className="w-full text-center text-5xl md:text-6xl font-black bg-transparent border-none focus:ring-0 outline-none money-input text-bad-dark placeholder-gray-200 h-auto p-0" placeholder="0" />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Kategori</label>
                                <div id="catIn" className={`grid grid-cols-3 gap-3 ${transactionType === 'in' ? '' : 'hidden'}`}>
                                    {incomeCategories.map(cat => (
                                        <label key={cat.value} className="cursor-pointer">
                                            <input type="radio" name="category" value={cat.value} className="peer sr-only" defaultChecked={cat.value === 'Mabar'} />
                                            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-gray-50 peer-checked:bg-bad-green peer-checked:text-white peer-checked:border-bad-green peer-checked:shadow-glow-green transition-all hover:bg-gray-100">
                                                <span className="text-2xl mb-1">{cat.icon}</span>
                                                <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div id="catOut" className={`grid grid-cols-3 gap-3 ${transactionType === 'out' ? '' : 'hidden'}`}>
                                    {expenseCategories.map(cat => (
                                        <label key={cat.value} className="cursor-pointer">
                                            <input type="radio" name="category" value={cat.value} className="peer sr-only" defaultChecked={cat.value === 'Sewa Lapangan'} />
                                            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-gray-50 peer-checked:bg-bad-red peer-checked:text-white peer-checked:border-bad-red peer-checked:shadow-glow-red transition-all hover:bg-gray-100">
                                                <span className="text-2xl mb-1">{cat.icon}</span>
                                                <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Catatan</label>
                                <Input type="text" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 h-auto font-bold focus:outline-none focus:border-gray-400 transition" placeholder="Contoh: Sesi Selasa Malam (12 Pax)" />
                            </div>

                             <Button type="submit" className={`w-full py-4 h-auto rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${transactionType === 'in' ? 'bg-bad-dark text-white' : 'bg-bad-red text-white shadow-glow-red'}`}>
                                SIMPAN TRANSAKSI
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
                 <div className="bg-gradient-to-br from-bad-card to-bad-dark rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-72 flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-bad-green/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-bad-green/20 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-bad-blue/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-1">Total Balance</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-gray-400 text-2xl font-medium">Rp</span>
                                <h2 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{netProfit.toLocaleString('id-ID')}</h2>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md">
                            <Zap className="w-6 h-6 text-bad-yellow" />
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-bad-green shadow-glow-green"></span>
                                <p className="text-gray-400 text-xs font-bold uppercase">Income (Aug)</p>
                            </div>
                            <p className="text-2xl font-bold text-bad-green">+ {totalIncome.toLocaleString('id-ID', {notation: 'compact', compactDisplay: 'short'})}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-bad-red shadow-glow-red"></span>
                                <p className="text-gray-400 text-xs font-bold uppercase">Expense (Aug)</p>
                            </div>
                            <p className="text-2xl font-bold text-bad-red">- {totalExpense.toLocaleString('id-ID', {notation: 'compact', compactDisplay: 'short'})}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-bad-dark">Cash Flow</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-bad-green"></span> Masuk</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-bad-red"></span> Keluar</span>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                        <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} ticks={[]} />
                            <Tooltip
                                cursor={{fill: 'rgba(243, 244, 246, 0.5)'}}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '1rem',
                                    border: '1px solid #e5e7eb',
                                    padding: '0.5rem 1rem',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                                }}
                                labelStyle={{fontWeight: 'bold'}}
                                formatter={(value: number) => `${value} Jt`}
                            />
                            <Bar dataKey="In" fill="#32D74B" radius={4} barSize={10} />
                            <Bar dataKey="Out" fill="#FF3B30" radius={4} barSize={10}/>
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-xl font-black text-bad-dark">History</h3>
                         <Button onClick={exportToCsv} variant="ghost" size="sm" className="text-xs font-bold text-bad-blue bg-blue-50 h-auto px-3 py-1 rounded-full hover:bg-blue-100">Export CSV</Button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {transactions.map(trx => {
                            const isInc = trx.type === 'in';
                            const color = isInc ? 'text-bad-green' : 'text-bad-red';
                            const sign = isInc ? '+' : '-';
                            return (
                                <div key={trx.id} className="flex items-center justify-between p-4 bg-surface rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md transition cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">{getIcon(trx.category)}</div>
                                        <div>
                                            <p className="text-sm font-bold text-bad-dark leading-tight">{trx.category}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{trx.date}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-black ${color}`}>{sign} {trx.amount.toLocaleString('id-ID')}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    </main>
    )
}
