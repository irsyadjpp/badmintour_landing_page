// src/app/admin/page.tsx (Contoh Halaman Admin)
'use client';

import AdminMabarTable from '@/components/admin/mabar-table';
import SessionControlPanel from '@/components/admin/session-control';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  // State sederhana untuk simulasi navigasi antar menu admin
  const [view, setView] = useState<'list' | 'detail'>('list');

  return (
    <div className="container mx-auto py-10 px-4">
      {view === 'detail' && (
        <Button 
            variant="ghost" 
            onClick={() => setView('list')} 
            className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
        >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke List Jadwal
        </Button>
      )}

      {view === 'list' ? (
        // Di aplikasi real, tombol 'Manage' di tabel akan trigger setView('detail')
        <div onClick={() => setView('detail')}> 
            {/* Klik tabel untuk demo masuk ke detail */}
            <AdminMabarTable />
            <p className="mt-4 text-center text-sm text-muted-foreground bg-muted p-2 rounded animate-pulse cursor-pointer">
                (Klik area tabel untuk melihat demo Detail Session Control)
            </p>
        </div>
      ) : (
        <SessionControlPanel />
      )}
    </div>
  );
}
