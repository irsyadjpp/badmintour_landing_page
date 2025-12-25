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
    // PERBAIKAN 1: Tambahkan 'flex flex-col'. 
    // Ini mencegah 'margin collapse' dari elemen anak yang menyebabkan gap putih di bawah.
    // Gunakan bg-[#121212] hardcoded untuk memastikan warna gelap absolut menutupi body putih.
    <div className="min-h-screen w-full bg-[#121212] text-white font-sans flex flex-col antialiased selection:bg-bad-yellow selection:text-black">
      
      <AdminSidebar />
      
      {/* PERBAIKAN 2: Ubah 'ml-28 mr-6' menjadi Padding ('pl-...', 'pr-...').
        - Margin menggeser container, sehingga bisa menyisakan celah background.
        - Padding memperluas container, sehingga background tetap utuh.
        
        pl-28 (7rem/112px) memberikan ruang yang cukup untuk Sidebar (w-20 + left-4).
      */}
      <main className="flex-1 w-full pl-6 md:pl-28 pr-6 py-8">
        {/* Optional Wrapper: Membatasi lebar konten agar tidak terlalu melebar di layar ultrawide */}
        <div className="max-w-[1600px] mx-auto w-full">
            {children}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}
