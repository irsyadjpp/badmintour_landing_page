'use client';

import { useState } from 'react';
import { 
    Save, 
    Server, 
    CreditCard, 
    MessageCircle, 
    Lock, 
    Eye, 
    EyeOff, 
    RefreshCcw, 
    Zap,
    Globe,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function GlobalConfigPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // State visibility password
    const [showPaymentKey, setShowPaymentKey] = useState(false);
    const [showWaToken, setShowWaToken] = useState(false);

    // --- MOCK DATA STATE ---
    
    // 1. System Config
    const [systemConfig, setSystemConfig] = useState({
        maintenanceMode: false,
        allowRegistration: true,
        debugMode: false,
        httpsRedirect: true,
        appName: 'BadminTour',
        maxUploadSize: 5 // MB
    });

    // 2. Payment Gateway (Midtrans/Xendit)
    const [paymentConfig, setPaymentConfig] = useState({
        provider: 'midtrans',
        environment: 'sandbox',
        serverKey: 'SB-Mid-server-xxxx-xxxx',
        clientKey: 'SB-Mid-client-xxxx-xxxx',
        merchantId: 'M-12345678'
    });

    // 3. Whatsapp API (Fonnte/Twilio)
    const [waConfig, setWaConfig] = useState({
        provider: 'fonnte',
        apiKey: '1234567890abcdef',
        senderNumber: '6281234567890',
        autoReply: true
    });

    // --- HANDLERS ---

    const handleSave = () => {
        setIsLoading(true);
        // Simulasi API Call
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Configuration Saved",
                description: "Perubahan sistem telah diterapkan secara global.",
                className: "bg-[#ffbe00] text-black font-bold border-none"
            });
        }, 1500);
    };

    const handleTestConnection = (service: 'payment' | 'whatsapp') => {
        toast({
            title: "Testing Connection...",
            description: `Menghubungi server ${service === 'payment' ? paymentConfig.provider : waConfig.provider}...`,
        });
        
        setTimeout(() => {
            toast({
                title: "Connection Success",
                description: `Terhubung ke ${service === 'payment' ? 'Gateway' : 'API'} dengan latency 45ms.`,
                className: "bg-green-600 text-white border-none"
            });
        }, 1000);
    }

    return (
        <main className="pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-orange-600">Config</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Pusat kendali variabel sistem, payment gateway, dan integrasi API.</p>
                </div>
                
                <Button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-[#ffbe00] text-black hover:bg-yellow-400 font-black rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(255,190,0,0.3)] transition-all active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin mr-2"/> : <Save className="w-5 h-5 mr-2"/>}
                    {isLoading ? 'Applying...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN (System & Payment) */}
                <div className="lg:col-span-7 space-y-8">
                    
                    {/* 1. SYSTEM CONTROL (The "Nuclear" Switches) */}
                    <section className="bg-[#151515] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
                                <Server className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">System Core</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Server Environment & Safety</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {/* Maintenance Switch */}
                            <div className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${systemConfig.maintenanceMode ? 'bg-red-500/10 border-red-500/50' : 'bg-[#1A1A1A] border-white/5'}`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-bold text-sm ${systemConfig.maintenanceMode ? 'text-red-500' : 'text-white'}`}>Maintenance Mode</h3>
                                        {systemConfig.maintenanceMode && <Badge variant="destructive" className="text-[9px]">ACTIVE</Badge>}
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-tight max-w-[250px]">
                                        Aktifkan "Lockdown" untuk menutup akses publik saat update sistem.
                                    </p>
                                </div>
                                <Switch 
                                    checked={systemConfig.maintenanceMode} 
                                    onCheckedChange={(c) => setSystemConfig({...systemConfig, maintenanceMode: c})}
                                    className="data-[state=checked]:bg-red-500"
                                />
                            </div>

                            {/* Registration Switch */}
                            <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1">Open Registration</h3>
                                    <p className="text-[10px] text-gray-500 leading-tight">
                                        Izinkan user baru mendaftar (Sign Up).
                                    </p>
                                </div>
                                <Switch 
                                    checked={systemConfig.allowRegistration} 
                                    onCheckedChange={(c) => setSystemConfig({...systemConfig, allowRegistration: c})}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>

                            {/* General Inputs */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-gray-500 uppercase">App Name</Label>
                                    <Input 
                                        value={systemConfig.appName}
                                        onChange={(e) => setSystemConfig({...systemConfig, appName: e.target.value})}
                                        className="bg-[#0a0a0a] border-white/10 text-white font-bold h-12 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-gray-500 uppercase">Max Upload (MB)</Label>
                                    <div className="relative">
                                        <Input 
                                            type="number"
                                            value={systemConfig.maxUploadSize}
                                            onChange={(e) => setSystemConfig({...systemConfig, maxUploadSize: parseInt(e.target.value)})}
                                            className="bg-[#0a0a0a] border-white/10 text-white font-bold h-12 rounded-xl pr-10"
                                        />
                                        <span className="absolute right-4 top-4 text-xs font-bold text-gray-600">MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. PAYMENT GATEWAY */}
                    <section className="bg-[#151515] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-8">
                             <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Payment Vault</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Gateway Integration</p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => handleTestConnection('payment')}
                                variant="outline" 
                                className="h-10 text-xs font-bold border-white/10 hover:bg-white/5 text-gray-400"
                            >
                                Test Connection
                            </Button>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-gray-500 uppercase">Provider</Label>
                                    <Select 
                                        value={paymentConfig.provider} 
                                        onValueChange={(val) => setPaymentConfig({...paymentConfig, provider: val})}
                                    >
                                        <SelectTrigger className="w-full bg-[#0a0a0a] border-white/10 h-12 text-white font-bold rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                            <SelectItem value="midtrans">Midtrans (Snap)</SelectItem>
                                            <SelectItem value="xendit">Xendit</SelectItem>
                                            <SelectItem value="stripe">Stripe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-gray-500 uppercase">Environment</Label>
                                    <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/10">
                                        <button 
                                            onClick={() => setPaymentConfig({...paymentConfig, environment: 'sandbox'})}
                                            className={`flex-1 rounded-lg text-xs font-bold py-2 transition-all ${paymentConfig.environment === 'sandbox' ? 'bg-[#ffbe00] text-black' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            Sandbox
                                        </button>
                                        <button 
                                            onClick={() => setPaymentConfig({...paymentConfig, environment: 'production'})}
                                            className={`flex-1 rounded-lg text-xs font-bold py-2 transition-all ${paymentConfig.environment === 'production' ? 'bg-green-500 text-black' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            Production
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                                    Server Key <Lock className="w-3 h-3 text-[#ffbe00]"/>
                                </Label>
                                <div className="relative">
                                    <Input 
                                        type={showPaymentKey ? "text" : "password"}
                                        value={paymentConfig.serverKey}
                                        onChange={(e) => setPaymentConfig({...paymentConfig, serverKey: e.target.value})}
                                        className="bg-[#0a0a0a] border-white/10 text-white font-mono h-12 rounded-xl pr-12"
                                    />
                                    <button 
                                        onClick={() => setShowPaymentKey(!showPaymentKey)}
                                        className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                                    >
                                        {showPaymentKey ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>

                             <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-500 uppercase">Client Key</Label>
                                <Input 
                                    value={paymentConfig.clientKey}
                                    onChange={(e) => setPaymentConfig({...paymentConfig, clientKey: e.target.value})}
                                    className="bg-[#0a0a0a] border-white/10 text-white font-mono h-12 rounded-xl"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN (Whatsapp & Info) */}
                <div className="lg:col-span-5 space-y-8">
                    
                    {/* 3. WHATSAPP API */}
                    <section className="bg-[#151515] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#25D366]/5 rounded-full blur-[80px] pointer-events-none"></div>

                         <div className="flex justify-between items-start mb-8">
                             <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl border border-[#25D366]/20">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Comms Hub</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Whatsapp API</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/10">Active</Badge>
                        </div>

                        <div className="space-y-5">
                             <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-500 uppercase">Provider</Label>
                                <Select 
                                    value={waConfig.provider} 
                                    onValueChange={(val) => setWaConfig({...waConfig, provider: val})}
                                >
                                    <SelectTrigger className="w-full bg-[#0a0a0a] border-white/10 h-12 text-white font-bold rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        <SelectItem value="fonnte">Fonnte</SelectItem>
                                        <SelectItem value="twilio">Twilio</SelectItem>
                                        <SelectItem value="waha">WAHA (Self-hosted)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                             <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                                    API Token <Lock className="w-3 h-3 text-[#ffbe00]"/>
                                </Label>
                                <div className="relative">
                                    <Input 
                                        type={showWaToken ? "text" : "password"}
                                        value={waConfig.apiKey}
                                        onChange={(e) => setWaConfig({...waConfig, apiKey: e.target.value})}
                                        className="bg-[#0a0a0a] border-white/10 text-white font-mono h-12 rounded-xl pr-12"
                                    />
                                    <button 
                                        onClick={() => setShowWaToken(!showWaToken)}
                                        className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                                    >
                                        {showWaToken ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-500 uppercase">Sender Number</Label>
                                <Input 
                                    value={waConfig.senderNumber}
                                    onChange={(e) => setWaConfig({...waConfig, senderNumber: e.target.value})}
                                    className="bg-[#0a0a0a] border-white/10 text-white font-mono h-12 rounded-xl"
                                />
                            </div>

                             <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-2xl border border-white/5">
                                <div>
                                    <p className="font-bold text-white text-sm">Bot Auto-Reply</p>
                                    <p className="text-[10px] text-gray-500">Balas chat keyword otomatis.</p>
                                </div>
                                <Switch 
                                    checked={waConfig.autoReply} 
                                    onCheckedChange={(c) => setWaConfig({...waConfig, autoReply: c})}
                                    className="data-[state=checked]:bg-[#25D366]"
                                />
                            </div>

                            <Button 
                                onClick={() => handleTestConnection('whatsapp')}
                                className="w-full bg-white/5 text-white hover:bg-white/10 font-bold rounded-xl h-12 border border-white/10"
                            >
                                Send Test Message
                            </Button>
                        </div>
                    </section>
                    
                    {/* INFO CARD */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[2rem] relative overflow-hidden">
                        <div className="flex gap-4">
                            <AlertTriangle className="w-8 h-8 text-blue-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-blue-500 text-lg mb-1">Configuration Note</h4>
                                <p className="text-xs text-blue-200/80 leading-relaxed">
                                    Perubahan pada Payment Gateway dan System Core akan mempengaruhi seluruh user secara real-time. Pastikan lakukan testing di Environment <strong>Sandbox</strong> sebelum switch ke Production.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

    