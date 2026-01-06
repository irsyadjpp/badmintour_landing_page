'use client';

import {
  TriangleAlert,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export type FeedbackType = 'success' | 'error' | 'warning';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: FeedbackType;
  title: string;
  description: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function FeedbackModal({
  isOpen,
  onClose,
  type,
  title,
  description,
  primaryAction,
  secondaryAction
}: FeedbackModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  // Theme Configuration - NEON DOUBLE FAULT STYLE
  const themes = {
    error: {
      color: 'text-[#ca1f3d]',
      bg: 'bg-[#ca1f3d]',
      border: 'border-[#ca1f3d]',
      glow: 'shadow-[0_0_50px_rgba(202,31,61,0.3)]',
      icon: TriangleAlert,
      btn: 'bg-[#ca1f3d] hover:bg-[#a01830] text-white shadow-[0_0_20px_rgba(202,31,61,0.4)]',
      textShadow: 'drop-shadow-[0_0_10px_rgba(202,31,61,0.5)]'
    },
    warning: {
      color: 'text-[#ffbe00]',
      bg: 'bg-[#ffbe00]',
      border: 'border-[#ffbe00]',
      glow: 'shadow-[0_0_50px_rgba(255,190,0,0.3)]',
      icon: AlertCircle,
      btn: 'bg-[#ffbe00] text-black hover:bg-[#e5ab00] shadow-[0_0_20px_rgba(255,190,0,0.4)]',
      textShadow: 'drop-shadow-[0_0_10px_rgba(255,190,0,0.5)]'
    },
    success: {
      color: 'text-[#10b981]',
      bg: 'bg-[#10b981]',
      border: 'border-[#10b981]',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]',
      icon: CheckCircle2,
      btn: 'bg-[#10b981] text-black hover:bg-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      textShadow: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]'
    }
  };

  const theme = themes[type];
  const Icon = theme.icon;

  return (
    <div className={cn(
      "fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-center transition-all duration-300 animate-in fade-in",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
    )}>
      <div className="relative w-full max-w-[24rem] animate-in zoom-in-95 duration-300">

        {/* Card Container */}
        <Card className={`relative bg-[#0a0a0a] ${theme.border} border rounded-[2.5rem] overflow-hidden ${theme.glow} p-0`}>

          {/* Background Watermark Icon (Top Right) */}
          <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none">
            <Icon className={`w-48 h-48 ${theme.color}`} strokeWidth={1.5} />
          </div>

          <div className="flex flex-col items-center p-8 pt-12 relative z-10">

            {/* Top Icon Circle */}
            <div className={`w-20 h-20 rounded-full border ${theme.border} ${theme.bg}/5 flex items-center justify-center mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,1)]`}>
              <Icon className={`w-8 h-8 ${theme.color} ${theme.textShadow}`} strokeWidth={2.5} />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase select-none">
              {title}
            </h2>

            {/* Separator Line */}
            <div className={`h-1.5 w-12 ${theme.bg} rounded-full mb-6 opacity-80`}></div>

            {/* Description */}
            <div className="text-gray-300 text-sm font-medium leading-relaxed mb-8 px-2">
              {description}
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              {primaryAction && (
                <Button
                  onClick={primaryAction.onClick}
                  className={`w-full ${theme.btn} py-7 rounded-2xl font-black text-lg tracking-wide uppercase transition-all transform hover:scale-[1.02] active:scale-[0.98] border-0`}
                >
                  {primaryAction.label}
                </Button>
              )}

              {secondaryAction ? (
                <button
                  onClick={secondaryAction.onClick}
                  className="text-gray-500 font-bold text-sm hover:text-white transition-colors py-2 uppercase tracking-wider"
                >
                  {secondaryAction.label}
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="text-gray-500 font-bold text-sm hover:text-white transition-colors py-2 uppercase tracking-wider"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
