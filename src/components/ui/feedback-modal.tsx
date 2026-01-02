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

  // Theme Configuration
  const themes = {
    error: {
      color: 'text-[#ca1f3d]',
      bg: 'bg-[#ca1f3d]',
      border: 'border-[#ca1f3d]',
      glow: 'shadow-[0_0_50px_rgba(202,31,61,0.3)]',
      icon: TriangleAlert,
      btn: 'bg-[#ca1f3d] hover:bg-[#a01830]'
    },
    warning: {
      color: 'text-[#ffbe00]',
      bg: 'bg-[#ffbe00]',
      border: 'border-[#ffbe00]',
      glow: 'shadow-[0_0_50px_rgba(255,190,0,0.3)]',
      icon: AlertCircle,
      btn: 'bg-[#ffbe00] text-black hover:bg-[#ffbe00]/90'
    },
    success: {
      color: 'text-[#10b981]',
      bg: 'bg-[#10b981]',
      border: 'border-[#10b981]',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]',
      icon: CheckCircle2,
      btn: 'bg-[#10b981] text-black hover:bg-[#10b981]/90'
    }
  };

  const theme = themes[type];
  const Icon = theme.icon;

  return (
    <div className={cn(
      "fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-center transition-all duration-300 animate-in fade-in",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
    )}>
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
        {/* Background Effects */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${theme.bg}/20 blur-[100px] rounded-full animate-pulse`}></div>

        <Card className={`relative bg-[#151515] ${theme.border}/50 border-2 p-8 rounded-[2.5rem] overflow-hidden ${theme.glow}`}>
          {/* Background Icon Watermark */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon className={`w-32 h-32 ${theme.color}`} />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-20 h-20 ${theme.bg}/20 rounded-full flex items-center justify-center mb-6 animate-bounce border ${theme.border}`}>
              <Icon className={`w-10 h-10 ${theme.color}`} strokeWidth={2.5} />
            </div>

            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase">{title}</h2>
            <div className={`h-1 w-16 ${theme.bg} rounded-full mb-6`}></div>

            <div className="text-gray-300 text-sm font-medium leading-relaxed mb-8">
              {description}
            </div>

            <div className="w-full space-y-3">
              {primaryAction && (
                <Button
                  onClick={primaryAction.onClick}
                  className={`w-full ${theme.btn} py-6 rounded-2xl font-black text-lg shadow-lg transition-all transform hover:scale-[1.02]`}
                >
                  {primaryAction.label}
                </Button>
              )}

              {secondaryAction ? (
                <Button
                  variant="ghost"
                  onClick={secondaryAction.onClick}
                  className="w-full text-gray-500 hover:text-white py-4 font-bold text-sm"
                >
                  {secondaryAction.label}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full text-gray-500 hover:text-white py-4 font-bold text-sm"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
