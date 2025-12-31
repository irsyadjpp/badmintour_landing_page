'use client';

import { DollarSign, TrendingUp, Download, CreditCard, ArrowUpRight, Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function CoachFinancePage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [bankDetails, setBankDetails] = useState('');
    const [notes, setNotes] = useState('');

    // Fetch Summary
    const { data, isLoading } = useQuery({
        queryKey: ['coach-finance-summary'],
        queryFn: async () => {
            const res = await fetch('/api/coach/finance/summary');
            if (!res.ok) throw new Error('Failed to fetch summary');
            return res.json();
        }
    });

    const summary = data?.data || { balance: 0, totalEarned: 0, pendingClearance: 0, history: [] };

    // Withdraw Mutation
    const withdrawMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/coach/finance/payouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseInt(withdrawAmount),
                    bankDetails,
                    notes
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed');
            return json;
        },
        onSuccess: () => {
            toast({ title: 'Request Submitted', description: 'Your withdrawal request is pending approval.' });
            setIsWithdrawOpen(false);
            setWithdrawAmount('');
            setNotes('');
            queryClient.invalidateQueries({ queryKey: ['coach-finance-summary'] });
        },
        onError: (err: any) => {
            toast({ title: 'Failed', description: err.message, variant: 'destructive' });
        }
    });

    const handleWithdrawClick = () => {
        setWithdrawAmount(summary.balance.toString());
        setIsWithdrawOpen(true);
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-black text-white"><Loader2 className="animate-spin w-10 h-10 text-[#00f2ea]" /></div>;
    }

    return (
        <div className="space-y-8 pb-20 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-[#00f2ea]" /> EARNINGS
                    </h1>
                    <p className="text-gray-400">Laporan pendapatan dari sesi coaching.</p>
                </div>
                {/* BUTTON FIX: Solid White Background -> Black Text (High Contrast) */}
                <Button className="bg-white text-black hover:bg-gray-200 rounded-xl h-12 font-bold transition-colors w-full md:w-auto shadow-lg border-none">
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </div>

            {/* Main Stats Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Balance Card */}
                <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-[#151515] to-[#0a0a0a] border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    {/* Background Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2ea]/5 rounded-full blur-[80px] group-hover:bg-[#00f2ea]/10 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Available Balance</p>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">
                            Rp {summary.balance.toLocaleString('id-ID')}
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Primary Action: Cyan (Signature) */}
                            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={handleWithdrawClick}
                                        disabled={summary.balance <= 0}
                                        className="bg-[#00f2ea] text-black hover:bg-[#00c2bb] font-black h-14 px-8 rounded-xl shadow-[0_0_20px_rgba(0,242,234,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        WITHDRAW FUNDS
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-[2rem] p-6">
                                    <DialogHeader>
                                        <DialogTitle>Request Payout</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Amount to Withdraw</Label>
                                            <Input
                                                type="number"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                className="bg-[#121212] border-white/10 h-12 text-lg font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Bank Details (Bank Name - Account No - Name)</Label>
                                            <Input
                                                placeholder="e.g. BCA 1234567890 Budi"
                                                value={bankDetails}
                                                onChange={(e) => setBankDetails(e.target.value)}
                                                className="bg-[#121212] border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Notes (Optional)</Label>
                                            <Input
                                                placeholder="Urgent..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                className="bg-[#121212] border-white/10"
                                            />
                                        </div>
                                        <Button
                                            className="w-full h-12 bg-[#00f2ea] text-black font-bold hover:bg-[#00c2bb] mt-4"
                                            onClick={() => withdrawMutation.mutate()}
                                            disabled={withdrawMutation.isPending || !withdrawAmount || parseInt(withdrawAmount) <= 0}
                                        >
                                            {withdrawMutation.isPending ? <Loader2 className="animate-spin" /> : 'Confirm Request'}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Secondary Action: Transparent White Border */}
                            <Button variant="outline" className="bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black h-14 px-6 rounded-xl font-bold transition-all">
                                Add Bank Account
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Secondary Stats */}
                <Card className="bg-[#151515] border-white/10 p-6 rounded-[2.5rem] flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 border border-green-500/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Earned</p>
                            <p className="text-xl font-black text-white">Rp {summary.totalEarned.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5">
                        <div className="w-12 h-12 bg-[#ff0099]/10 rounded-xl flex items-center justify-center text-[#ff0099] border border-[#ff0099]/20">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pending Clearance</p>
                            <p className="text-xl font-black text-white">Rp {summary.pendingClearance.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Transaction History */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5 text-[#00f2ea]" /> Recent Transactions
                </h3>
                <div className="space-y-3">
                    {summary.history.length > 0 ? summary.history.map((trx: any) => (
                        <div key={trx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-[#151515] border border-white/10 hover:border-[#00f2ea]/30 transition group gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-[#0a0a0a] flex items-center justify-center font-bold border border-white/5 transition-colors ${trx.type === 'EARNING' ? 'text-green-500' : 'text-[#ff0099]'}`}>
                                    {trx.type === 'EARNING' ? <ArrowUpRight className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm group-hover:text-[#00f2ea] transition-colors">{trx.description}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {format(new Date(trx.date), 'dd MMM yyyy • HH:mm', { locale: idLocale })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto pl-16 sm:pl-0">
                                <p className={`font-mono font-bold text-lg ${trx.type === 'EARNING' ? 'text-[#00f2ea]' : 'text-gray-400'}`}>
                                    {trx.type === 'EARNING' ? '+' : '-'} Rp {Math.abs(trx.amount).toLocaleString('id-ID')}
                                </p>
                                {trx.status && (
                                    <Badge variant="secondary" className={`text-[9px] mt-1 uppercase font-bold px-2 py-0.5 ${trx.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                        {trx.status}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-gray-500 border border-white/5 rounded-2xl">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
