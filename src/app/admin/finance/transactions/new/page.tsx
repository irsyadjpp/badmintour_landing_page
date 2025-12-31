'use client';

import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpRight, ArrowDownLeft, Loader2, Package, FileText, DollarSign, Wallet, Repeat, BookOpen, AlertCircle, Upload, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FinanceNav } from '@/components/admin/finance-nav';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateTransactionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('expense');

  // --- FORM STATES ---
  const [proofFile, setProofFile] = useState<string | null>(null);

  // 1. EXPENSE FORM
  const [expenseForm, setExpenseForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    sourceAccount: '1-101', // BCA default
    payee: '',
    totalAmount: '',
    details: [{ category: '', amount: 0, description: '' }]
  });

  // 2. INCOME FORM
  const [incomeForm, setIncomeForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    targetAccount: '1-101',
    sourceName: '',
    categoryAccount: '4-100', // Other Income
    amount: '',
    notes: ''
  });

  // 3. TRANSFER FORM
  const [transferForm, setTransferForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    sourceAccount: '1-101',
    targetAccount: '1-102',
    amount: '',
    adminFee: '',
    reference: ''
  });

  // 4. JOURNAL FORM
  const [journalForm, setJournalForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    entries: [
      { accountCode: '', debit: 0, credit: 0 },
      { accountCode: '', debit: 0, credit: 0 }
    ]
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
  const expenseAccounts = accounts.filter((a: any) => ['EXPENSE', 'COGS', 'ASSET'].includes(a.type));
  const revenueAccounts = accounts.filter((a: any) => ['REVENUE', 'EQUITY'].includes(a.type));
  const assetAccounts = accounts.filter((a: any) => a.type === 'ASSET');
  const allAccounts = accounts;

  // --- MUTATIONS ---
  const expenseMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...expenseForm, totalAmount: parseInt(expenseForm.totalAmount),
        details: expenseForm.details.map(d => ({ ...d, category: undefined, coaCode: d.category })),
        proofImage: proofFile
      };
      const res = await fetch('/api/admin/finance/transactions/expense', { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed'); }
      return res.json();
    },
    onSuccess: () => resetAndRedirect('Pengeluaran berhasil dicatat')
  });

  const incomeMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...incomeForm, amount: parseInt(incomeForm.amount), proofImage: proofFile };
      const res = await fetch('/api/admin/finance/transactions/income', { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed'); }
      return res.json();
    },
    onSuccess: () => resetAndRedirect('Pemasukan berhasil dicatat')
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...transferForm,
        amount: parseInt(transferForm.amount),
        adminFee: parseInt(transferForm.adminFee) || 0
      };
      const res = await fetch('/api/admin/finance/transactions/transfer', { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed'); }
      return res.json();
    },
    onSuccess: () => resetAndRedirect('Transfer dana berhasil')
  });

  const journalMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/finance/transactions/journal', { method: 'POST', body: JSON.stringify(journalForm) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed'); }
      return res.json();
    },
    onSuccess: () => resetAndRedirect('Jurnal memorial berhasil diposting')
  });

  const resetAndRedirect = (msg: string) => {
    toast({ title: 'Sukses', description: msg });
    queryClient.invalidateQueries({ queryKey: ['finance-ledger'] });
    router.push('/admin/finance');
  };

  // --- HANDLERS ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setProofFile(reader.result as string);
    }
  };

  // Calculate Totals
  const expenseSplitTotal = expenseForm.details.reduce((acc, item) => acc + (item.amount || 0), 0);
  const isExpenseBalanced = expenseSplitTotal === parseInt(expenseForm.totalAmount || '0');

  const journalDr = journalForm.entries.reduce((acc, e) => acc + (e.debit || 0), 0);
  const journalCr = journalForm.entries.reduce((acc, e) => acc + (e.credit || 0), 0);
  const isJournalBalanced = journalDr === journalCr && journalDr > 0;


  return (
    <main>
      <FinanceNav />
      <div className="max-w-[1200px] mx-auto p-6 md:p-8 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/finance">
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/10 text-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Catat Transaksi Baru</h1>
            <p className="text-gray-400 text-sm">Pilih jenis transaksi yang akan dicatat ke dalam buku besar.</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-white/5 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col md:flex-row">
            {/* SIDEBAR TABS */}
            <div className="w-full md:w-64 bg-[#151515] p-4 border-r border-white/5 flex flex-col gap-2">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Jenis Transaksi</div>
              <TabsList className="bg-transparent flex flex-col items-stretch h-auto gap-2 p-0">
                <TabsTrigger value="expense" className="justify-start px-4 py-3 rounded-xl data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 text-gray-400 font-medium text-sm flex gap-3 transition-colors hover:bg-white/5">
                  <ArrowUpRight className="w-5 h-5" /> Pengeluaran
                </TabsTrigger>
                <TabsTrigger value="income" className="justify-start px-4 py-3 rounded-xl data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500 text-gray-400 font-medium text-sm flex gap-3 transition-colors hover:bg-white/5">
                  <ArrowDownLeft className="w-5 h-5" /> Pemasukan
                </TabsTrigger>
                <TabsTrigger value="transfer" className="justify-start px-4 py-3 rounded-xl data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 text-gray-400 font-medium text-sm flex gap-3 transition-colors hover:bg-white/5">
                  <Repeat className="w-5 h-5" /> Mutasi / Transfer
                </TabsTrigger>
                <TabsTrigger value="journal" className="justify-start px-4 py-3 rounded-xl data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500 text-gray-400 font-medium text-sm flex gap-3 transition-colors hover:bg-white/5">
                  <BookOpen className="w-5 h-5" /> Jurnal Umum
                </TabsTrigger>
              </TabsList>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 min-h-[500px] bg-[#1A1A1A]">

              {/* 1. EXPENSE CONTENT */}
              <TabsContent value="expense" className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-white/5 pb-6 mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2"><div className="w-2 h-8 bg-red-500 rounded-full mr-2"></div> Form Pengeluaran</h2>
                  <p className="text-gray-400 text-sm mt-1 ml-6">Gunakan untuk biaya operasional, pembelian aset, atau pembayaran vendor.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tanggal</Label>
                    <Input type="date" value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })} className="bg-[#121212] border-white/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sumber Dana</Label>
                    <Select value={expenseForm.sourceAccount} onValueChange={val => setExpenseForm({ ...expenseForm, sourceAccount: val })}>
                      <SelectTrigger className="bg-[#121212] border-white/10 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {assetAccounts.map((acc: any) => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Bayar Kepada (Payee)</Label>
                    <Input placeholder="Nama Toko / Karyawan / Vendor" value={expenseForm.payee} onChange={e => setExpenseForm({ ...expenseForm, payee: e.target.value })} className="bg-[#121212] border-white/10 h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Total Keluar (Rp)</Label>
                    <div className="relative">
                      <NumericFormat
                        customInput={Input}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp "
                        placeholder="Rp 0"
                        allowNegative={false}
                        decimalScale={0}
                        value={expenseForm.totalAmount}
                        onValueChange={(values: any) => setExpenseForm({ ...expenseForm, totalAmount: values.value })}
                        className="bg-[#121212] border-white/10 text-xl font-bold pl-12 h-14"
                      />
                    </div>
                  </div>
                </div>

                {/* Split Section */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500/20 p-2 rounded-lg"><Package className="w-5 h-5 text-red-500" /></div>
                      <div>
                        <Label className="text-red-400 font-bold block">Rincian Alokasi (Split)</Label>
                        <p className="text-[10px] text-red-300/70">Pecah transaksi ke beberapa akun beban berbeda.</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 text-red-400 text-xs hover:text-red-300 hover:bg-red-500/20" onClick={() => setExpenseForm({ ...expenseForm, details: [...expenseForm.details, { category: '', amount: 0, description: '' }] })}>+ Tambah Item</Button>
                  </div>

                  <div className="space-y-3">
                    {expenseForm.details.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-3 items-start bg-[#121212] p-3 rounded-xl border border-white/5">
                        <div className="col-span-12 md:col-span-5 space-y-1">
                          <Label className="text-[10px] text-gray-500 uppercase">Akun Beban</Label>
                          <Select value={item.category} onValueChange={val => {
                            const newDet = [...expenseForm.details]; newDet[idx].category = val; setExpenseForm({ ...expenseForm, details: newDet });
                          }}>
                            <SelectTrigger className="h-10 text-sm bg-black/20 border-white/10"><SelectValue placeholder="Pilih Akun" /></SelectTrigger>
                            <SelectContent>
                              {expenseAccounts.map((acc: any) => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-6 md:col-span-3 space-y-1">
                          <Label className="text-[10px] text-gray-500 uppercase">Nominal</Label>
                          <NumericFormat
                            customInput={Input}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            placeholder="Rp 0"
                            decimalScale={0}
                            allowNegative={false}
                            value={item.amount || ''}
                            onValueChange={(values: any) => {
                              const newDet = [...expenseForm.details];
                              newDet[idx].amount = values.floatValue || 0;
                              setExpenseForm({ ...expenseForm, details: newDet });
                            }}
                            className="h-10 text-sm bg-black/20 border-white/10"
                          />
                        </div>
                        <div className="col-span-5 md:col-span-3 space-y-1">
                          <Label className="text-[10px] text-gray-500 uppercase">Keterangan</Label>
                          <Input className="h-10 text-sm bg-black/20 border-white/10" placeholder="Item..." value={item.description} onChange={e => {
                            const newDet = [...expenseForm.details]; newDet[idx].description = e.target.value; setExpenseForm({ ...expenseForm, details: newDet });
                          }} />
                        </div>
                        <div className="col-span-1 flex items-end h-full pb-1">
                          <button className="text-red-500 hover:text-red-400 w-full flex justify-center p-2 hover:bg-red-500/10 rounded-lg transition" onClick={() => {
                            const newDet = [...expenseForm.details]; newDet.splice(idx, 1); setExpenseForm({ ...expenseForm, details: newDet });
                          }}>&times;</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-white/5">
                    <span className="text-gray-500 text-sm">Total Ter-input:</span>
                    <div className="flex items-center gap-3">
                      <span className={isExpenseBalanced ? "text-green-500 font-bold text-lg" : "text-red-500 font-bold text-lg"}>Rp {expenseSplitTotal.toLocaleString()}</span>
                      {isExpenseBalanced ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">Belum Balance</span>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Label className="mb-2 block">Upload Bukti Transaksi</Label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition duration-300 group cursor-pointer relative">
                    <Input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="flex flex-col items-center gap-2">
                      {proofFile ? (
                        <div className="text-green-500 font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6" /> File Terpilih
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-500 group-hover:text-white transition" />
                          <span className="text-gray-500 group-hover:text-white transition text-sm">Klik atau drop file di sini</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button disabled={!isExpenseBalanced || !expenseForm.totalAmount || expenseMutation.isPending} onClick={() => expenseMutation.mutate()} className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-red-600/20">
                    {expenseMutation.isPending && <Loader2 className="animate-spin mr-2" />} Simpan Pengeluaran
                  </Button>
                </div>
              </TabsContent>

              {/* 2. INCOME CONTENT */}
              <TabsContent value="income" className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-white/5 pb-6 mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2"><div className="w-2 h-8 bg-green-500 rounded-full mr-2"></div> Form Pemasukan Lain</h2>
                  <p className="text-gray-400 text-sm mt-1 ml-6">Catat pendapatan di luar sistem booking otomatis (misal: Sponsorship).</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tanggal</Label>
                    <Input type="date" value={incomeForm.date} onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })} className="bg-[#121212] border-white/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Masuk Ke Akun</Label>
                    <Select value={incomeForm.targetAccount} onValueChange={val => setIncomeForm({ ...incomeForm, targetAccount: val })}>
                      <SelectTrigger className="bg-[#121212] border-white/10 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {assetAccounts.map((acc: any) => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Sumber / Diterima Dari</Label>
                    <Input placeholder="Nama Sponsor / Donatur" value={incomeForm.sourceName} onChange={e => setIncomeForm({ ...incomeForm, sourceName: e.target.value })} className="bg-[#121212] border-white/10 h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Kategori Pendapatan</Label>
                    <Select value={incomeForm.categoryAccount} onValueChange={val => setIncomeForm({ ...incomeForm, categoryAccount: val })}>
                      <SelectTrigger className="bg-[#121212] border-white/10 h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {revenueAccounts.map((acc: any) => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nominal Masuk (Rp)</Label>
                    <div className="relative">
                      <NumericFormat
                        customInput={Input}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="Rp "
                        placeholder="Rp 0"
                        decimalScale={0}
                        allowNegative={false}
                        value={incomeForm.amount}
                        onValueChange={(values: any) => setIncomeForm({ ...incomeForm, amount: values.value })}
                        className="bg-[#121212] border-white/10 text-xl font-bold h-14 text-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Label className="mb-2 block">Upload Bukti Transaksi</Label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition duration-300 group cursor-pointer relative">
                    <Input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="flex flex-col items-center gap-2">
                      {proofFile ? (
                        <div className="text-green-500 font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6" /> File Terpilih
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-500 group-hover:text-white transition" />
                          <span className="text-gray-500 group-hover:text-white transition text-sm">Klik atau drop file di sini</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button disabled={incomeMutation.isPending} onClick={() => incomeMutation.mutate()} className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-green-600/20">
                    {incomeMutation.isPending && <Loader2 className="animate-spin mr-2" />} Simpan Pemasukan
                  </Button>
                </div>
              </TabsContent>

              {/* 3. TRANSFER CONTENT */}
              <TabsContent value="transfer" className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-b border-white/5 pb-6 mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2"><div className="w-2 h-8 bg-blue-500 rounded-full mr-2"></div> Form Mutasi / Transfer</h2>
                  <p className="text-gray-400 text-sm mt-1 ml-6">Pindah dana antar akun kas/bank internal.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121212] p-6 rounded-2xl border border-white/5 relative">
                  {/* Arrow Icon in middle */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center border border-white/10 z-10 hidden md:flex">
                    <div className="text-gray-400">→</div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-400">Dari Akun (Source)</Label>
                    <Select value={transferForm.sourceAccount} onValueChange={val => setTransferForm({ ...transferForm, sourceAccount: val })}>
                      <SelectTrigger className="bg-black/40 border-white/10 h-12 border-blue-500/30"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {assetAccounts.map((acc: any) => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-green-400">Ke Akun (Target)</Label>
                    <Select value={transferForm.targetAccount} onValueChange={val => setTransferForm({ ...transferForm, targetAccount: val })}>
                      <SelectTrigger className="bg-black/40 border-white/10 h-12 border-green-500/30"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {assetAccounts.map((acc: any) => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nominal Transfer (Rp)</Label>
                  <NumericFormat
                    customInput={Input}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    placeholder="Rp 0"
                    decimalScale={0}
                    allowNegative={false}
                    value={transferForm.amount}
                    onValueChange={(values: any) => setTransferForm({ ...transferForm, amount: values.value })}
                    className="bg-[#121212] border-white/10 text-xl font-bold h-14"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Biaya Admin (Rp)</Label>
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="Rp "
                      placeholder="Rp 0"
                      decimalScale={0}
                      allowNegative={false}
                      value={transferForm.adminFee}
                      onValueChange={(values: any) => setTransferForm({ ...transferForm, adminFee: values.value })}
                      className="bg-[#121212] border-white/10 h-12"
                    />
                    <p className="text-[10px] text-gray-500">Biaya admin akan otomatis dicatat sebagai beban.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>No. Referensi / Ref</Label>
                    <Input value={transferForm.reference} onChange={e => setTransferForm({ ...transferForm, reference: e.target.value })} className="bg-[#121212] border-white/10 h-12" placeholder="TRF-123..." />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button disabled={transferMutation.isPending} onClick={() => transferMutation.mutate()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-600/20">
                    {transferMutation.isPending && <Loader2 className="animate-spin mr-2" />} Proses Transfer
                  </Button>
                </div>
              </TabsContent>

              {/* 4. JOURNAL CONTENT */}
              <TabsContent value="journal" className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <Alert className="bg-purple-900/20 border-purple-900/50 text-purple-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Perhatian</AlertTitle>
                  <AlertDescription className="text-xs">
                    Fitur ini untuk penyesuaian manual akuntan. Pastikan Debit == Kredit.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tanggal Efektif</Label>
                    <Input type="date" value={journalForm.date} onChange={e => setJournalForm({ ...journalForm, date: e.target.value })} className="bg-[#121212] border-white/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi Jurnal</Label>
                    <Input placeholder="Adjustment..." value={journalForm.description} onChange={e => setJournalForm({ ...journalForm, description: e.target.value })} className="bg-[#121212] border-white/10 h-12" />
                  </div>
                </div>

                {/* Journal Entries */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase px-3">
                    <div className="col-span-6">Akun</div>
                    <div className="col-span-3">Debit</div>
                    <div className="col-span-3">Kredit</div>
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {journalForm.entries.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-3 bg-[#121212] p-3 rounded-xl border border-white/5">
                        <div className="col-span-6">
                          <Select value={item.accountCode} onValueChange={val => {
                            const newEnt = [...journalForm.entries]; newEnt[idx].accountCode = val; setJournalForm({ ...journalForm, entries: newEnt });
                          }}>
                            <SelectTrigger className="h-10 text-xs bg-black/20 border-white/10"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent>
                              {allAccounts.map((acc: any) => <SelectItem key={acc.code} value={acc.code}>{acc.code} - {acc.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <NumericFormat
                          customInput={Input}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp "
                          placeholder="Dr 0"
                          decimalScale={0}
                          allowNegative={false}
                          value={item.debit || ''}
                          onValueChange={(values: any) => {
                            const newEnt = [...journalForm.entries];
                            newEnt[idx].debit = values.floatValue || 0;
                            newEnt[idx].credit = 0;
                            setJournalForm({ ...journalForm, entries: newEnt });
                          }}
                          className="col-span-3 h-10 text-xs bg-black/20 border-white/10"
                        />
                        <NumericFormat
                          customInput={Input}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp "
                          placeholder="Cr 0"
                          decimalScale={0}
                          allowNegative={false}
                          value={item.credit || ''}
                          onValueChange={(values) => {
                            const newEnt = [...journalForm.entries];
                            newEnt[idx].credit = values.floatValue || 0;
                            newEnt[idx].debit = 0;
                            setJournalForm({ ...journalForm, entries: newEnt });
                          }}
                          className="col-span-3 h-10 text-xs bg-black/20 border-white/10"
                        />
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="w-full border border-dashed border-white/10 text-gray-500 hover:text-white h-10" onClick={() => setJournalForm({ ...journalForm, entries: [...journalForm.entries, { accountCode: '', debit: 0, credit: 0 }] })}>
                    + Tambah Baris
                  </Button>
                </div>

                <div className="flex justify-between items-center text-sm font-bold bg-[#121212] p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400">Total Balance:</span>
                  <div className="gap-8 flex">
                    <span className="text-green-500 text-lg">Dr: {journalDr.toLocaleString()}</span>
                    <span className="text-red-500 text-lg">Cr: {journalCr.toLocaleString()}</span>
                  </div>
                </div>
                {!isJournalBalanced && <p className="text-red-500 text-sm font-bold text-center bg-red-500/10 p-2 rounded-lg">Debit & Kredit Belum Seimbang!</p>}

                <div className="pt-4 flex justify-end">
                  <Button disabled={!isJournalBalanced || journalMutation.isPending} onClick={() => journalMutation.mutate()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-purple-600/20">
                    {journalMutation.isPending && <Loader2 className="animate-spin mr-2" />} Posting Jurnal
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
