'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpRight, ArrowDownLeft, Loader2, Package, FileText, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceNav } from '@/components/admin/finance-nav';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// FETCH FUNCTION
const fetchLedger = async () => {
    const res = await fetch('/api/admin/finance/ledger');
    if (!res.ok) throw new Error('Failed to fetch ledger');
    return res.json();
};

export default function FinancePage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [txType, setTxType] = useState('INCOME');
    const [totalAmount, setTotalAmount] = useState('');
    const [description, setDescription] = useState('');
    const [proofFile, setProofFile] = useState<string | null>(null);

    // Filter State
    const [filterDate, setFilterDate] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    // Split Transaction State
    type SplitItem = {
        category: string;
        description: string;
        amount: number;
        // Inventory Fields
        qty?: number;
        unitPrice?: number;
        shipping?: number;
    };
    const [splitItems, setSplitItems] = useState<SplitItem[]>([{ category: '', description: '', amount: 0 }]);

    const handleAddSplit = () => {
        setSplitItems([...splitItems, { category: '', description: '', amount: 0 }]);
    };

    const handleRemoveSplit = (index: number) => {
        const newItems = [...splitItems];
        newItems.splice(index, 1);
        setSplitItems(newItems);
    };

    const handleSplitChange = (index: number, field: keyof SplitItem, value: any) => {
        const newItems = [...splitItems];
        (newItems[index] as any)[field] = value;
        setSplitItems(newItems);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({ title: 'File terlalu besar', description: 'Maksimal 2MB', variant: 'destructive' });
                return;
            }
            try {
                const base64 = await convertToBase64(file);
                setProofFile(base64 as string);
            } catch (error) {
                toast({ title: 'Error', description: 'Gagal memproses gambar', variant: 'destructive' });
            }
        }
    };

    const convertToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const { data, isLoading } = useQuery({
        queryKey: ['finance-ledger'],
        queryFn: fetchLedger,
        refetchInterval: 10000 // Real-timeish
    });

    // Fetch COA
    const { data: coaData, isLoading: isCoaLoading } = useQuery({
        queryKey: ['finance-coa'],
        queryFn: async () => {
            const res = await fetch('/api/admin/finance/coa');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        }
    });

    const accounts = coaData?.data || [];


    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await fetch('/api/admin/finance/journal', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to record transaction');
            return res.json();
        },
        onSuccess: () => {
            toast({ title: 'Berhasil', description: 'Transaksi tercatat di jurnal.' });
            queryClient.invalidateQueries({ queryKey: ['finance-ledger'] });
            setIsDialogOpen(false);
            // Reset form
            setTotalAmount('');
            setDescription('');
            setTotalAmount('');
            setDescription('');
            setSplitItems([{ category: '', description: '', amount: 0 }]);
            setProofFile(null);
        },
        onError: () => {
            toast({ title: 'Gagal', description: 'Terjadi kesalahan.', variant: 'destructive' });
        }
    });

    const handleSubmit = () => {
        if (!totalAmount || !description) {
            toast({ title: 'Error', description: 'Mohon lengkapi data utama', variant: 'destructive' });
            return;
        }

        // Validate Split Calculation
        const totalSplit = splitItems.reduce((acc, item) => acc + (item.amount || 0), 0);
        const mainAmount = parseInt(totalAmount);

        if (totalSplit !== mainAmount) {
            toast({
                title: 'Selisih Nominal',
                description: `Total item (${totalSplit.toLocaleString()}) tidak sama dengan Total Transaksi (${mainAmount.toLocaleString()}).`,
                variant: 'destructive'
            });
            return;
        }

        // Check if categories are filled
        if (splitItems.some(i => !i.category)) {
            toast({ title: 'Error', description: 'Semua item harus memiliki kategori.', variant: 'destructive' });
            return;
        }

        mutation.mutate({
            type: txType,
            amount: mainAmount,
            description: description,
            items: splitItems, // Backend needs to handle this array
            proofImage: proofFile
        });
    };

    const ledgerEntries = data?.data || [];

    // CALCULATE STATS (Client Side for now - Phase 1)
    // In real app, this should come from detailed API
    const totalBalance = ledgerEntries.reduce((acc: number, curr: any) => {
        // This is tricky without specific account filtering.
        // Let's assume the API returns what we need. 
        // For now, let's just sum the 'totalAmount' of REVENUE transactions
        if (curr.category === 'REVENUE') return acc + (curr.totalAmount || 0);
        return acc;
    }, 0);

    return (
        <main>
            <FinanceNav />
            <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-[#ffbe00]" /> FINANCE & LEDGER
                        </h1>
                        <p className="text-gray-400 mt-1">Monitoring arus kas dan riwayat transaksi real-time.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#ffbe00] hover:bg-[#d9a200] text-black font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(255,190,0,0.3)]">
                                <Plus className="w-5 h-5 mr-2" /> CATAT TRANSAKSI
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-[2rem] p-6">
                            <DialogHeader>
                                <DialogTitle>Catat Transaksi Manual (Split & Inventory)</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className={`h-12 border-0 font-bold ${txType === 'INCOME' ? 'bg-bad-green text-black hover:bg-bad-green/90' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                        onClick={() => { setTxType('INCOME'); setSplitItems([{ category: '', description: '', amount: 0 }]); }}
                                    >
                                        Pemasukan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`h-12 border-0 font-bold ${txType === 'EXPENSE' ? 'bg-bad-red text-white hover:bg-bad-red/90' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                        onClick={() => { setTxType('EXPENSE'); setSplitItems([{ category: '', description: '', amount: 0 }]); }}
                                    >
                                        Pengeluaran
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label>Total Nominal (Rp)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                        className="bg-[#121212] border-white/10 h-12 rounded-xl text-lg font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Deskripsi Utama</Label>
                                    <Input
                                        placeholder="Contoh: Belanja Bulanan"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-[#121212] border-white/10 h-12 rounded-xl"
                                    />
                                </div>

                                {/* Split Items Section */}
                                <div className="space-y-4 border-t border-white/10 pt-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-gray-400">Rincian Item (Split)</Label>
                                        <Button size="sm" variant="ghost" className="text-[#ffbe00] hover:text-[#ffbe00]/80" onClick={handleAddSplit}>
                                            <Plus className="w-3 h-3 mr-1" /> Tambah Item
                                        </Button>
                                    </div>

                                    {splitItems.map((item, idx) => (
                                        <div key={idx} className="bg-[#121212] p-4 rounded-xl space-y-3 relative group">
                                            {idx > 0 && (
                                                <button
                                                    onClick={() => handleRemoveSplit(idx)}
                                                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    &times;
                                                </button>
                                            )}

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">Kategori</Label>
                                                    <Select
                                                        value={item.category}
                                                        onValueChange={(val) => handleSplitChange(idx, 'category', val)}
                                                    >
                                                        <SelectTrigger className="bg-[#1A1A1A] border-white/10 h-10 text-xs text-white">
                                                            <SelectValue placeholder="Pilih..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                            {isCoaLoading ? <SelectItem value="loading">Loading...</SelectItem> :
                                                                accounts.length > 0 ? (
                                                                    accounts
                                                                        .filter((acc: any) => txType === 'INCOME' ? acc.type === 'REVENUE' : (acc.type === 'EXPENSE' || acc.type === 'COGS' || acc.type === 'ASSET'))
                                                                        .map((acc: any) => (
                                                                            <SelectItem key={acc.code} value={acc.code} className="text-xs focus:bg-[#ffbe00] focus:text-black">
                                                                                <span className="opacity-50 mr-1">{acc.code}</span> {acc.name}
                                                                            </SelectItem>
                                                                        ))
                                                                ) : (<SelectItem value="none" disabled>No Accounts</SelectItem>)
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">Nominal</Label>
                                                    <Input
                                                        type="number"
                                                        className="bg-[#1A1A1A] border-white/10 h-10 text-xs"
                                                        placeholder="Rp 0"
                                                        value={item.amount || ''}
                                                        onChange={(e) => handleSplitChange(idx, 'amount', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <Input
                                                className="bg-[#1A1A1A] border-white/10 h-10 text-xs"
                                                placeholder="Deskripsi Item (Opsional)"
                                                value={item.description}
                                                onChange={(e) => handleSplitChange(idx, 'description', e.target.value)}
                                            />

                                            {/* Inventory Linker Logic */}
                                            {/* Check dynamic COA name or code. Assuming '1-300' logic or future proof with name check */}
                                            {(item.category === '1-301' || item.category === '5-200') && (
                                                <div className="bg-bad-green/10 p-3 rounded-lg border border-bad-green/20">
                                                    <p className="text-[10px] text-bad-green font-bold mb-2 uppercase flex items-center gap-1">
                                                        <Package className="w-3 h-3" /> Inventory Detail
                                                    </p>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <Input placeholder="Qty" type="number" className="h-8 text-xs bg-[#121212]"
                                                            onChange={(e) => handleSplitChange(idx, 'qty', parseInt(e.target.value))} />
                                                        <Input placeholder="Harga @'" type="number" className="h-8 text-xs bg-[#121212]"
                                                            onChange={(e) => handleSplitChange(idx, 'unitPrice', parseInt(e.target.value))} />
                                                        <Input placeholder="Ongkir" type="number" className="h-8 text-xs bg-[#121212]"
                                                            onChange={(e) => handleSplitChange(idx, 'shipping', parseInt(e.target.value))} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex justify-between text-sm font-bold pt-2">
                                        <span className="text-gray-400">Total Ter-input:</span>
                                        <span className={splitItems.reduce((acc, i) => acc + (i.amount || 0), 0) === parseInt(totalAmount || '0') ? 'text-green-500' : 'text-red-500'}>
                                            Rp {splitItems.reduce((acc, i) => acc + (i.amount || 0), 0).toLocaleString()}
                                        </span>

                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-white/10 pt-4">
                                    <Label>Bukti Transfer / Nota (Opsional)</Label>
                                    <Input
                                        type="file"
                                        className="bg-[#121212] border-white/10 text-xs cursor-pointer file:cursor-pointer file:bg-white/10 file:text-white file:border-0 file:rounded-md"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {proofFile && (
                                        <div className="relative w-full h-32 mt-2 rounded-lg overflow-hidden border border-white/10 group">
                                            <img src={proofFile} alt="Preview" className="w-full h-full object-cover" />
                                            <Button
                                                size="sm" variant="destructive"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                                                onClick={() => setProofFile(null)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    className="w-full h-12 rounded-xl bg-[#ffbe00] text-black font-bold hover:bg-[#ffbe00]/90 mt-4"
                                    onClick={handleSubmit}
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending && <Loader2 className="animate-spin mr-2" />}
                                    Simpan Transaksi
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-10 mb-8 relative overflow-hidden group">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-bad-green/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-bad-green/10 transition duration-700"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                Est. Revenue (Last 50 Trx) <span className="w-2 h-2 rounded-full bg-bad-green animate-pulse"></span>
                            </p>
                            <h2 className="text-6xl md:text-8xl font-jersey text-white tracking-wide">
                                Rp {totalBalance.toLocaleString('id-ID', { notation: 'compact', compactDisplay: 'short' })}
                            </h2>
                        </div>
                        <div className="text-right bg-[#121212] p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-lg font-bold text-white">Live Connected</p>
                        </div>
                    </div>
                </div>

                {/* Transactions Table Section */}
                <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h3 className="font-bold text-xl text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" /> Riwayat Transaksi
                        </h3>

                        <div className="flex gap-3 w-full md:w-auto">
                            <Input
                                type="date"
                                className="bg-[#1A1A1A] border-white/10 text-white w-full md:w-40 h-10 rounded-xl text-xs focus:ring-[#ffbe00] focus:border-[#ffbe00]"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-full md:w-48 bg-[#1A1A1A] border-white/10 text-white h-10 rounded-xl text-xs">
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                    <SelectItem value="ALL">Semua Kategori</SelectItem>
                                    <SelectItem value="REVENUE">Revenue</SelectItem>
                                    <SelectItem value="EXPENSE">Expense</SelectItem>
                                    <SelectItem value="ASSET">Asset</SelectItem>
                                    <SelectItem value="LIABILITY">Liability</SelectItem>
                                    <SelectItem value="EQUITY">Equity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/5">
                        <Table>
                            <TableHeader className="bg-[#1A1A1A]">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Tanggal</TableHead>
                                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Deskripsi</TableHead>
                                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Kategori</TableHead>
                                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-right">Nominal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-[#121212]">
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <Loader2 className="animate-spin mx-auto text-[#ffbe00]" />
                                        </TableCell>
                                    </TableRow>
                                ) : ledgerEntries.length > 0 ? (
                                    ledgerEntries
                                        .filter((t: any) => {
                                            if (filterDate && !t.date.startsWith(filterDate)) return false;
                                            if (filterCategory !== 'ALL' && t.entries[0]?.accountCode !== filterCategory && t.entries[1]?.accountCode !== filterCategory) {
                                                // Check specific category in entries
                                                const hasCat = t.entries.some((e: any) => e.accountCode === filterCategory);
                                                // Actually backend structure: category is broad 'REVENUE'/'EXPENSE'. 
                                                // We need to check entries for the specific account code.
                                                // Actually most `entries` have specific code.
                                                if (!hasCat) return false;
                                            }
                                            return true;
                                        })
                                        .map((trx: any) => (
                                            <TableRow key={trx.id} className="border-white/5 hover:bg-white/5 transition">
                                                <TableCell className="font-mono text-xs text-gray-400">
                                                    {format(new Date(trx.date), 'dd MMM yyyy', { locale: idLocale })}
                                                    <div className="text-[10px] opacity-50">{format(new Date(trx.date), 'HH:mm')}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-white flex items-center gap-2">
                                                        {trx.description}
                                                        {trx.metadata?.proofImage && (
                                                            <a href={trx.metadata.proofImage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300" title="Lihat Bukti">
                                                                <Package className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    {trx.metadata?.breakdown && (
                                                        <div className="mt-1 space-y-1">
                                                            {trx.metadata.breakdown.map((item: any, i: number) => (
                                                                <Badge key={i} variant="outline" className="mr-1 text-[10px] border-white/10 bg-white/5 text-gray-400 font-normal">
                                                                    {item.item} ({item.qty || 1}x)
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={trx.category === 'REVENUE' ? 'bg-bad-green/20 text-bad-green hover:bg-bad-green/20' : 'bg-bad-red/20 text-bad-red hover:bg-bad-red/20'}>
                                                        {trx.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className={`text-right font-jersey text-lg ${trx.category === 'REVENUE' ? 'text-bad-green' : 'text-bad-red'}`}>
                                                    {trx.category === 'REVENUE' ? '+' : '-'} {(trx.totalAmount || 0).toLocaleString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            Belum ada data transaksi.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </main >
    )
}
