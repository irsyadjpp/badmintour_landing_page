'use client';
import AdminMabarTable from '@/components/admin/mabar-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
      </div>
      
      {/* Tabel Manajemen Jadwal */}
      <AdminMabarTable />
    </div>
  );
}
