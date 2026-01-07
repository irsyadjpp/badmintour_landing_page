'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Loader2, User, Smartphone, CheckCircle, ArrowRight } from "lucide-react";
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
        // Handle specific errors
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
    // Reset state after delay
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
        <DialogContent className="sm:max-w-md bg-white border-none rounded-3xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-black text-gray-900 mb-2">Booking Berhasil!</DialogTitle>
          <DialogDescription className="text-gray-500 font-medium mb-6">
            Kode Booking Anda:
          </DialogDescription>

          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-3xl font-mono font-black text-gray-900 tracking-widest">{bookingCode}</p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Silakan screenshot bukti ini. Jika nomor HP Anda sudah terdaftar sebagai member, data ini otomatis masuk ke akun Anda.
          </p>

          <Button onClick={() => window.location.reload()} className="w-full h-12 rounded-xl bg-gray-900 text-white font-bold hover:bg-black">
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
      <DialogContent className="sm:max-w-md bg-white border-none rounded-3xl p-0 overflow-hidden">
        <div className="bg-[#ffbe00] p-6 text-center">
          <DialogTitle className="text-xl font-black text-black uppercase tracking-tighter">
            Join Mabar
          </DialogTitle>
          <p className="text-black/80 text-xs font-bold uppercase tracking-wider mt-1">{eventTitle}</p>
        </div>

        <div className="p-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama anda"
                  className="h-12 pl-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-0 focus:border-[#ffbe00]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor WhatsApp</Label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => {
                    if (phone) setPhone(formatIndonesianPhoneNumber(phone));
                  }}
                  placeholder="08xxxxxxxxxx"
                  className="h-12 pl-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-0 focus:border-[#ffbe00]"
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                *Jika nomor sudah terdaftar member, akan otomatis masuk ke akun member.
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-lg shadow-xl"
            >
              {submitting ? <Loader2 className="animate-spin" /> : "Amankan Slot"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
