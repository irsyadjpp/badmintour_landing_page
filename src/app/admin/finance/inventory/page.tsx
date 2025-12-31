
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Package, Plus, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FinanceNav } from '@/components/admin/finance-nav';

export default function InventoryPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Restock Form
    const [restockQty, setRestockQty] = useState('');
    const [restockUnitPrice, setRestockUnitPrice] = useState('');
    const [restockShipping, setRestockShipping] = useState('');
    const [isRestockOpen, setIsRestockOpen] = useState(false);

    // Add Item Form
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('consumable');
    const [newItemUnit, setNewItemUnit] = useState('Pcs');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Add Item Mutation
    const addItemMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await fetch('/api/admin/inventory/create', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            toast({ title: 'Item Ditambahkan', description: 'Item baru siap digunakan.' });
            setIsAddOpen(false);
            setNewItemName('');
        },
        onError: () => toast({ title: 'Gagal', variant: 'destructive' })
    });

    const handleAddItem = () => {
        if (!newItemName) return;
        addItemMutation.mutate({
            name: newItemName,
            category: newItemCategory,
            unit: newItemUnit,
            initialStock: 0,
            initialAvgCost: 0
        });
    };

    // Fetch Inventory
    const { data, isLoading } = useQuery({
        queryKey: ['inventory'],
        queryFn: async () => {
            const res = await fetch('/api/admin/inventory');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        }
    });

    // Restock Mutation
    const restockMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await fetch('/api/admin/inventory/restock', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            toast({ title: 'Restock Berhasil', description: 'Stok dan Jurnal telah diperbarui.' });
            setIsRestockOpen(false);
            setRestockQty('');
            setRestockUnitPrice('');
            setRestockShipping('');
        },
        onError: () => toast({ title: 'Gagal', variant: 'destructive' })
    });

    const items = data?.data || [];
    const filteredItems = items.filter((i: any) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRestockSubmit = () => {
        if (!selectedItem || !restockQty || !restockUnitPrice) return;
        restockMutation.mutate({
            itemId: selectedItem.id,
            qty: parseInt(restockQty),
            unitPrice: parseInt(restockUnitPrice),
            shippingCost: parseInt(restockShipping) || 0
        });
    };

    return (
        <main>
            <FinanceNav />
            <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Package className="w-8 h-8 text-[#ffbe00]" /> INVENTORY & ASET
                        </h1>
                        <p className="text-gray-400 mt-1">Manajemen stok shuttlecock, jersey, dan aset fisik.</p>
                    </div>
                    {/* For Phase 3: Add New Item Button */}
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-[#ffbe00] hover:bg-[#d9a200] text-black font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(255,190,0,0.3)]"
                    >
                        <Plus className="w-5 h-5 mr-2" /> TAMBAH ITEM
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Cari Shuttlecock, Jersey..."
                        className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl h-12 focus:ring-[#ffbe00] focus:border-[#ffbe00]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Inventory Table */}
                <div className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden p-1">
                    <table className="w-full text-left">
                        <thead className="bg-[#1A1A1A] text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="p-6">Nama Item</th>
                                <th className="p-6">Kategori</th>
                                <th className="p-6 text-center">Stok</th>
                                <th className="p-6">Avg Cost (HPP)</th>
                                <th className="p-6">Valuasi Total</th>
                                <th className="p-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="animate-spin w-6 h-6 mx-auto" /></td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        Belum ada inventory. Silakan tambah item di database (Phase 3).
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition">
                                        <td className="p-6 font-bold text-white">{item.name}</td>
                                        <td className="p-6"><span className="bg-white/5 px-2 py-1 rounded text-xs uppercase">{item.category}</span></td>
                                        <td className="p-6 text-center">
                                            <span className={`font-black text-lg ${item.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                                {item.stock} {item.unit}
                                            </span>
                                        </td>
                                        <td className="p-6">Rp {(item.avgCost || 0).toLocaleString('id-ID')}</td>
                                        <td className="p-6 text-gray-400">Rp {(item.stock * item.avgCost).toLocaleString('id-ID')}</td>
                                        <td className="p-6 text-right">
                                            <Button
                                                size="sm"
                                                className="rounded-full bg-[#ffbe00] text-black hover:bg-[#ffbe00]/80 font-bold"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsRestockOpen(true);
                                                }}
                                            >
                                                Restock
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Item Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Tambah Item Baru</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nama Barang / Aset</Label>
                                <Input
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="bg-[#121212] border-white/10"
                                    placeholder="Contoh: Shuttlecock Samurai"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Kategori</Label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-white/10 bg-[#121212] text-sm"
                                        value={newItemCategory}
                                        onChange={(e) => setNewItemCategory(e.target.value)}
                                    >
                                        <option value="consumable">Barang Habis Pakai</option>
                                        <option value="asset">Aset Tetap</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Satuan</Label>
                                    <Input
                                        value={newItemUnit}
                                        onChange={(e) => setNewItemUnit(e.target.value)}
                                        className="bg-[#121212] border-white/10"
                                        placeholder="Pcs/Slop"
                                    />
                                </div>
                            </div>
                            <Button
                                className="w-full bg-[#ffbe00] text-black font-bold h-12 rounded-xl mt-4 hover:bg-[#ffbe00]/90"
                                onClick={handleAddItem}
                                disabled={addItemMutation.isPending}
                            >
                                {addItemMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                                Simpan Item
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Restock Dialog */}
                <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                    <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Restock {selectedItem?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Jumlah Masuk ({selectedItem?.unit})</Label>
                                <Input
                                    type="number"
                                    value={restockQty}
                                    onChange={(e) => setRestockQty(e.target.value)}
                                    className="bg-[#121212] border-white/10"
                                    placeholder="Contoh: 10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Harga Beli Satuan (Rp)</Label>
                                <Input
                                    type="number"
                                    value={restockUnitPrice}
                                    onChange={(e) => setRestockUnitPrice(e.target.value)}
                                    className="bg-[#121212] border-white/10"
                                    placeholder="Harga per unit"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Biaya Ongkir / Lain-lain (Rp)</Label>
                                <Input
                                    type="number"
                                    value={restockShipping}
                                    onChange={(e) => setRestockShipping(e.target.value)}
                                    className="bg-[#121212] border-white/10"
                                    placeholder="Total Ongkir"
                                />
                            </div>

                            {/* Summary Calculation */}
                            <div className="bg-[#121212] p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Total Barang:</span>
                                    <span>Rp {((parseInt(restockQty) || 0) * (parseInt(restockUnitPrice) || 0)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Total Ongkir:</span>
                                    <span>Rp {(parseInt(restockShipping) || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2">
                                    <span>Landed Cost (Modal Baru):</span>
                                    <span>
                                        Rp {restockQty && restockUnitPrice ?
                                            Math.round(((parseInt(restockQty) * parseInt(restockUnitPrice)) + (parseInt(restockShipping) || 0)) / parseInt(restockQty)).toLocaleString()
                                            : 0
                                        } / unit
                                    </span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-green-500 text-black font-bold h-12 rounded-xl mt-4 hover:bg-green-400"
                                onClick={handleRestockSubmit}
                                disabled={restockMutation.isPending}
                            >
                                {restockMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                                Konfirmasi & Catat Jurnal
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </main >
    );
}
