'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle, Ticket } from 'lucide-react';

interface JoinEventButtonProps {
  eventId: string;
  eventTitle: string;
  eventPrice: number;
  eventTime: string;
  isFull: boolean;
  isJoined: boolean;
}

export default function JoinEventButton({
  eventId,
  eventTitle,
  eventPrice,
  eventTime,
  isFull,
  isJoined
}: JoinEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      const result = await res.json();

      if (result.success) {
        toast({
          title: "Berhasil Join!",
          description: "Tiket mabar sudah diterbitkan. Cek Tab Jadwal.",
          className: "bg-green-600 text-white border-none"
        });
        setIsOpen(false);
        router.refresh(); // Refresh Server Component
      } else {
        throw new Error(result.error || "Gagal booking");
      }
    } catch (error: any) {
      toast({ title: "Gagal Join", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isJoined) {
    return (
      <Button disabled className="w-full h-14 bg-green-500/20 text-green-500 font-black rounded-xl border border-green-500/20">
        <CheckCircle className="w-5 h-5 mr-2" /> SUDAH BERGABUNG
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button disabled className="w-full h-14 bg-red-500/10 text-red-500 font-black rounded-xl border border-red-500/20">
        FULL BOOKED
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full h-14 bg-[#ffbe00] text-black hover:bg-[#e5ab00] font-black tracking-wide rounded-xl shadow-[0_0_20px_rgba(255,190,0,0.3)] hover:scale-[1.02] transition-transform"
      >
        JOIN GAME SEKARANG
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white text-center">Konfirmasi Join</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Pastikan jadwal Anda sesuai.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-4 my-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-bold uppercase">Event</span>
              <span className="font-bold text-white text-right max-w-[60%]">{eventTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-bold uppercase">Waktu</span>
              <span className="font-bold text-white">{eventTime}</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
              <span className="text-gray-400 text-sm font-bold uppercase">Biaya</span>
              <span className="font-black text-xl text-[#ffbe00]">Rp {eventPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0 flex-col sm:flex-row">
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-12 text-gray-400 hover:text-white hover:bg-white/10 w-full sm:w-auto">
              Batal
            </Button>
            <Button
              onClick={handleJoin}
              disabled={loading}
              className="bg-[#ca1f3d] text-white hover:bg-[#a01830] rounded-xl font-bold h-12 px-8 w-full sm:w-1/2 ml-auto shadow-lg shadow-red-900/20"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Proses...</>
              ) : (
                "YA, GAS MABAR!"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
