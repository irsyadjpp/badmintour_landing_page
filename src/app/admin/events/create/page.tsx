'use client';

import { useRouter } from 'next/navigation';
import { CalendarPlus, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/host/event-form';
import { Badge } from '@/components/ui/badge';

export default function AdminCreateEventPage() {
  const router = useRouter();

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Dynamic Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full border-white/10 bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Badge variant="outline" className="bg-[#ca1f3d]/10 text-[#ca1f3d] border-[#ca1f3d]/20 px-3 py-1 rounded-full font-bold tracking-wider">
              <ShieldAlert className="w-3 h-3 mr-1.5" /> SUPER ACCESS
            </Badge>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic relative inline-block">
              Buat Event
              <span className="absolute -bottom-2 left-0 w-1/3 h-1.5 bg-[#ca1f3d] skew-x-[-12deg]"></span>
            </h1>
            <p className="mt-4 text-gray-400 max-w-xl text-lg font-medium leading-relaxed">
              Buat jadwal Mabar, Drilling, atau Turnamen resmi. Sebagai Admin, Anda memiliki kontrol penuh atas pemilihan Host.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Container - Material 3 Surface */}
      <div className="relative">
        {/* Decorative Background Elements */}
        {/* <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#ca1f3d]/20 rounded-full blur-3xl pointer-events-none opacity-50" /> */}

        <EventForm mode="create" />
      </div>
    </div>
  );
}
