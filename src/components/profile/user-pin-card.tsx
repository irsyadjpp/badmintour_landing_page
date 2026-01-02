'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Eye, EyeOff, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UserPinCard({ pin }: { pin?: string }) {
  const [showPin, setShowPin] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (pin) {
      navigator.clipboard.writeText(pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "PIN Disalin", description: "Jaga kerahasiaan PIN Anda." });
    }
  };

  if (!pin) return null;

  return (
    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-50">
        <ShieldCheck className="w-32 h-32 text-white/5 rotate-12" />
      </div>

      <div className="w-16 h-16 rounded-full bg-[#ffbe00]/10 flex items-center justify-center border border-[#ffbe00]/20 mb-3 relative z-10">
        <ShieldCheck className="w-8 h-8 text-[#ffbe00]" />
      </div>

      <h2 className="text-lg font-black text-white relative z-10">LOGIN PIN</h2>
      <p className="text-gray-500 text-xs mb-4 relative z-10">Gunakan untuk login di perangkat lain.</p>

      <div className="bg-black/40 p-3 rounded-xl border border-white/5 w-full flex flex-col items-center gap-3 relative z-10">
        <div className="font-mono font-black text-2xl tracking-[0.3em] text-[#ffbe00]">
          {showPin ? pin : "••••••"}
        </div>

        <div className="flex gap-2 w-full text-xs">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-white hover:bg-white/10 hover:text-white"
            onClick={() => setShowPin(!showPin)}
          >
            {showPin ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showPin ? "Hide" : "Show"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-white hover:bg-white/10 hover:text-white"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
