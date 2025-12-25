'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

// REVISI: Mock Host sebagai Person (Admin Lapangan)
const hostAvatars = [
    { name: 'Host Andi', src: 'https://ui-avatars.com/api/?name=Andi&background=0D0D0D&color=fff', stock: 2, status: 'OK' },
    { name: 'Host Budi', src: 'https://ui-avatars.com/api/?name=Budi&background=random', stock: 1, status: 'Low' },
];

export default function InventoryPage() {
    const [isRestockOpen, setIsRestockOpen] = useState(false);
    const [isDistributeOpen, setIsDistributeOpen] = useState(false);
    const [quota, setQuota] = useState(12);

    return (
        <main>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-1">Logistics</h1>
                    <p className="text-gray-400 font-medium">Manajemen stok shuttlecock dan merchandise.</p>
                </div>
            </div>

            <Tabs defaultValue="shuttlecock" className="w-full">
                <TabsList className="bg-[#1A1A1A] p-1.5 rounded-2xl shadow-sm border border-white/5 h-auto">
                    <TabsTrigger value="shuttlecock" className="px-6 py-2.5 rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg text-gray-500 transition-all">🏸 Shuttlecock</TabsTrigger>
                    <TabsTrigger value="jersey" className="px-6 py-2.5 rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg text-gray-500 transition-all">👕 Jersey Drop</TabsTrigger>
                </TabsList>

                <TabsContent value="shuttlecock" className="mt-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Gudang Utama */}
                        <div className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-white/10"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gudang Utama (Admin)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-jersey text-white">12</span>
                                    <span className="text-sm font-bold text-gray-500">Slop</span>
                                </div>
                                <div className="mt-6 flex gap-2">
                                     <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" className="bg-bad-green/10 text-bad-green px-4 py-2 h-auto rounded-xl text-xs font-black uppercase hover:bg-bad-green hover:text-white transition border border-bad-green/20">+ Restock</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 bg-[#1A1A1A] border-white/10 text-white">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black mb-4">Input Pembelian Kok</DialogTitle>
                                            </DialogHeader>
                                            <form className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Merk / Tipe</label>
                                                    <Input className="mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto" placeholder="Cth: Samurai Hijau" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Jumlah (Slop)</label>
                                                        <Input type="number" className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto" placeholder="0" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Harga Total</label>
                                                        <Input type="number" className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto" placeholder="Rp" />
                                                    </div>
                                                </div>
                                                <Button type="button" onClick={() => {setIsRestockOpen(false)}} className="w-full py-4 h-auto rounded-xl bg-bad-green text-black font-black hover:bg-green-400 mt-4">Simpan Stok</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        {/* Stok di Tangan Host */}
                        <div className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-bad-yellow/10 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-bad-yellow/20"></div>
                            <div className="relative z-10">
                                {/* REVISI: Label */}
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Di Tangan Host</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-jersey text-bad-yellow">5</span>
                                    <span className="text-sm font-bold text-gray-500">Slop</span>
                                </div>
                                <div className="mt-6 flex gap-2">
                                     <Dialog open={isDistributeOpen} onOpenChange={setIsDistributeOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-white text-black px-4 py-2 h-auto rounded-xl text-xs font-black uppercase hover:bg-gray-200 transition">→ Distribusi</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 bg-[#1A1A1A] border-white/10 text-white">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black mb-4">Distribusi ke Host</DialogTitle>
                                            </DialogHeader>
                                            <form className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Pilih Host</label>
                                                    <Select>
                                                        <SelectTrigger className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto">
                                                            <SelectValue placeholder="Pilih Host" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                            {/* REVISI: Nama Host */}
                                                            <SelectItem value="andi">Host Andi (Koni)</SelectItem>
                                                            <SelectItem value="budi">Host Budi (LPKIA)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Jumlah (Slop)</label>
                                                    <Input type="number" className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto" placeholder="0" />
                                                </div>
                                                <Button type="button" onClick={() => {setIsDistributeOpen(false)}} className="w-full py-4 h-auto rounded-xl bg-white text-black font-black hover:bg-gray-200 mt-4">Kirim Stok</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                        
                        {/* Estimasi Habis */}
                        <div className="bg-[#121212] text-white p-8 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] -mr-4 -mt-4"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Estimasi Habis</p>
                                <p className="text-5xl font-jersey text-white">2.5 <span className="text-lg font-sans text-gray-500">Minggu</span></p>
                                <div className="mt-6 w-full bg-[#222] rounded-full h-2 overflow-hidden">
                                    <div className="bg-bad-green h-full w-[70%] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                </div>
                                <p className="text-[10px] text-bad-green mt-2 font-bold uppercase tracking-wider">Stok Aman</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Host Stocks */}
                    <div className="bg-[#1A1A1A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-black text-lg text-white">Posisi Stok Host</h3>
                            <span className="text-[10px] font-bold text-bad-green uppercase bg-bad-green/10 px-2 py-1 rounded-md animate-pulse">● Real-time</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hostAvatars.map(host => (
                                <div key={host.name} className="flex items-center gap-4 p-4 rounded-2xl bg-[#121212] border border-white/5 hover:border-white/20 transition group">
                                    <Image src={host.src} alt={host.name} width={48} height={48} className="w-12 h-12 rounded-full border border-white/10" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-white">{host.name}</p>
                                        <p className="text-xs text-gray-500">Last refill: 20 Aug</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`block text-3xl font-jersey ${host.status === 'Low' ? 'text-bad-red' : 'text-white'}`}>{host.stock}</span>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${host.status === 'Low' ? 'text-bad-red' : 'text-gray-500'}`}>{host.status === 'Low' ? 'Low' : 'Slop'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Tab Jersey tetap sama ... */}
                <TabsContent value="jersey" className="mt-8 space-y-8">
                     <div className="bg-[#1A1A1A] rounded-[2.5rem] p-8 border border-white/5 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                        <div className="relative w-full md:w-1/3 aspect-square bg-[#121212] rounded-[2rem] flex items-center justify-center overflow-hidden group border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-tr from-bad-red/10 to-transparent"></div>
                            <div className="text-center z-10 group-hover:scale-110 transition duration-500">
                                <span className="text-7xl">👕</span>
                                <p className="text-white font-black uppercase mt-4 tracking-widest text-sm">Season 1</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="bg-bad-red text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(248,113,113,0.5)]">Live Now</span>
                                    <h2 className="text-4xl font-black text-white mt-4 tracking-tight">Jersey Drop Control</h2>
                                    <p className="text-gray-400 text-sm mt-1">Atur kuota ketersediaan jersey secara real-time.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Claimed</p>
                                    <p className="text-5xl font-jersey text-white">9<span className="text-2xl text-gray-600">/{quota}</span></p>
                                </div>
                            </div>

                            <div className="bg-[#121212] p-8 rounded-[2rem] border border-white/5 mb-8">
                                <label className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                                    <span>Total Kuota (Slot)</span>
                                    <span className="text-white text-lg font-jersey">{quota} Pcs</span>
                                </label>
                                <Slider 
                                    defaultValue={[quota]} 
                                    max={50} 
                                    min={10}
                                    step={1} 
                                    onValueChange={(value) => setQuota(value[0])}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-[10px] text-gray-600 font-bold mt-3">
                                    <span>10</span>
                                    <span>50</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 py-6 h-auto bg-white text-black rounded-xl font-black hover:bg-gray-200 transition shadow-lg">Update Kuota</Button>
                                <Button variant="outline" className="py-6 h-auto px-8 border-white/10 rounded-xl font-bold text-gray-400 hover:text-bad-red hover:border-bad-red bg-transparent transition">Stop Drop</Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
}
