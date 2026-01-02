'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function StatusModal({ isOpen, onClose, type, title, description, actionLabel = "TUTUP", onAction }: StatusModalProps) {
  const isError = type === 'error';
  const colorClass = isError ? "text-[#FF0000]" : "text-[#00F2EA]";
  const bgClass = isError ? "bg-[#FF0000]" : "bg-[#00F2EA]";
  const borderClass = isError ? "border-[#FF0000]" : "border-[#00F2EA]";
  const shadowClass = isError ? "shadow-[0_0_50px_-12px_rgba(255,0,0,0.5)]" : "shadow-[0_0_50px_-12px_rgba(0,242,234,0.5)]";

  const handleAction = () => {
    if (onAction) onAction();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-[#0a0a0a] border-2 p-0 overflow-hidden max-w-md w-[90%] rounded-[2.5rem]",
        borderClass,
        shadowClass
      )}>
        <div className="flex flex-col items-center text-center p-8 pt-12 relative">

          {/* Background Ambience */}
          <div className={cn("absolute inset-0 opacity-10 blur-3xl pointer-events-none", bgClass)}></div>

          {/* ICON */}
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center border-2 mb-6 relative z-10",
            borderClass,
            isError ? "bg-[#FF0000]/10" : "bg-[#00F2EA]/10"
          )}>
            {isError ? (
              <AlertTriangle className={cn("w-12 h-12", colorClass)} />
            ) : (
              <CheckCircle2 className={cn("w-12 h-12", colorClass)} />
            )}
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase mb-2 relative z-10">
            {title}
          </h2>

          {/* DIVIDER */}
          <div className={cn("w-12 h-1.5 rounded-full mb-6 relative z-10", bgClass)}></div>

          {/* DESCRIPTION */}
          <p className="text-gray-300 mb-8 relative z-10 font-medium leading-relaxed">
            {description}
          </p>

          {/* BUTTON */}
          <Button
            onClick={handleAction}
            className={cn(
              "w-full h-14 rounded-2xl font-black text-lg tracking-wide hover:scale-[1.02] transition-transform relative z-10 text-black",
              bgClass,
              isError ? "hover:bg-[#ff3333]" : "hover:bg-[#33f4ed]"
            )}
          >
            {actionLabel}
          </Button>

          {/* SECONDARY ACTION */}
          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 font-bold hover:text-white transition-colors relative z-10"
          >
            Batalkan
          </button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
