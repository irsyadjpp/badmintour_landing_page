
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface CustomAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: React.ReactNode;
  buttonText?: string;
}

export function CustomAlertModal({ isOpen, onClose, type, title, message, buttonText }: CustomAlertModalProps) {
  const isSuccess = type === 'success';

  // Colors
  const iconColor = isSuccess ? "text-[#22c55e]" : "text-[#ca1f3d]"; // Green vs Red
  const iconBg = isSuccess ? "bg-[#22c55e]/10" : "bg-[#ca1f3d]/10";
  const borderColor = isSuccess ? "border-[#22c55e]/30" : "border-[#ca1f3d]/30";
  const glowColor = isSuccess ? "shadow-[0_0_50px_rgba(34,197,94,0.2)]" : "shadow-[0_0_50px_rgba(202,31,61,0.2)]";

  const buttonBg = isSuccess
    ? "bg-[#22c55e] hover:bg-[#16a34a] text-white"
    : "bg-[#ca1f3d] hover:bg-[#a61932] text-white";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-[#0F0F0F] ${borderColor} border-2 text-white rounded-[2.5rem] p-0 overflow-hidden sm:max-w-md ${glowColor}`}>

        {/* Ambient Background Effects */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 ${iconBg} blur-[60px] rounded-full pointer-events-none`} />

        <div className="relative z-10 p-8 flex flex-col items-center text-center">

          {/* Icon Circle */}
          <div className={`w-24 h-24 rounded-full ${iconBg} border ${borderColor} flex items-center justify-center mb-6 relative group`}>
            <div className={`absolute inset-0 rounded-full ${iconBg} animate-pulse blur-md opacity-50`} />
            {isSuccess ? (
              <CheckCircle className={`w-10 h-10 ${iconColor} relative z-10`} />
            ) : (
              <AlertTriangle className={`w-10 h-10 ${iconColor} relative z-10`} />
            )}
          </div>

          {/* Title */}
          {/* Title - Wrapped in DialogTitle for A11y */}
          <DialogTitle className={`text-3xl font-black italic tracking-tighter uppercase mb-2 ${isSuccess ? 'text-white' : 'text-white'}`}>
            {title}
          </DialogTitle>

          {/* Decorative Underline */}
          <div className={`w-16 h-1.5 rounded-full mb-6 ${isSuccess ? 'bg-[#22c55e]' : 'bg-[#ca1f3d]'}`} />

          {/* Message */}
          <div className="text-gray-400 font-medium mb-8 leading-relaxed">
            {message}
          </div>

          {/* Button */}
          <Button
            onClick={onClose}
            className={`w-full h-14 rounded-xl font-black text-lg tracking-wide shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${buttonBg}`}
          >
            {buttonText || (isSuccess ? "SELESAI" : "COBA LAGI")}
          </Button>

          {/* Footer/Cancel */}
          {!isSuccess && (
            <button
              onClick={onClose}
              className="mt-4 text-xs font-bold text-gray-600 hover:text-white transition-colors uppercase tracking-widest"
            >
              Batalkan
            </button>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
