"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Material3TimePickerProps {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  label?: string;
}

export function Material3TimePicker({ value, onChange, label = "Time" }: Material3TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Buffer state for input
  const [tempHour, setTempHour] = React.useState("00");
  const [tempMinute, setTempMinute] = React.useState("00");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      if (value) {
        const [h, m] = value.split(":");
        setTempHour(h);
        setTempMinute(m);
      } else {
        const now = new Date();
        setTempHour(now.getHours().toString().padStart(2, "0"));
        setTempMinute(now.getMinutes().toString().padStart(2, "0"));
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, value]);

  const handleSave = () => {
    // Validate final values
    let h = parseInt(tempHour);
    let m = parseInt(tempMinute);
    if (isNaN(h)) h = 0;
    if (isNaN(m)) m = 0;

    // Clamp
    h = Math.max(0, Math.min(23, h));
    m = Math.max(0, Math.min(59, m));

    const finalH = h.toString().padStart(2, "0");
    const finalM = m.toString().padStart(2, "0");
    onChange(`${finalH}:${finalM}`);
    setIsOpen(false);
  };

  const handleBlur = (type: 'hour' | 'minute') => {
    let val = type === 'hour' ? parseInt(tempHour) : parseInt(tempMinute);
    if (isNaN(val)) val = 0;
    if (type === 'hour') val = Math.max(0, Math.min(23, val));
    if (type === 'minute') val = Math.max(0, Math.min(59, val));

    const strVal = val.toString().padStart(2, "0");
    if (type === 'hour') setTempHour(strVal);
    else setTempMinute(strVal);
  }

  // Handle auto-focus jump
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 2) return; // limit to 2 chars
    setTempHour(val);
  }

  return (
    <>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full h-14 bg-[#1e1e1e] rounded-xl flex items-center px-4 cursor-pointer relative overflow-hidden group border border-transparent hover:border-white/10 transition-all",
          !value && "text-gray-500"
        )}
      >
        <div className="flex flex-col items-start gap-0.5 z-10">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 group-hover:text-[#ca1f3d] transition-colors">{label}</span>
          <div className="flex items-center gap-2 text-base font-medium text-white">
            <Clock className="w-4 h-4 text-[#ca1f3d]" />
            {value || "Pilih Waktu"}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-700 group-hover:bg-[#ca1f3d] transition-colors"></div>
      </div>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center isolate">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* INPUT MODE DIALOG - THEMED */}
          <div className="relative bg-[#1A1A1A] rounded-[28px] shadow-2xl p-6 w-[320px] flex flex-col gap-6 animate-in zoom-in-95 duration-200 border border-[#ca1f3d]/20 font-sans">

            {/* Header */}
            <div className="space-y-1">
              <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Masukan Waktu</span>
            </div>

            {/* Inputs Container */}
            <div className="flex items-start justify-center gap-2">
              {/* HOUR */}
              <div className="flex flex-col gap-2 w-[96px]">
                <div className="relative group">
                  <input
                    type="number"
                    value={tempHour}
                    onChange={handleHourChange}
                    onBlur={() => handleBlur('hour')}
                    className="w-full h-[80px] bg-[#2b1515] text-white text-5xl font-bold text-center rounded-xl border-2 border-transparent focus:border-[#ffbe00] focus:bg-[#3d2b00] outline-none transition-all selection:bg-[#ca1f3d] selection:text-white"
                  />
                </div>
                <span className="text-xs text-center text-gray-500 font-bold tracking-wider pt-1">JAM</span>
              </div>

              <span className="text-5xl text-white/20 font-light mt-3">:</span>

              {/* MINUTE */}
              <div className="flex flex-col gap-2 w-[96px]">
                <div className="relative group">
                  <input
                    type="number"
                    value={tempMinute}
                    onChange={(e) => e.target.value.length <= 2 && setTempMinute(e.target.value)}
                    onBlur={() => handleBlur('minute')}
                    className="w-full h-[80px] bg-[#2b1515] text-white text-5xl font-bold text-center rounded-xl border-2 border-transparent focus:border-[#ffbe00] focus:bg-[#3d2b00] outline-none transition-all selection:bg-[#ca1f3d] selection:text-white"
                  />
                </div>
                <span className="text-xs text-center text-gray-500 font-bold tracking-wider pt-1">MENIT</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-2">
              <Button variant="ghost" size="icon" className="text-[#ffbe00] hover:bg-[#ffbe00]/10">
                <Clock className="w-6 h-6" />
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-white/5 hover:text-white font-medium">
                  Batal
                </Button>
                <Button onClick={handleSave} className="bg-[#ffbe00] text-black hover:bg-[#ffbe00]/90 font-bold shadow-[0_0_15px_rgba(255,190,0,0.3)]">
                  OK
                </Button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
