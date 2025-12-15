'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, CalendarDays, History, LogOut } from 'lucide-react';
import GamificationCard from '@/components/mabar/gamification-card'; // Reuse komponen badges
import Link from 'next/link';

export default function MemberDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b bg-card px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Halo, Irsyad! 👋</h1>
        <Link href="/">
             <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10"><LogOut className="mr-2 h-4 w-4"/> Keluar</Button>
        </Link>
      </header>

      <div className="container p-4 md:p-8 space-y-8">
        
        {/* Statistik Singkat */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary text-primary-foreground border-none">
                <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-4xl font-black">12</span>
                    <span className="text-xs uppercase font-bold opacity-80">Pertandingan</span>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-4xl font-black text-accent-foreground">8</span>
                    <span className="text-xs uppercase font-bold text-muted-foreground">Menang (Win)</span>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-4xl font-black text-muted-foreground">67%</span>
                    <span className="text-xs uppercase font-bold text-muted-foreground">Win Rate</span>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-4xl font-black text-blue-600">A</span>
                    <span className="text-xs uppercase font-bold text-muted-foreground">Skill Level</span>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Tiket Aktif & Jadwal */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-black flex items-center gap-2">
                    <CalendarDays className="h-6 w-6" /> Jadwal Saya
                </h2>
                
                {/* Tiket Aktif */}
                <Card className="border-l-4 border-l-green-500 overflow-hidden relative">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <QrCode className="h-32 w-32" />
                    </div>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-xl">Mabar Rutin - GOR Cikutra</CardTitle>
                                <p className="text-sm text-muted-foreground">Sabtu, 24 Agustus • 20:00 WIB</p>
                             </div>
                             <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                Confirmed
                             </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-4">Tunjukkan QR Code ini kepada Manager di lapangan untuk Check-in.</p>
                        <Button className="w-full sm:w-auto" variant="outline"> <QrCode className="mr-2 h-4 w-4"/> Tampilkan QR Code</Button>
                    </CardContent>
                </Card>

                {/* History */}
                <h3 className="font-bold text-lg mt-8 flex items-center gap-2"><History className="h-5 w-5"/> Riwayat Permainan</h3>
                <div className="space-y-3">
                    {[1,2,3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-card">
                            <div>
                                <p className="font-bold">Drilling Session (Coach Adi)</p>
                                <p className="text-xs text-muted-foreground">17 Agustus 2024</p>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">Selesai</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kolom Kanan: Gamification & Profile */}
            <div className="space-y-6">
                 <h2 className="text-2xl font-black">Badges</h2>
                 <GamificationCard />
                 
                 <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-6 text-center space-y-4">
                        <p className="font-medium text-muted-foreground">Ingin main lagi?</p>
                        <Link href="/#schedule">
                            <Button className="w-full font-bold">Cari Jadwal Mabar</Button>
                        </Link>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
