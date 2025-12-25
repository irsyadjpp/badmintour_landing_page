'use client';

import { useState } from 'react';
import { 
    Database, 
    HardDrive, 
    DownloadCloud, 
    UploadCloud, 
    History, 
    CheckCircle2, 
    AlertTriangle, 
    FileJson, 
    RefreshCcw,
    Lock,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// --- Types ---
interface BackupFile {
    id: string;
    filename: string;
    size: string;
    date: string;
    type: 'Manual' | 'Auto';
    status: 'Ready' | 'Corrupted';
}

// --- Mock Data ---
const initialBackups: BackupFile[] = [
    { id: 'BK-001', filename: 'backup_full_2023-10-24.json', size: '12.5 MB', date: 'Today, 10:00 AM', type: 'Manual', status: 'Ready' },
    { id: 'BK-002', filename: 'backup_daily_2023-10-23.json', size: '12.4 MB', date: 'Yesterday, 00:00 AM', type: 'Auto', status: 'Ready' },
    { id: 'BK-003', filename: 'backup_daily_2023-10-22.json', size: '12.2 MB', date: '22 Oct, 00:00 AM', type: 'Auto', status: 'Ready' },
];

export default function DatabasePage() {
    const { toast } = useToast();
    const [backups, setBackups] = useState<BackupFile[]>(initialBackups);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processType, setProcessType] = useState<'backup' | 'restore' | null>(null);

    // --- Actions ---

    const handleCreateBackup = () => {
        setIsProcessing(true);
        setProcessType('backup');
        setProgress(0);

        // Simulasi Progress Bar
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishBackup();
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const finishBackup = () => {
        setTimeout(() => {
            setIsProcessing(false);
            setProcessType(null);
            
            const newBackup: BackupFile = {
                id: `BK-${Math.floor(Math.random() * 1000)}`,
                filename: `backup_manual_${new Date().toISOString().split('T')[0]}.json`,
                size: '12.6 MB',
                date: 'Just Now',
                type: 'Manual',
                status: 'Ready'
            };
            
            setBackups([newBackup, ...backups]);

            toast({
                title: "Snapshot Created",
                description: "Backup database berhasil disimpan ke vault aman.",
                className: "bg-green-600 text-white border-none"
            });
        }, 500);
    };

    const handleRestore = (file: BackupFile) => {
        setIsProcessing(true);
        setProcessType('restore');
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    finishRestore();
                    return 100;
                }
                return prev + 5;
            });
        }, 200);
    };

    const finishRestore = () => {
        setTimeout(() => {
            setIsProcessing(false);
            setProcessType(null);
            toast({
                title: "Time Machine Success",
                description: "System berhasil dikembalikan ke titik restore point.",
                className: "bg-[#ffbe00] text-black font-bold border-none"
            });
        }, 500);
    };

    const handleDelete = (id: string) => {
        setBackups(backups.filter(b => b.id !== id));
        toast({ title: "File Deleted", description: "File backup dihapus permanen.", variant: "destructive" });
    }

    return (
        <main className="pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-orange-600">Vault</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Backup manual, restore point, dan manajemen integritas data.</p>
                </div>
                
                {/* Database Status Chip */}
                <div className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-xl">
                    <Database className="w-4 h-4 text-[#ffbe00]" />
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">DB Status</p>
                        <p className="text-xs font-bold text-green-500">Connected (32ms)</p>
                    </div>
                </div>
            </div>

            {/* PROCESSING OVERLAY (JIKA SEDANG BACKUP/RESTORE) */}
            {isProcessing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#151515] border border-[#ffbe00]/30 p-8 rounded-[2rem] w-full max-w-md text-center shadow-[0_0_50px_rgba(255,190,0,0.2)]">
                        <div className="mb-6 inline-flex p-4 rounded-full bg-[#ffbe00]/10 text-[#ffbe00] animate-pulse">
                            {processType === 'backup' ? <HardDrive className="w-10 h-10"/> : <RefreshCcw className="w-10 h-10 animate-spin"/>}
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">
                            {processType === 'backup' ? 'Creating Snapshot...' : 'Restoring Data...'}
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">Jangan tutup halaman ini sampai proses selesai.</p>
                        <Progress value={progress} className="h-4 bg-white/10" indicatorClassName="bg-[#ffbe00]"/>
                        <p className="text-right text-xs font-bold text-[#ffbe00] mt-2">{progress}%</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: ACTIONS */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* BACKUP CARD */}
                    <div className="bg-[#151515] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-[#ffbe00]/30 transition-colors">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffbe00]/5 rounded-full blur-[50px] pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="p-3 bg-[#ffbe00]/10 text-[#ffbe00] rounded-xl border border-[#ffbe00]/20">
                                <DownloadCloud className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">Create Backup</h3>
                                <p className="text-xs text-gray-500">Manual Snapshot</p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            Simpan seluruh data user, transaksi, dan log ke dalam file JSON terenkripsi. Aman untuk disimpan di local storage.
                        </p>

                        <Button 
                            onClick={handleCreateBackup}
                            disabled={isProcessing}
                            className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                        >
                            <HardDrive className="w-4 h-4"/> Start Backup Process
                        </Button>
                    </div>

                    {/* RESTORE WARNING CARD */}
                    <div className="bg-red-500/5 p-8 rounded-[2.5rem] border border-red-500/20 relative overflow-hidden">
                        <div className="flex items-start gap-4 mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                            <div>
                                <h3 className="text-lg font-black text-white">Danger Zone</h3>
                                <p className="text-xs text-red-200/70 mt-1 leading-relaxed">
                                    Restore data akan <strong>menimpa</strong> seluruh data saat ini dengan versi lama. Pastikan Anda sudah backup data terbaru sebelum melakukan restore.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: HISTORY */}
                <div className="lg:col-span-7">
                    <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-gray-400" />
                                <h3 className="font-bold text-white text-lg">Backup History</h3>
                            </div>
                            <Badge variant="outline" className="border-white/10 text-gray-500">{backups.length} Files</Badge>
                        </div>

                        <div className="space-y-3">
                            {backups.map((file) => (
                                <div key={file.id} className="group flex flex-col md:flex-row items-center justify-between p-4 bg-[#121212] rounded-[1.5rem] border border-white/5 hover:border-white/20 transition-all gap-4">
                                    
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-gray-500">
                                            <FileJson className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{file.filename}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="h-4 px-1 text-[9px] bg-white/5 text-gray-400 hover:bg-white/10">{file.type}</Badge>
                                                <span className="text-[10px] text-gray-600 font-mono">{file.size} • {file.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                        {/* Download Button */}
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-white rounded-xl">
                                            <DownloadCloud className="w-4 h-4"/>
                                        </Button>

                                        {/* Restore Trigger with Alert Dialog */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-[#ffbe00]/10 text-[#ffbe00] hover:bg-[#ffbe00] hover:text-black border border-[#ffbe00]/20 font-bold rounded-xl px-4 h-10 transition-all"
                                                >
                                                    <UploadCloud className="w-4 h-4 mr-2"/> Restore
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-[2rem]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-black">Konfirmasi Restore?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Anda akan mengembalikan sistem ke titik: <strong>{file.filename}</strong> ({file.date}). 
                                                        Data setelah tanggal tersebut akan hilang permanen.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-xl border-white/10 hover:bg-white/5 hover:text-white">Batal</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={() => handleRestore(file)}
                                                        className="rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold"
                                                    >
                                                        Ya, Restore Data
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        {/* Delete Button */}
                                        <Button 
                                            onClick={() => handleDelete(file.id)}
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-10 w-10 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
