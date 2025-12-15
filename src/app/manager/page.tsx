'use client';
import SessionControlPanel from '@/components/admin/session-control';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-muted/10">
        <div className="container mx-auto py-6 px-4">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/login">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5"/></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black">Manager Panel</h1>
                    <p className="text-muted-foreground text-sm">Active Session Control</p>
                </div>
            </div>

            {/* Panel Kontrol Sesi (Absensi & Matchmaking) */}
            <SessionControlPanel />
        </div>
    </div>
  );
}
