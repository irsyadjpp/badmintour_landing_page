'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Copy, Check, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PinAnnouncementModal() {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkPinStatus = async () => {
      try {
        const res = await fetch('/api/profile');
        const json = await res.json();

        // Show modal IF: PIN exists AND hasSeenPin is FALSE/undefined (for new users created after update)
        // Note: older users might not have hasSeenPin, ideally we treat undefined as true (seen/legacy)?
        // But request says "setelah registrasi baru". 
        // So checking explicitly for `hasSeenPin === false` avoids showing it to legacy users.
        if (json.success && json.data?.pin && json.data?.hasSeenPin === false) {
          setPin(json.data.pin);
          setOpen(true);
        }
      } catch (error) {
        console.error("Failed to check PIN status");
      }
    };
    checkPinStatus();
  }, []);

  const handleCopy = () => {
    if (pin) {
      navigator.clipboard.writeText(pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "PIN Disalin", description: "Simpan PIN ini di tempat aman." });
    }
  };

  const handleClose = async () => {
    try {
      await fetch('/api/profile/ack-pin', { method: 'POST' });
      setOpen(false);
      toast({
        title: "PIN Tersimpan",
        description: "Anda bisa melihat PIN ini kapan saja di menu Profile.",
        className: "bg-[#ffbe00] text-black border-none font-bold"
      });
    } catch (error) {
      console.error("Failed to ack PIN");
      setOpen(false); // Close anyway to not block user
    }
  };

  if (!pin) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="bg-[#151515] border border-white/10 text-white sm:max-w-md rounded-[2rem]">
        <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-6">
          <div className="w-20 h-20 rounded-full bg-[#ffbe00]/10 flex items-center justify-center border-4 border-[#ffbe00]/20 animate-pulse">
            <ShieldCheck className="w-10 h-10 text-[#ffbe00]" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter mb-2">
              PENTING: PIN LOGIN ANDA
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Gunakan PIN ini untuk login di perangkat lain tanpa Google. <br />
              <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded text-xs mt-2 inline-block">
                MOHON DISIMPAN / DIHAFALKAN
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 my-2 flex flex-col items-center gap-4">
          <div className="text-4xl font-mono font-black tracking-[0.5em] text-[#ffbe00] select-all">
            {showPin ? pin : "••••••"}
          </div>

          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/10 hover:bg-white/10"
              onClick={() => setShowPin(!showPin)}
            >
              {showPin ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPin ? "Sembunyikan" : "Lihat PIN"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 bg-white hover:bg-gray-200 text-black font-bold"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Disalin!" : "Salin PIN"}
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-center pb-4">
          <Button
            onClick={handleClose}
            className="w-full bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black h-12 rounded-xl text-lg shadow-lg"
          >
            SAYA SUDAH SIMPAN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
