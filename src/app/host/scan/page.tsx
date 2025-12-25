'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { 
    Scan, 
    Keyboard, 
    CheckCircle2, 
    XCircle, 
    RefreshCw, 
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

export default function HostScanPage() {
    // --- STATE ---
    const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
    const [scannedData, setScannedData] = useState<string>("");
    const [manualCode, setManualCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Mock Session Data
    const sessionStats = {
        name: "Mabar Senin Ceria",
        checkedIn: 8,
        total: 12,
        percentage: (8/12) * 100
    };

    // --- AUDIO BEEP LOGIC ---
    const playBeep = (type: 'success' | 'error') => {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        if (type === 'success') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime); // High pitch (A5)
            oscillator.frequency.exponentialRampToValueAtTime(1760, context.currentTime + 0.1);
        } else {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, context.currentTime); // Low pitch
            oscillator.frequency.linearRampToValueAtTime(100, context.currentTime + 0.3);
        }

        gainNode.gain.setValueAtTime(0.5, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(context.currentTime + 0.3);
    };

    // --- VALIDATION LOGIC ---
    const handleScan = (data: string | null) => {
        if (data && !isProcessing && !scanResult) {
            setIsProcessing(true);
            setScannedData(data);

            // SIMULASI VALIDASI API
            setTimeout(() => {
                // Contoh Logic: Valid jika diawali "TIC-"
                const isValid = data.startsWith("TIC-");
                
                if (isValid) {
                    setScanResult('success');
                    playBeep('success');
                } else {
                    setScanResult('error');
                    playBeep('error');
                }
                setIsProcessing(false);
            }, 500); 
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setScannedData("");
        setManualCode("");
        setIsProcessing(false);
    };

    const handleError = (err: any) => {
        console.error(err);
        toast({
            title: "Camera Error",
            description: "Pastikan izin kamera aktif dan menggunakan HTTPS.",
            variant: "destructive"
        });
    };

    return (
        <div className="space-y-6 pb-24 max-w-md mx-auto relative min-h-[80vh]">
            
            {/* 1. HEADER & SESSION MONITOR */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Ticket <span className="text-[#ca1f3d]">Scanner</span></h1>
                        <p className="text-xs text-gray-400">Scan QR Code member di pintu masuk.</p>
                    </div>
                    <div className="bg-red-500/10 p-2 rounded-xl animate-pulse">
                        <Activity className="w-6 h-6 text-[#ca1f3d]" />
                    </div>
                </div>

                <Card className="bg-[#151515] border-white/5 p-4 rounded-[1.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ca1f3d]/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex justify-between items-end mb-2 relative z-10">
                        <div>
                            <p className="text-[10px] text-[#ffbe00] font-bold uppercase tracking-widest mb-1">Active Session</p>
                            <h3 className="text-white font-bold">{sessionStats.name}</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-white">{sessionStats.checkedIn}</span>
                            <span className="text-sm text-gray-500">/{sessionStats.total}</span>
                        </div>
                    </div>
                    <Progress value={sessionStats.percentage} className="h-3 bg-[#222]" indicatorClassName="bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]" />
                    <div className="mt-2 flex justify-between text-[10px] text-gray-500 font-medium">
                        <span>Check-in Progress</span>
                        <span>{sessionStats.total - sessionStats.checkedIn} Belum Datang</span>
                    </div>
                </Card>
            </div>

            {/* 2. SCANNER AREA */}
            <Tabs defaultValue="camera" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#151515] p-1 rounded-xl h-12 mb-6">
                    <TabsTrigger value="camera" className="data-[state=active]:bg-[#ca1f3d] data-[state=active]:text-white rounded-lg font-bold text-xs">
                        <Scan className="w-4 h-4 mr-2" /> Live Camera
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="data-[state=active]:bg-[#ffbe00] data-[state=active]:text-black rounded-lg font-bold text-xs">
                        <Keyboard className="w-4 h-4 mr-2" /> Manual Input
                    </TabsTrigger>
                </TabsList>

                {/* --- CAMERA TAB --- */}
                <TabsContent value="camera" className="relative mt-0">
                    <div className="relative aspect-square bg-black rounded-[2rem] overflow-hidden border-2 border-dashed border-[#333] flex items-center justify-center group shadow-2xl">
                        
                        {!scanResult ? (
                            <div className="w-full h-full relative">
                                {/* LIBRARY BARU: @yudiel/react-qr-scanner */}
                                <Scanner
                                    onScan={(result) => {
                                        if (result && result.length > 0) {
                                            handleScan(result[0].rawValue);
                                        }
                                    }}
                                    onError={handleError}
                                    components={{
                                        audio: false, // Kita pakai custom audio
                                        torch: true,
                                        finder: false // Kita pakai custom overlay
                                    }}
                                    styles={{
                                        container: { width: '100%', height: '100%' },
                                        video: { width: '100%', height: '100%', objectFit: 'cover' }
                                    }}
                                />
                                
                                {/* Overlay Scanner Animation */}
                                <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none z-10"></div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                    <div className="w-56 h-56 border-2 border-[#ca1f3d] rounded-3xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#ca1f3d] shadow-[0_0_20px_#ca1f3d] animate-scan-down"></div>
                                        {/* Corner Accents */}
                                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#ffbe00]"></div>
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#ffbe00]"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#ffbe00]"></div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#ffbe00]"></div>
                                    </div>
                                </div>

                                {/* DEBUG BUTTONS */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                                     <Button size="sm" variant="secondary" onClick={() => handleScan("TIC-12345")} className="opacity-50 hover:opacity-100 text-[10px] h-7 bg-white/10 text-white backdrop-blur-md">
                                        Test Valid
                                     </Button>
                                     <Button size="sm" variant="destructive" onClick={() => handleScan("INVALID")} className="opacity-50 hover:opacity-100 text-[10px] h-7">
                                        Test Fail
                                     </Button>
                                </div>
                            </div>
                        ) : null}

                        {/* RESULT OVERLAY (VALID) */}
                        {scanResult === 'success' && (
                            <div className="absolute inset-0 bg-green-600 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 z-50">
                                <CheckCircle2 className="w-24 h-24 text-white mb-4 drop-shadow-lg" />
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-1">ACCESS GRANTED</h2>
                                <p className="text-green-100 font-mono text-lg mb-6">{scannedData}</p>
                                <div className="bg-white/20 px-4 py-2 rounded-xl mb-6 backdrop-blur-sm">
                                    <p className="text-white text-xs font-bold uppercase">Valid for: Mabar Senin Ceria</p>
                                </div>
                                <Button onClick={resetScan} className="bg-white text-green-700 hover:bg-gray-100 font-black rounded-xl w-full h-12 shadow-xl">
                                    SCAN NEXT <Scan className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* RESULT OVERLAY (INVALID) */}
                        {scanResult === 'error' && (
                            <div className="absolute inset-0 bg-[#ca1f3d] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 z-50">
                                <XCircle className="w-24 h-24 text-white mb-4 drop-shadow-lg" />
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-1">ACCESS DENIED</h2>
                                <p className="text-red-100 font-medium mb-6">Tiket tidak valid atau sudah kadaluarsa.</p>
                                <Button onClick={resetScan} className="bg-white text-[#ca1f3d] hover:bg-gray-100 font-black rounded-xl w-full h-12 shadow-xl">
                                    TRY AGAIN <RefreshCw className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-4">Arahkan kamera ke QR Code pada HP Member.</p>
                </TabsContent>

                {/* --- MANUAL INPUT TAB --- */}
                <TabsContent value="manual">
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] min-h-[300px] flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#ffbe00]/10 text-[#ffbe00] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Keyboard className="w-8 h-8" />
                            </div>
                            <h3 className="text-white font-bold text-lg">Input Kode Manual</h3>
                            <p className="text-xs text-gray-500">Gunakan jika kamera bermasalah.</p>
                        </div>

                        <div className="space-y-4">
                            <Input 
                                placeholder="Contoh: TIC-882190" 
                                className="bg-[#0a0a0a] border-white/10 h-14 text-center text-xl font-mono text-white tracking-widest uppercase rounded-xl focus:border-[#ffbe00]"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                            />
                            <Button 
                                onClick={() => handleScan(manualCode)}
                                disabled={manualCode.length < 5}
                                className="w-full h-14 bg-[#ffbe00] hover:bg-yellow-400 text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,190,0,0.3)] transition-all"
                            >
                                VERIFIKASI TIKET
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
