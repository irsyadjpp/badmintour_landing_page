import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import AdminSidebar from '@/components/layout/admin-sidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard | BADMINTOUR',
  description: 'System management for Badmintour.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // PERBAIKAN:
    // 1. 'min-h-screen' & 'flex flex-col': Memastikan wrapper mengisi layar penuh & menangani margin collapse.
    // 2. 'bg-[#121212]': Warna background gelap diaplikasikan di wrapper paling luar.
    // 3. 'overflow-x-hidden': Mencegah scroll horizontal yang tidak sengaja.
    <div className="min-h-screen w-full bg-[#121212] text-white font-sans flex flex-col antialiased selection:bg-bad-yellow selection:text-black overflow-x-hidden">
      
      <AdminSidebar />
      
      {/* PERBAIKAN MAIN:
         - Gunakan 'flex-1': Agar main mengambil sisa ruang tinggi jika konten sedikit.
         - Gunakan 'pl-28' (Padding Left) bukan 'ml-28': 
           Ini membuat area kiri tetap menjadi bagian dari container gelap, mencegah celah putih.
      */}
      <main className="flex-1 w-full pl-6 md:pl-28 pr-6 py-8">
        {/* Wrapper Opsional: Membatasi lebar konten agar rapi di layar monitor lebar (Ultrawide) */}
        <div className="max-w-[1600px] mx-auto w-full">
            {children}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}
