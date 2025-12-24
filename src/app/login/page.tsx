'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Users, ClipboardList, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // Simulasi Login berdasarkan Role
  const handleLogin = (role: string) => {
    // Di aplikasi nyata, ini akan memanggil API auth
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard'); // Masuk halaman Admin
        break;
      case 'manager':
        router.push('/host/dashboard'); // Masuk halaman Mabar Manager
        break;
      case 'member':
        router.push('/member/dashboard'); // Masuk halaman Dashboard Pemain
        break;
      case 'guest':
      default:
        router.push('/'); // Non-member balik ke landing page (atau page register)
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4">
      <div className="absolute top-8 left-8">
        <Link href="/">
            <Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4"/> Kembali ke Beranda</Button>
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black tracking-tight text-primary mb-2">BadminTour Login</h1>
        <p className="text-muted-foreground">Pilih role untuk simulasi akses fitur.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
        {/* 1. ROLE ADMIN */}
        <Card className="hover:border-primary transition-colors cursor-pointer group" onClick={() => handleLogin('admin')}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                <Shield className="h-8 w-8" />
            </div>
            <div>
                <CardTitle>Admin Utama</CardTitle>
                <CardDescription>Pemilik / Manajemen Pusat</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Kelola semua jadwal event</li>
                <li>Lihat laporan keuangan global</li>
                <li>Manajemen user & role</li>
            </ul>
          </CardContent>
        </Card>

        {/* 2. ROLE MABAR MANAGER */}
        <Card className="hover:border-accent transition-colors cursor-pointer group" onClick={() => handleLogin('manager')}>
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent group-hover:text-black transition-colors">
                <ClipboardList className="h-8 w-8" />
            </div>
            <div>
                <CardTitle>Mabar Manager</CardTitle>
                <CardDescription>Host Lapangan / PIC Event</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Absensi kehadiran peserta (QR)</li>
                <li>Atur matchmaking & skor</li>
                <li>Update status lapangan</li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. ROLE PEMAIN (MEMBER) */}
        <Card className="hover:border-green-500 transition-colors cursor-pointer group" onClick={() => handleLogin('member')}>
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                <User className="h-8 w-8" />
            </div>
            <div>
                <CardTitle>Member Pemain</CardTitle>
                <CardDescription>User Terdaftar</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Booking slot mabar/drilling</li>
                <li>Lihat tiket & history main</li>
                <li>Cek statistik & badges</li>
            </ul>
          </CardContent>
        </Card>

        {/* 4. PEMAIN NON-MEMBER (Guest) */}
        <Card className="hover:border-gray-500 transition-colors cursor-pointer group" onClick={() => handleLogin('guest')}>
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-500 group-hover:text-white transition-colors">
                <Users className="h-8 w-8" />
            </div>
            <div>
                <CardTitle>Non-Member</CardTitle>
                <CardDescription>Pengunjung Umum</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Hanya bisa melihat jadwal</li>
                <li>Harus daftar untuk booking</li>
                <li>Tidak punya riwayat main</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
