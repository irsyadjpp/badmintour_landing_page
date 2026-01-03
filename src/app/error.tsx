'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, WifiOff } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl mx-auto space-y-8 bg-[#151515]/50 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2.5rem]">

        {/* Icon */}
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
          <WifiOff className="w-10 h-10 text-red-500 relative z-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
            TECHNICAL <span className="text-red-500">FOUL</span>
          </h2>
          <p className="text-gray-400 font-medium text-lg">
            Terjadi kesalahan teknis di lapangan. Wasit sedang meninjau ulang kejadian ini.
          </p>
        </div>

        {/* Error Code */}
        {error.digest && (
          <div className="bg-black/40 rounded-xl py-2 px-4 inline-block border border-white/5">
            <code className="text-xs font-mono text-gray-500">Ref ID: {error.digest}</code>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4">
          <Button
            onClick={reset}
            className="h-14 px-10 rounded-[1.2rem] bg-white text-black hover:bg-gray-200 font-black text-lg shadow-lg hover:shadow-white/10 transition-all active:scale-95"
          >
            <RefreshCcw className="mr-3 w-5 h-5" /> REPLAY MATCH
          </Button>
          <p className="text-xs text-gray-600 mt-4 font-bold">Tekan tombol untuk memuat ulang</p>
        </div>

      </div>
    </div>
  );
}
