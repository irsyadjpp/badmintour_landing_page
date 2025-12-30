'use client';

import { useRouter } from 'next/navigation';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/host/event-form';

export default function CreateEventPage() {
    const router = useRouter();

    return (
        <div className="space-y-6 pb-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <CalendarPlus className="w-8 h-8 text-[#ca1f3d]" /> BUAT KEGIATAN BARU
                    </h1>
                    <p className="text-gray-400">Isi detail lengkap untuk mempublikasikan jadwal Mabar, Drilling, atau Turnamen.</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white"
                >
                    Batal
                </Button>
            </div>

            {/* Reusable Form Component */}
            <EventForm mode="create" />
        </div>
    );
}
