'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Plus, TrendingUp, TrendingDown, Wallet, Ticket, Shirt, Building, Trash2, Milestone, Users, Trophy, Rocket, Box, Backpack } from 'lucide-react';

const monthlyData = [
    { name: 'Jan', Pemasukan: 15000000, Pengeluaran: 6000000 },
    { name: 'Feb', Pemasukan: 18000000, Pengeluaran: 7000000 },
    { name: 'Mar', Pemasukan: 12000000, Pengeluaran: 8000000 },
    { name: 'Apr', Pemasukan: 20000000, Pengeluaran: 9000000 },
    { name: 'May', Pemasukan: 25000000, Pengeluaran: 10000000 },
    { name: 'Jun', Pemasukan: 22000000, Pengeluaran: 9000000 },
    { name: 'Jul', Pemasukan: 28000000, Pengeluaran: 11000000 },
    { name: 'Aug', Pemasukan: 32500000, Pengeluaran: 12200000 },
];

const transactions = [
    { id: 1, type: 'in', category: 'Mabar', amount: 850000, date: '24 Aug', desc: 'Sesi Rutin Selasa' },
    { id: 2, type: 'in', category: 'Merch', amount: 450000, date: '24 Aug', desc: 'Jersey: 3pcs (L)' },
    { id: 3, type: 'out', category: 'Sewa Lapangan', amount: 300000, date: '23 Aug', desc: 'GOR Koni (3 Jam)' },
    { id: 4, type: 'in', category: 'Event', amount: 1500000, date: '23 Aug', desc: 'Registrasi Bandung Open' },
    { id: 5, type: 'out', category: 'Shuttlecock', amount: 280000, date: '22 Aug', desc: 'Beli 3 Slop Samurai' },
    { id: 6, type: 'in', category: 'Coaching', amount: 600000, date: '21 Aug', desc: 'Drilling Class (6 Orang)' },
    { id: 7, type: 'out', category: 'Alat Coaching', amount: 150000, date: '20 Aug', desc: 'Beli Cone & Tali' },
];

const getIcon = (category: string) => {
    switch(category) {
        // Pemasukan
        case 'Mabar': return <Users className="w-5 h-5"/>;
        case 'Coaching': return <Rocket className="w-5 h-5"/>;
        case 'Merch': return <Shirt className="w-5 h-5"/>;
        case 'Event': return <Trophy className="w-5 h-5"/>;
        
        // Pengeluaran
        case 'Sewa Lapangan': return <Building className="w-5 h-5"/>;
        case 'Shuttlecock': return <Milestone className="w-5 h-5" />;
        case 'Alat Coaching': return <Backpack className="w-5 h-5"/>;
        
        default: return <Wallet className="w-5 h-5"/>;
    }
}

export default function FinancePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const totalIncome = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const exportToCsv = () => {
        let csvContent = "data:text/csv;charset=utf-8,ID,Date,Category,Description,Amount,Type\n";
        transactions.forEach(row => {
            csvContent += `${row.id},${row.date},${row.category},"${row.desc}",${row.amount},${row.type}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "laporan_keuangan_badmintour.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
    <main>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl font-black text-bad-dark tracking-tight">Financial Report</h1>
                <p className="text-gray-500 mt-1">Laporan arus kas Mabar, Coaching, Merchandise, dan Turnamen.</p>
            </div>
            
            <div className="flex gap-3">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-bad-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 group">
                           <span className="group-hover:text-accent transition-colors">+ Catat Transaksi</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white rounded-[2rem] p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-bad-dark">Catat Transaksi</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Jenis Transaksi</label>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <label className="cursor-pointer">
                                        <input type="radio" name="type" className="peer sr-only" defaultChecked />
                                        <div className="text-center py-2 rounded-xl border border-gray-200 font-bold text-gray-500 peer-checked:bg-bad-green peer-checked:text-white peer-checked:border-bad-green transition">Pemasukan</div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input type="radio" name="type" className="peer sr-only" />
                                        <div className="text-center py-2 rounded-xl border border-gray-200 font-bold text-gray-500 peer-checked:bg-bad-red peer-checked:text-white peer-checked:border-bad-red transition">Pengeluaran</div>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                                <Select>
                                    <SelectTrigger className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>--- Pemasukan ---</SelectLabel>
                                            <SelectItem value="mabar">Keuntungan Mabar</SelectItem>
                                            <SelectItem value="coaching">Coaching / Drilling</SelectItem>
                                            <SelectItem value="merch">Penjualan Merch</SelectItem>
                                            <SelectItem value="event">Event / Turnamen</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>--- Pengeluaran ---</SelectLabel>
                                            <SelectItem value="sewa">Sewa Lapangan</SelectItem>
                                            <SelectItem value="kok">Beli Shuttlecock</SelectItem>
                                            <SelectItem value="alat">Peralatan Pendukung</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Nominal (Rp)</label>
                                <Input type="number" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto" placeholder="0"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Keterangan</label>
                                <Input type="text" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto" placeholder="Cth: Sesi Selasa Malam"/>
                            </div>
                            <Button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-3 h-auto rounded-xl bg-bad-dark text-white font-bold hover:bg-gray-800 mt-4">Simpan Data</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Button onClick={exportToCsv} variant="outline" className="bg-white border-gray-200 text-bad-green px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all flex items-center gap-2 h-auto">
                    <Download className="w-5 h-5"/>
                    Export Excel
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <Card className="p-6 rounded-[2rem] border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 rounded-bl-[4rem] -mr-4 -mt-4 transition group-hover:scale-110"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <TrendingDown className="w-4 h-4"/>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Pemasukan</p>
                    </div>
                    <p className="text-4xl font-black text-bad-green">Rp {totalIncome.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">Mabar • Coaching • Merch • Event</p>
                </div>
            </Card>

            <Card className="p-6 rounded-[2rem] border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-bl-[4rem] -mr-4 -mt-4 transition group-hover:scale-110"></div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-bad-red flex items-center justify-center">
                           <TrendingUp className="w-4 h-4"/>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Pengeluaran</p>
                    </div>
                    <p className="text-4xl font-black text-bad-red">Rp {totalExpense.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">Lapangan • Kok • Alat</p>
                </div>
            </Card>

            <Card className="bg-bad-dark text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] -mr-4 -mt-4"></div>
                <div className="relative z-10">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Net Profit (Saldo)</p>
                    <p className="text-4xl font-black text-accent">Rp {netProfit.toLocaleString('id-ID')}</p>
                    <div className="mt-4 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{width: `${Math.round((netProfit / totalIncome) * 100)}%`}}></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 text-right">Margin Keuntungan Sehat</p>
                </div>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-bad-dark">Analitik Bulanan</h3>
                    <Select defaultValue="2025">
                        <SelectTrigger className="w-[120px] bg-gray-50 border-gray-200 text-xs font-bold rounded-lg px-3 py-1 outline-none h-auto">
                            <SelectValue placeholder="Tahun"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025">Tahun 2025</SelectItem>
                            <SelectItem value="2024">Tahun 2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer>
                        <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${Number(value) / 1000000}Jt`} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10}/>
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
                            />
                            <Legend wrapperStyle={{fontSize: "12px", paddingTop: '20px'}}/>
                            <Bar dataKey="Pemasukan" fill="#00C853" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Pengeluaran" fill="#D32F2F" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black text-bad-dark">Transaksi Terakhir</h3>
                    <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</a>
                </div>

                <div className="space-y-3">
                    {transactions.map(trx => {
                         const isIn = trx.type === 'in';
                         const colorClass = isIn ? 'text-bad-green' : 'text-bad-red';
                         const iconBg = isIn ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';

                         return (
                            <div key={trx.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        {getIcon(trx.category)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 leading-tight">{trx.category}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{trx.date} • {trx.desc}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-black ${colorClass}`}>{isIn ? '+' : '-'}Rp {trx.amount.toLocaleString('id-ID')}</span>
                            </div>
                         )
                    })}
                </div>
            </div>
        </div>
    </main>
    )
}
