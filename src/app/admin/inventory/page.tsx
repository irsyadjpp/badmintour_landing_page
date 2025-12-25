
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

const hostAvatars = [
    { name: 'Host GOR Koni', src: 'https://ui-avatars.com/api/?name=Host+Koni&background=0D0D0D&color=fff', stock: 2, status: 'OK' },
    { name: 'Host GOR LPKIA', src: 'https://ui-avatars.com/api/?name=Host+LPKIA&background=random', stock: 1, status: 'Low' },
];

export default function InventoryPage() {
    const [isRestockOpen, setIsRestockOpen] = useState(false);
    const [isDistributeOpen, setIsDistributeOpen] = useState(false);
    const [quota, setQuota] = useState(12);

    return (
        <main>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-5xl font-black text-bad-dark tracking-tighter mb-1">Logistics</h1>
                    <p className="text-gray-500 font-medium">Manajemen stok shuttlecock dan merchandise.</p>
                </div>
            </div>

            <Tabs defaultValue="shuttlecock" className="w-full">
                <TabsList className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 h-auto">
                    <TabsTrigger value="shuttlecock" className="px-6 py-2.5 rounded-xl font-bold text-sm data-[state=active]:bg-bad-dark data-[state=active]:text-white data-[state=active]:shadow-xl text-gray-400">🏸 Shuttlecock</TabsTrigger>
                    <TabsTrigger value="jersey" className="px-6 py-2.5 rounded-xl font-bold text-sm data-[state=active]:bg-bad-dark data-[state=active]:text-white data-[state=active]:shadow-xl text-gray-400">👕 Jersey Drop</TabsTrigger>
                </TabsList>

                <TabsContent value="shuttlecock" className="mt-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] -mr-4 -mt-4"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gudang Utama (Admin)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-bad-dark">12</span>
                                    <span className="text-sm font-bold text-gray-400">Slop</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                     <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" className="bg-bad-green/10 text-bad-green px-3 py-1.5 h-auto rounded-lg text-xs font-black uppercase hover:bg-bad-green hover:text-white transition">+ Restock Baru</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black text-bad-dark mb-4">Input Pembelian Kok</DialogTitle>
                                            </DialogHeader>
                                            <form className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Merk / Tipe</label>
                                                    <Input className="mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto" placeholder="Cth: Samurai Hijau" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-400 uppercase">Jumlah (Slop)</label>
                                                        <Input type="number" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto" placeholder="0" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-400 uppercase">Harga Total</label>
                                                        <Input type="number" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto" placeholder="Rp" />
                                                    </div>
                                                </div>
                                                <Button type="button" onClick={() => {setIsRestockOpen(false); alert('Stok ditambahkan!')}} className="w-full py-4 h-auto rounded-xl bg-bad-green text-white font-black hover:bg-green-600 mt-2">Simpan Stok</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-50 rounded-bl-[4rem] -mr-4 -mt-4"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Di Tangan Host</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-bad-yellow">5</span>
                                    <span className="text-sm font-bold text-gray-400">Slop</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                     <Dialog open={isDistributeOpen} onOpenChange={setIsDistributeOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-bad-dark text-white px-3 py-1.5 h-auto rounded-lg text-xs font-black uppercase hover:bg-gray-800 transition">→ Distribusi</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black text-bad-dark mb-4">Distribusi ke Host</DialogTitle>
                                            </DialogHeader>
                                            <form className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Pilih Host</label>
                                                    <Select>
                                                        <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto">
                                                            <SelectValue placeholder="Pilih Host" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="koni">Host GOR Koni</SelectItem>
                                                            <SelectItem value="lpkia">Host GOR LPKIA</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase">Jumlah (Slop)</label>
                                                    <Input type="number" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto" placeholder="0" />
                                                </div>
                                                <Button type="button" onClick={() => {setIsDistributeOpen(false); alert('Stok dipindahkan!')}} className="w-full py-4 h-auto rounded-xl bg-bad-dark text-white font-black hover:bg-gray-800 mt-2">Kirim Stok</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-bad-dark text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] -mr-4 -mt-4"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Estimasi Habis</p>
                                <p className="text-4xl font-black text-white">2.5 Minggu</p>
                                <div className="mt-4 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-bad-green h-full w-[70%]"></div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Stok Aman</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-black text-lg">Posisi Stok Host</h3>
                            <span className="text-xs font-bold text-gray-400 uppercase">Real-time</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hostAvatars.map(host => (
                                <div key={host.name} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <Image src={host.src} alt={host.name} width={40} height={40} className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">{host.name}</p>
                                        <p className="text-xs text-gray-400">Last refill: 20 Aug</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`block text-2xl font-black ${host.status === 'Low' ? 'text-bad-red' : 'text-bad-dark'}`}>{host.stock}</span>
                                        <span className={`text-[10px] font-bold uppercase ${host.status === 'Low' ? 'text-bad-red' : 'text-gray-400'}`}>{host.status === 'Low' ? 'Low' : 'Slop'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="jersey" className="mt-6 space-y-8">
                     <div className="bg-white rounded-[2.5rem] p-8 border border-gray-200 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                        <div className="relative w-full md:w-1/3 aspect-square bg-bad-dark rounded-[2rem] flex items-center justify-center overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-bad-red/20 to-transparent"></div>
                            <div className="text-center z-10">
                                <span className="text-6xl">👕</span>
                                <p className="text-white font-black uppercase mt-2 tracking-widest">Season 1</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="bg-bad-red text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Live Now</span>
                                    <h2 className="text-3xl font-black text-bad-dark mt-2">Jersey Drop Control</h2>
                                    <p className="text-gray-500 text-sm">Atur kuota ketersediaan jersey secara real-time.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Claimed</p>
                                    <p className="text-4xl font-black text-bad-dark">9<span className="text-xl text-gray-400">/{quota}</span></p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-200 mb-6">
                                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <span>Total Kuota (Slot)</span>
                                    <span className="text-bad-dark text-lg">{quota}</span>
                                </label>
                                <Slider 
                                    defaultValue={[quota]} 
                                    max={50} 
                                    min={10}
                                    step={1} 
                                    onValueChange={(value) => setQuota(value[0])}
                                    className="w-full accent-bad-dark"
                                />
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
                                    <span>10</span>
                                    <span>50</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button className="flex-1 py-4 h-auto bg-bad-dark text-white rounded-xl font-black hover:bg-gray-800 transition shadow-lg">Update Kuota</Button>
                                <Button variant="outline" className="py-4 h-auto px-6 border-gray-200 rounded-xl font-bold text-gray-400 hover:text-bad-red hover:border-bad-red transition">Stop Drop</Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center">
                            <p className="text-xs font-bold text-gray-400">Size S</p>
                            <p className="text-2xl font-black">2</p>
                        </div>
                        <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center">
                            <p className="text-xs font-bold text-gray-400">Size M</p>
                            <p className="text-2xl font-black">4</p>
                        </div>
                        <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center">
                            <p className="text-xs font-bold text-gray-400">Size L</p>
                            <p className="text-2xl font-black">2</p>
                        </div>
                        <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center">
                            <p className="text-xs font-bold text-gray-400">Size XL</p>
                            <p className="text-2xl font-black">1</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
}
