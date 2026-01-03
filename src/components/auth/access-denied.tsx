import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldBan, LockKeyhole } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-sans">
      <div className="text-center max-w-lg mx-auto space-y-8">

        {/* Icon Visual */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-[#ffbe00]/20 blur-[50px] rounded-full animate-pulse" />
          <div className="relative z-10 w-full h-full bg-[#1A1A1A] border-2 border-[#ffbe00]/30 rounded-full flex items-center justify-center">
            <ShieldBan className="w-16 h-16 text-[#ffbe00]" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#151515] p-2 rounded-full border border-white/10">
            <LockKeyhole className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            RESTRICTED <span className="text-[#ffbe00]">ZONE</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Area ini khusus untuk <strong>Official & Coach</strong>. ID Card kamu tidak memiliki akses untuk masuk ke ruangan ini.
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-center gap-4">
          <Link href="/member/dashboard">
            <Button className="h-12 px-8 rounded-xl bg-white text-black hover:bg-gray-200 font-bold">
              Kembali ke Locker Room
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
