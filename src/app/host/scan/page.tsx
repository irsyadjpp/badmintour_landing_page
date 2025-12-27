
'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSession } from 'next-auth/react';
import { QrCode, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ScanPage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    
    // State
    const [scanResult, setScanResult] = useState<any>(null);
    const [scanData, setScanData] = useState<any>(null); // Data detail order dari API
    const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);


    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Inisialisasi Scanner
    useEffect(() => {
        // Hanya render scanner jika status 'scanning'
        if (status === 'scanning' && !scannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
            
            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }

        // Cleanup saat unmount atau stop scanning
        return () => {
            if (status !== 'scanning' && scannerRef.current) {
                scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
                scannerRef.current = null;
            }
        };
    }, [status]);

    // Callback saat QR Terbaca
    const onScanSuccess = (decodedText: string, decodedResult: any) => {
        if (status === 'processing') return; // Cegah double process
        handleValidation(decodedText);
    };

    const onScanFailure = (error: any) => {
        // console.warn(`Code scan error = ${error}`);
    };

    // Fungsi Validasi ke API
    const handleValidation = async (qrCode: string) => {
        if (qrCode && !isProcessing && !scanResult) {
            setIsProcessing(true);

            try {
                // CALL REAL API
                const res = await fetch('/api/events/scan', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ ticketCode: qrCode })
                });
                const result = await res.json();

                if (result.success) {
                    setStatus('success');
                    setScannedData(`${result.data.userName} - ${result.data.status}`);
                    //playBeep('success');
                } else {
                    setStatus('error');
                    setScannedData(result.error); // Tampilkan error message
                    //playBeep('error');
                }
            } catch (e) {
                setStatus('error');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setScanData(null);
        setErrorMessage('');
        setStatus('scanning');
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 md:pl-24 pt-24 max-w-2xl mx-auto">
            
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                    <QrCode className="w-8 h-8 text-[#ffbe00]" /> SCANNER
                </h1>
                <p className="text-gray-400 text-sm">Gunakan kamera untuk validasi pengambilan Jersey.</p>
            </div>

            {/* AREA UTAMA */}
            <Card className="bg-[#151515] border-white/10 overflow-hidden rounded-[2rem] min-h-[400px] flex flex-col items-center justify-center relative p-6">
                
                {/* 1. STATE IDLE: Tombol Mulai */}
                {status === 'idle' && (
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 animate-pulse">
                            <QrCode className="w-10 h-10 text-gray-500" />
                        </div>
                        <p className="text-gray-400 max-w-xs mx-auto">Pastikan pencahayaan cukup dan QR Code terlihat jelas.</p>
                        <Button 
                            onClick={() => setStatus('scanning')} 
                            className="bg-[#ffbe00] text-black font-bold px-8 py-6 rounded-xl hover:bg-yellow-400 text-lg shadow-[0_0_20px_rgba(255,190,0,0.4)]"
                        >
                            MULAI SCAN
                        </Button>
                    </div>
                )}

                {/* 2. STATE SCANNING: Kamera */}
                {status === 'scanning' && (
                    <div className="w-full">
                        <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-[#ffbe00]/50 shadow-[0_0_30px_rgba(255,190,0,0.2)]"></div>
                        <p className="text-center text-xs text-gray-500 mt-4 animate-pulse">Mencari QR Code...</p>
                        <Button variant="ghost" onClick={() => setStatus('idle')} className="w-full mt-4 text-red-500">Batal</Button>
                    </div>
                )}

                {/* 3. STATE PROCESSING */}
                {status === 'processing' && (
                    <div className="text-center space-y-4">
                        <Loader2 className="w-16 h-16 text-[#ffbe00] animate-spin mx-auto" />
                        <h3 className="text-xl font-bold text-white">Memverifikasi...</h3>
                        <p className="font-mono text-gray-500">{scanResult}</p>
                    </div>
                )}

                {/* 4. STATE SUCCESS: Hasil Data */}
                {status === 'success' && scanData && (
                    <div className="w-full text-center space-y-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">VERIFIKASI SUKSES</h2>
                            <p className="text-gray-400 text-sm mt-1">Data berhasil disimpan ke database.</p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-3">
                            <InfoRow label="Order ID" value={scanData.orderId} isMono />
                            <InfoRow label="Nama Pemesan" value={scanData.fullName || scanData.senderName} />
                            <InfoRow label="Jersey Name" value={scanData.backName} highlight />
                            <InfoRow label="Ukuran" value={`${scanData.size} (Qty: ${scanData.quantity})`} />
                            <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Status</span>
                                <Badge className="bg-green-500 text-white hover:bg-green-600">PICKED UP</Badge>
                            </div>
                        </div>

                        <Button onClick={resetScan} className="w-full bg-white text-black font-bold h-12 rounded-xl hover:bg-gray-200">
                            Scan Berikutnya
                        </Button>
                    </div>
                )}

                {/* 5. STATE ERROR */}
                {status === 'error' && (
                    <div className="w-full text-center space-y-6 animate-in shake duration-300">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                            <XCircle className="w-10 h-10 text-white" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">VALIDASI GAGAL</h2>
                            <p className="text-red-400 font-bold text-lg mt-2">{errorMessage}</p>
                        </div>

                         {/* Jika Error karena sudah diambil, tampilkan info siapa yg ambil */}
                         {scanData && scanData.scannedBy && (
                            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-sm text-left">
                                <p className="text-red-300 font-bold mb-1">Riwayat Pengambilan:</p>
                                <ul className="list-disc list-inside text-gray-400 space-y-1">
                                    <li>Waktu: <span className="text-white">{new Date(scanData.pickedUpAt).toLocaleString()}</span></li>
                                    <li>Petugas: <span className="text-white">{scanData.scannedBy}</span></li>
                                </ul>
                            </div>
                        )}

                        <Button onClick={resetScan} className="w-full bg-[#1A1A1A] border border-white/20 text-white font-bold h-12 rounded-xl hover:bg-white/10">
                            <RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi
                        </Button>
                    </div>
                )}

            </Card>

            {/* Manual Input Fallback (Jika kamera bermasalah) */}
            {status === 'idle' && (
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 mb-2">Kamera bermasalah?</p>
                    <div className="flex gap-2 max-w-xs mx-auto">
                        <input 
                            type="text" 
                            placeholder="Input ID Manual (JSY-...)" 
                            className="bg-[#151515] border border-white/10 rounded-lg px-4 py-2 text-white text-sm w-full"
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') handleValidation((e.target as HTMLInputElement).value)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper UI Component
function InfoRow({ label, value, isMono = false, highlight = false }: any) {
    return (
        <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">{label}</span>
            <span className={`text-sm font-bold text-right max-w-[60%] ${isMono ? 'font-mono' : ''} ${highlight ? 'text-[#ffbe00] text-lg' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}
