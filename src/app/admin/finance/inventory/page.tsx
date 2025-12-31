'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Package, Plus, Search, Loader2, CalendarIcon, Archive, ArrowRightLeft, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinanceNav } from '@/components/admin/finance-nav';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

export default function InventoryPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');

    // --- DIALOG STATES ---
    const [isRestockOpen, setIsRestockOpen] = useState(false);
    const [isAssetOpen, setIsAssetOpen] = useState(false);
    const [isUsageOpen, setIsUsageOpen] = useState(false);
    const [isOpnameOpen, setIsOpnameOpen] = useState(false);

    // --- SELECTIONS ---
    const [selectedItem, setSelectedItem] = useState<any>(null); // For Restock/Usage/Opname

    // --- FORMS ---

    // 1. Restock Form
    const [restockForm, setRestockForm] = useState({
        qty: '', unitPrice: '', shipping: '', supplier: '', source: 'cash', notes: ''
    });

    // 2. Asset Form
    const [assetForm, setAssetForm] = useState({
        name: '', category: 'Equipment', purchaseDate: new Date(),
        price: '', usefulLife: '24', residualValue: '0', location: 'Gudang', condition: 'new'
    });

    // 3. Usage Form
    const [usageForm, setUsageForm] = useState({
        qty: '', purpose: 'session', notes: ''
    });

    // 4. Opname Form
    const [opnameForm, setOpnameForm] = useState({
        actualQty: '', reason: ''
    });


    // --- QUERIES ---
    const { data, isLoading } = useQuery({
        queryKey: ['inventory'],
        queryFn: async () => {
            const res = await fetch('/api/admin/inventory');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        }
    });

    const items = data?.data || [];

    // Filter logic
    const inventoryItems = items.filter((i: any) => i.category !== 'asset' && i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const assetItems = items.filter((i: any) => i.category === 'asset' && i.name.toLowerCase().includes(searchTerm.toLowerCase()));


    // --- MUTATIONS ---

    // RESTOCK
    const restockMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                itemId: selectedItem.id,
                qty: parseInt(restockForm.qty),
                unitPrice: parseInt(restockForm.unitPrice),
                shippingCost: parseInt(restockForm.shipping) || 0,
                sourceOfFund: restockForm.source,
                supplier: restockForm.supplier,
                notes: restockForm.notes
            };
            const res = await fetch('/api/admin/inventory/restock', { method: 'POST', body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            toast({ title: 'Restock Berhasil', description: 'Stok diperbarui.' });
            setIsRestockOpen(false);
            resetForms();
        },
        onError: () => toast({ title: 'Gagal', variant: 'destructive' })
    });

    // ASSET REGISTRATION
    const assetMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                name: assetForm.name,
                category: assetForm.category,
                purchaseDate: assetForm.purchaseDate.toISOString(),
                price: parseInt(assetForm.price),
                usefulLife: parseInt(assetForm.usefulLife),
                residualValue: parseInt(assetForm.residualValue),
                location: assetForm.location,
                condition: assetForm.condition
            };
            const res = await fetch('/api/admin/inventory/asset', { method: 'POST', body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            toast({ title: 'Aset Tercatat', description: 'Aset tetap baru berhasil didaftarkan.' });
            setIsAssetOpen(false);
            resetForms();
        }
    });

    // USAGE
    const usageMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                itemId: selectedItem.id,
                qty: parseInt(usageForm.qty),
                purpose: usageForm.purpose,
                notes: usageForm.notes
            };
            const res = await fetch('/api/admin/inventory/usage', { method: 'POST', body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            toast({ title: 'Pemakaian Tercatat', description: 'Stok telah dikurangi.' });
            setIsUsageOpen(false);
            resetForms();
        }
    });

    // OPNAME
    const opnameMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                itemId: selectedItem.id,
                actualQty: parseInt(opnameForm.actualQty),
                reason: opnameForm.reason
            };
            const res = await fetch('/api/admin/inventory/opname', { method: 'POST', body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            toast({ title: 'Opname Selesai', description: 'Stok fisik telah disesuaikan.' });
            setIsOpnameOpen(false);
            resetForms();
        }
    });

    const resetForms = () => {
        setRestockForm({ qty: '', unitPrice: '', shipping: '', supplier: '', source: 'cash', notes: '' });
        setAssetForm({ name: '', category: 'Equipment', purchaseDate: new Date(), price: '', usefulLife: '24', residualValue: '0', location: 'Gudang', condition: 'new' });
        setUsageForm({ qty: '', purpose: 'session', notes: '' });
        setOpnameForm({ actualQty: '', reason: '' });
        setSelectedItem(null);
    };

    return (
        <main>
            <FinanceNav />
            <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Package className="w-8 h-8 text-[#ffbe00]" /> INVENTORY & ASET
                        </h1>
                        <p className="text-gray-400 mt-1">Manajemen stok barang habis pakai dan aset tetap.</p>
                    </div>
                </div>

                {/* TABS CONTAINER */}
                <Tabs defaultValue="inventory" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-between items-center mb-6">
                        <TabsList className="bg-[#151515] border border-white/5 p-1 rounded-xl h-auto">
                            <TabsTrigger value="inventory" className="px-6 py-2 rounded-lg data-[state=active]:bg-[#ffbe00] data-[state=active]:text-black font-bold">
                                Inventory (Stok)
                            </TabsTrigger>
                            <TabsTrigger value="assets" className="px-6 py-2 rounded-lg data-[state=active]:bg-[#ffbe00] data-[state=active]:text-black font-bold">
                                Fixed Assets (Aset Tetap)
                            </TabsTrigger>
                        </TabsList>

                        {/* SEARCH & ACTIONS */}
                        <div className="flex gap-4">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Cari Item..."
                                    className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl h-10 focus:ring-[#ffbe00] focus:border-[#ffbe00]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {activeTab === 'assets' && (
                                <Button
                                    onClick={() => setIsAssetOpen(true)}
                                    className="bg-[#ca1f3d] hover:bg-[#a01830] text-white font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(202,31,61,0.3)]"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> REGISTRASI ASET
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* --- INVENTORY TAB CONTENT --- */}
                    <TabsContent value="inventory" className="space-y-6">
                        <div className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden p-1">
                            <table className="w-full text-left">
                                <thead className="bg-[#1A1A1A] text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="p-6">Nama Barang</th>
                                        <th className="p-6 text-center">Stok</th>
                                        <th className="p-6">HPP (Avg)</th>
                                        <th className="p-6">Total Valuasi</th>
                                        <th className="p-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin w-6 h-6 mx-auto" /></td></tr>
                                    ) : inventoryItems.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada item ditemukan.</td></tr>
                                    ) : (
                                        inventoryItems.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-white/[0.02] transition">
                                                <td className="p-6 font-bold text-white">
                                                    {item.name}
                                                    <div className="text-xs text-gray-500 font-normal mt-1">{item.sku}</div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`font-black text-lg ${item.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                                        {item.stock} <span className="text-xs font-medium text-gray-400">{item.unit}</span>
                                                    </span>
                                                </td>
                                                <td className="p-6">Rp {(item.avgCost || 0).toLocaleString('id-ID')}</td>
                                                <td className="p-6 font-medium text-gray-400">Rp {(item.stock * item.avgCost).toLocaleString('id-ID')}</td>
                                                <td className="p-6 text-right flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="h-8 border-green-500/20 text-green-500 hover:bg-green-500/10"
                                                        onClick={() => { setSelectedItem(item); setIsRestockOpen(true); }}
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> Restock
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 border-red-500/20 text-red-500 hover:bg-red-500/10"
                                                        onClick={() => { setSelectedItem(item); setIsUsageOpen(true); }}
                                                    >
                                                        <ArrowRightLeft className="w-3 h-3 mr-1" /> Pakai
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-white"
                                                        onClick={() => { setSelectedItem(item); setIsOpnameOpen(true); }}
                                                    >
                                                        <FileSpreadsheet className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    {/* --- ASSETS TAB CONTENT --- */}
                    <TabsContent value="assets" className="space-y-6">
                        <div className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden p-1">
                            <table className="w-full text-left">
                                <thead className="bg-[#1A1A1A] text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="p-6">Nama Aset</th>
                                        <th className="p-6">Kategori</th>
                                        <th className="p-6">Tgl Beli</th>
                                        <th className="p-6">Harga Perolehan</th>
                                        <th className="p-6">Lokasi</th>
                                        <th className="p-6 text-center">Kondisi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="animate-spin w-6 h-6 mx-auto" /></td></tr>
                                    ) : assetItems.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada aset terdaftar.</td></tr>
                                    ) : (
                                        assetItems.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-white/[0.02] transition">
                                                <td className="p-6 font-bold text-white">{item.name}</td>
                                                <td className="p-6"><span className="bg-white/5 px-2 py-1 rounded text-xs">{item.category}</span></td>
                                                <td className="p-6 text-gray-400">{item.purchaseDate ? format(new Date(item.purchaseDate), 'dd MMM yyyy') : '-'}</td>
                                                <td className="p-6 text-gray-300">Rp {(item.avgCost || 0).toLocaleString('id-ID')}</td>
                                                <td className="p-6 text-gray-400">{item.location || '-'}</td>
                                                <td className="p-6 text-center">
                                                    <span className={cn("px-2 py-1 rounded text-xs font-bold uppercase",
                                                        item.condition === 'new' ? "bg-green-500/10 text-green-500" :
                                                            item.condition === 'used' ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                                                    )}>
                                                        {item.condition || 'Unknown'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* --- DIALOGS --- */}

                {/* 1. RESTOCK DIALOG */}
                <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                    <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Restock: {selectedItem?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jumlah ({selectedItem?.unit})</Label>
                                    <Input type="number" value={restockForm.qty} onChange={e => setRestockForm({ ...restockForm, qty: e.target.value })} className="bg-[#121212] border-white/10" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Harga Satuan (Rp)</Label>
                                    <Input type="number" value={restockForm.unitPrice} onChange={e => setRestockForm({ ...restockForm, unitPrice: e.target.value })} className="bg-[#121212] border-white/10" placeholder="0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Supplier / Toko</Label>
                                <Input value={restockForm.supplier} onChange={e => setRestockForm({ ...restockForm, supplier: e.target.value })} className="bg-[#121212] border-white/10" placeholder="Nama Toko" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ongkos Kirim (Rp)</Label>
                                    <Input type="number" value={restockForm.shipping} onChange={e => setRestockForm({ ...restockForm, shipping: e.target.value })} className="bg-[#121212] border-white/10" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sumber Dana</Label>
                                    <Select value={restockForm.source} onValueChange={(val: any) => setRestockForm({ ...restockForm, source: val })}>
                                        <SelectTrigger className="bg-[#121212] border-white/10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Kas Operasional</SelectItem>
                                            <SelectItem value="reimburse">Reimburse (Admin)</SelectItem>
                                            <SelectItem value="payable">Hutang (Payable)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Calculation Summary */}
                            <div className="bg-[#121212] p-4 rounded-xl space-y-2 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Total Barang:</span>
                                    <span>Rp {((parseInt(restockForm.qty) || 0) * (parseInt(restockForm.unitPrice) || 0)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Total Ongkir:</span>
                                    <span>Rp {(parseInt(restockForm.shipping) || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2 mt-2">
                                    <span>Grand Total:</span>
                                    <span className="text-green-500">Rp {(((parseInt(restockForm.qty) || 0) * (parseInt(restockForm.unitPrice) || 0)) + (parseInt(restockForm.shipping) || 0)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-orange-400 mt-1">
                                    <span>Landed Cost / Unit:</span>
                                    <span>Rp {restockForm.qty ? Math.round((((parseInt(restockForm.qty) || 0) * (parseInt(restockForm.unitPrice) || 0)) + (parseInt(restockForm.shipping) || 0)) / parseInt(restockForm.qty)).toLocaleString() : 0}</span>
                                </div>
                            </div>

                            <Button className="w-full bg-[#ffbe00] text-black font-bold h-12 rounded-xl mt-2 hover:bg-[#ffbe00]/90" onClick={() => restockMutation.mutate()} disabled={restockMutation.isPending}>
                                {restockMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null} Konfirmasi Restock
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* 2. ASSET REGISTRATION DIALOG */}
                <Dialog open={isAssetOpen} onOpenChange={setIsAssetOpen}>
                    <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Registrasi Aset Baru (Capex)</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                            <div className="space-y-2">
                                <Label>Nama Aset</Label>
                                <Input value={assetForm.name} onChange={e => setAssetForm({ ...assetForm, name: e.target.value })} className="bg-[#121212] border-white/10" placeholder="e.g. Mesin Drilling" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Kategori</Label>
                                    <Select value={assetForm.category} onValueChange={val => setAssetForm({ ...assetForm, category: val })}>
                                        <SelectTrigger className="bg-[#121212] border-white/10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Equipment">Peralatan (Equipment)</SelectItem>
                                            <SelectItem value="Furniture">Furniture</SelectItem>
                                            <SelectItem value="Electronic">Elektronik</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Beli</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal bg-[#121212] border-white/10 text-white", !assetForm.purchaseDate && "text-muted-foreground")}>
                                                {assetForm.purchaseDate ? format(assetForm.purchaseDate, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={assetForm.purchaseDate} onSelect={(date) => date && setAssetForm({ ...assetForm, purchaseDate: date })} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Harga Perolehan (Rp)</Label>
                                <Input type="number" value={assetForm.price} onChange={e => setAssetForm({ ...assetForm, price: e.target.value })} className="bg-[#121212] border-white/10" placeholder="0" />
                                <p className="text-xs text-gray-500">Total harga beli + instalasi + pengiriman.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Masa Manfaat (Bln)</Label>
                                    <Input type="number" value={assetForm.usefulLife} onChange={e => setAssetForm({ ...assetForm, usefulLife: e.target.value })} className="bg-[#121212] border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nilai Sisa (Rp)</Label>
                                    <Input type="number" value={assetForm.residualValue} onChange={e => setAssetForm({ ...assetForm, residualValue: e.target.value })} className="bg-[#121212] border-white/10" />
                                </div>
                            </div>

                            <Button className="w-full bg-[#ca1f3d] text-white font-bold h-12 rounded-xl mt-4 hover:bg-[#a01830]" onClick={() => assetMutation.mutate()} disabled={assetMutation.isPending}>
                                {assetMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null} Simpan Aset
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* 3. USAGE DIALOG */}
                <Dialog open={isUsageOpen} onOpenChange={setIsUsageOpen}>
                    <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl max-w-md">
                        <DialogHeader>
                            <DialogTitle>Catat Pemakaian: {selectedItem?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Jumlah Keluar</Label>
                                <Input type="number" value={usageForm.qty} onChange={e => setUsageForm({ ...usageForm, qty: e.target.value })} className="bg-[#121212] border-white/10" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Tujuan Pemakaian</Label>
                                <Select value={usageForm.purpose} onValueChange={val => setUsageForm({ ...usageForm, purpose: val })}>
                                    <SelectTrigger className="bg-[#121212] border-white/10"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="session">Sesi Latihan (Drilling/Mabar)</SelectItem>
                                        <SelectItem value="sales">Penjualan (Member/Guest)</SelectItem>
                                        <SelectItem value="gift">Hadiah / Promo</SelectItem>
                                        <SelectItem value="loss">Rusak / Hilang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Catatan</Label>
                                <Textarea value={usageForm.notes} onChange={e => setUsageForm({ ...usageForm, notes: e.target.value })} className="bg-[#121212] border-white/10" placeholder="Keterangan tambahan..." />
                            </div>
                            <Button className="w-full bg-[#1A1A1A] border border-white/20 text-white font-bold h-12 rounded-xl mt-4 hover:bg-white/10" onClick={() => usageMutation.mutate()} disabled={usageMutation.isPending}>
                                {usageMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null} Catat Pengeluaran Stok
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* 4. OPNAME DIALOG */}
                <Dialog open={isOpnameOpen} onOpenChange={setIsOpnameOpen}>
                    <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl max-w-md">
                        <DialogHeader>
                            <DialogTitle>Stock Opname: {selectedItem?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="bg-[#121212] p-4 rounded-xl text-center">
                                <p className="text-gray-400 text-sm mb-1">Stok di Aplikasi</p>
                                <p className="text-3xl font-black text-white">{selectedItem?.stock || 0}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Stok Fisik (Riil)</Label>
                                <Input type="number" value={opnameForm.actualQty} onChange={e => setOpnameForm({ ...opnameForm, actualQty: e.target.value })} className="bg-[#121212] border-white/10 text-lg font-bold text-center" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Alasan Selisih / Catatan</Label>
                                <Textarea value={opnameForm.reason} onChange={e => setOpnameForm({ ...opnameForm, reason: e.target.value })} className="bg-[#121212] border-white/10" placeholder="Mengapa ada selisih?" />
                            </div>

                            {/* Variance Preview */}
                            {opnameForm.actualQty && parseInt(opnameForm.actualQty) !== selectedItem?.stock && (
                                <div className={`p-3 rounded-lg text-sm text-center font-bold ${parseInt(opnameForm.actualQty) > selectedItem?.stock ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                    Selisih: {parseInt(opnameForm.actualQty) - selectedItem?.stock} {selectedItem?.unit} (Rp {Math.abs((parseInt(opnameForm.actualQty) - selectedItem?.stock) * selectedItem?.avgCost).toLocaleString()})
                                </div>
                            )}

                            <Button className="w-full bg-[#ffbe00] text-black font-bold h-12 rounded-xl mt-4 hover:bg-[#ffbe00]/90" onClick={() => opnameMutation.mutate()} disabled={opnameMutation.isPending}>
                                {opnameMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null} Simpan Penyesuaian
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </main>
    );
}
