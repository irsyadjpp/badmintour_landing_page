'use client';

import { useState } from 'react';
import { Check, X, Eye, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function AdminTransactionsPage() {
    const { toast } = useToast();
    const [selectedTx, setSelectedTx] = useState<any>(null); // Untuk modal detail
    const [processing, setProcessing] = useState(false);

    // MOCK DATA (Nanti fetch dari API bookings where status = 'verification_pending')
    const transactions = [
        { 
            id: 'BOOK-001', 
            user: 'Budi Santoso', 
            event: 'Mabar Senin Ceria', 
            amount: '35.000', 
            date: '28 Dec, 10:00',
            status: 'verification_pending',
            proofImage: '/images/hero-bg.jpg' // Placeholder bukti
        },
        { 
            id: 'BOOK-002', 
            user: 'Siti Aminah', 
            event: 'Drilling Class', 
            amount: '50.000', 
            date: '28 Dec, 11:30',
            status: 'paid',
            proofImage: null
        }
    ];

    const handleVerify = async (id: string, action: 'approve' | 'reject') => {
        setProcessing(true);
        try {
            const res = await fetch('/api/admin/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: id, action })
            });
            
            if (res.ok) {
                toast({ title: "Sukses", description: `Transaksi berhasil di-${action}.` });
                setSelectedTx(null);
                // Refresh data list here
            } else {
                throw new Error("Gagal");
            }
        } catch (e) {
            toast({ title: "Error", description: "Gagal memproses transaksi.", variant: "destructive" });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white">VERIFIKASI PEMBAYARAN</h1>
                <p className="text-gray-500">Cek bukti transfer member sebelum menerbitkan tiket.</p>
            </div>

            <Card className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 p-6 rounded-[2rem]">
                {/* List Header */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div className="md:col-span-2">Member / Event</div>
                    <div>Tanggal</div>
                    <div>Nominal</div>
                    <div className="text-right">Aksi</div>
                </div>

                {/* Transaction Items */}
                <div className="space-y-2">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                            <div className="md:col-span-2">
                                <p className="font-bold text-black dark:text-white">{tx.user}</p>
                                <p className="text-xs text-gray-500">{tx.event}</p>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                {tx.date}
                            </div>
                            <div className="text-sm font-black text-black dark:text-white">
                                Rp {tx.amount}
                            </div>
                            <div className="flex justify-end gap-2">
                                {tx.status === 'verification_pending' ? (
                                    <Button 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg px-4"
                                        onClick={() => setSelectedTx(tx)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" /> CEK BUKTI
                                    </Button>
                                ) : (
                                    <Badge variant="outline" className="text-green-600 border-green-600/30 bg-green-500/10">
                                        LUNAS
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* MODAL VERIFIKASI */}
            <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
                <DialogContent className="max-w-2xl bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-white/10 rounded-[2rem]">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Kiri: Gambar Bukti */}
                        <div className="flex-1 bg-black rounded-xl overflow-hidden relative min-h-[300px] flex items-center justify-center border border-white/10">
                            {selectedTx?.proofImage ? (
                                <Image 
                                    src={selectedTx.proofImage} 
                                    alt="Bukti Bayar" 
                                    fill 
                                    className="object-contain"
                                />
                            ) : (
                                <span className="text-gray-500">Gambar Error</span>
                            )}
                        </div>

                        {/* Kanan: Detail & Action */}
                        <div className="flex-1 space-y-6 flex flex-col justify-center">
                            <div>
                                <h3 className="text-xl font-black text-black dark:text-white mb-1">Verifikasi Transaksi</h3>
                                <p className="text-sm text-gray-500">ID: {selectedTx?.id}</p>
                            </div>

                            <div className="space-y-2 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Pengirim</span>
                                    <span className="font-bold text-black dark:text-white">{selectedTx?.user}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Nominal</span>
                                    <span className="font-bold text-black dark:text-white">Rp {selectedTx?.amount}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={() => handleVerify(selectedTx.id, 'approve')}
                                    disabled={processing}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-12 rounded-xl"
                                >
                                    {processing ? <Loader2 className="animate-spin"/> : <><Check className="w-4 h-4 mr-2"/> TERIMA PEMBAYARAN</>}
                                </Button>
                                <Button 
                                    onClick={() => handleVerify(selectedTx.id, 'reject')}
                                    disabled={processing}
                                    variant="outline"
                                    className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold h-12 rounded-xl"
                                >
                                    <X className="w-4 h-4 mr-2"/> TOLAK (MINTA UPLOAD ULANG)
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
