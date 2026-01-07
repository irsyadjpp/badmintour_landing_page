'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Loader2, User, Smartphone, CheckCircle, X } from "lucide-react";
import { cn, isValidIndonesianPhoneNumber, formatIndonesianPhoneNumber } from "@/lib/utils";
import { useRouter } from 'next/navigation';

interface GuestBookingDialogProps {
  eventId: string;
  eventTitle: string;
  isFull: boolean;
  price: number;
  quota: number;
  bookedSlot: number;
}

export default function GuestBookingDialog({
  eventId,
  eventTitle,
  isFull,
  price,
  quota,
  bookedSlot
}: GuestBookingDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidIndonesianPhoneNumber(phone)) {
      toast({
        title: "Nomor Tidak Valid",
        description: "Gunakan format Indonesia (08xx atau 628xx).",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          guestName: name,
          guestPhone: phone
        })
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
        setBookingCode(result.bookingCode);
        toast({
          title: "Booking Berhasil!",
          description: "Anda telah terdaftar di event ini.",
          className: "bg-green-600 text-white border-none"
        });
      } else {
        if (result.error?.includes('sudah terdaftar')) {
          toast({
            title: "Sudah Terdaftar",
            description: `Nomor ${phone} sudah terdaftar di event ini.`,
            variant: "destructive"
          });
        } else {
          throw new Error(result.error || "Gagal booking");
        }
      }
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setPhone('');
      setBookingCode('');
    }, 300);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button disabled={isFull} className={cn(
            "w-full h-14 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95",
            isFull
              ? "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
              : "bg-[#ffbe00] text-black hover:bg-[#ffca28]"
          )}>
            {isFull ? "Full Booked" : "Join Now"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white border-none rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>

          <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm animate-in zoom-in-50 duration-500">
            <CheckCircle className="w-10 h-10" />
          </div>
          <DialogTitle className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Slot Secured!</DialogTitle>
          <p className="text-gray-500 font-medium mb-8">
            Booking berhasil dicatat.
          </p>

          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-6 mb-8 relative group hover:border-gray-400 transition-colors">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kode Booking</p>
            <p className="text-4xl font-mono font-black text-gray-900 tracking-widest select-all">{bookingCode}</p>
          </div>

          <Button onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black shadow-lg hover:shadow-xl transition-all uppercase tracking-widest">
            Selesai
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isFull} className={cn(
          "w-full h-14 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95",
          isFull
            ? "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
            : "bg-[#ffbe00] text-black hover:bg-[#ffca28]"
        )}>
          {isFull ? "Full Booked" : "Join Now"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white border-none rounded-[2.5rem] p-0 overflow-hidden shadow-2xl [&>button]:hidden">
        <div className="relative bg-[#ffbe00] px-8 pt-10 pb-8 text-center">
          <DialogClose className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors">
            <X className="w-5 h-5 text-black" />
          </DialogClose>
          <DialogTitle className="text-3xl font-black text-black uppercase tracking-tighter mb-1">
            JOIN MABAR
          </DialogTitle>
          <p className="text-black text-xs font-bold uppercase tracking-[0.2em] opacity-80">{eventTitle}</p>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-3 group">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-[#ffbe00] transition-colors">Nama Lengkap</Label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ffbe00] transition-colors" />
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama anda"
                  className="h-16 pl-14 bg-gray-50 border-transparent rounded-2xl text-gray-900 placeholder:text-gray-400 font-bold focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#ffbe00]/10 transition-all text-lg"
                />
              </div>
            </div>

            <div className="space-y-3 group">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-[#ffbe00] transition-colors">Nomor WhatsApp</Label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ffbe00] transition-colors" />
                <Input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => {
                    if (phone) setPhone(formatIndonesianPhoneNumber(phone));
                  }}
                  placeholder="08xxxxxxxxxx"
                  className="h-16 pl-14 bg-gray-50 border-transparent rounded-2xl text-gray-900 placeholder:text-gray-400 font-bold focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#ffbe00]/10 transition-all text-lg"
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-tight font-medium pl-1">
                *Jika nomor sudah terdaftar member, akan otomatis masuk ke akun member.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-16 rounded-2xl bg-[#0f172a] hover:bg-black text-white font-black text-lg uppercase tracking-widest shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : "Amankan Slot"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
