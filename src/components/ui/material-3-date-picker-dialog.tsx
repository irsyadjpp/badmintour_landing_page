"use client";

import * as React from "react";
import { format, isValid } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

// Ensure styles don't crash
import "react-day-picker/style.css";

interface Material3DatePickerDialogProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function Material3DatePickerDialogFinal({ date, setDate }: Material3DatePickerDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(date);

  // Sync tempDate when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setTempDate(date || new Date());
    }
  }, [isOpen, date]);

  const handleSave = () => {
    setDate(tempDate);
    setIsOpen(false);
  };

  // Safe formatting
  const formattedDate = tempDate && isValid(tempDate)
    ? format(tempDate, "EEE, MMM d", { locale: id })
    : "Pilih Tanggal";

  const defaultClassNames = getDefaultClassNames();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            "w-full h-14 bg-[#1e1e1e] rounded-xl flex items-center px-4 cursor-pointer relative overflow-hidden group border border-transparent hover:border-white/10 transition-all",
            !date && "text-gray-500"
          )}
        >
          <div className="flex flex-col items-start gap-0.5 z-10">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 group-hover:text-[#ca1f3d] transition-colors">Tanggal Kegiatan</span>
            <div className="flex items-center gap-2 text-base font-medium text-white">
              <CalendarIcon className="w-4 h-4 text-[#ca1f3d]" />
              {date ? format(date, "EEE, d MMM yyyy", { locale: id }) : <span className="text-gray-500">Pilih Tanggal</span>}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-700 group-hover:bg-[#ca1f3d] transition-colors"></div>
        </div>
      </DialogTrigger>

      <DialogContent
        className="p-0 border-none bg-transparent shadow-none w-auto max-w-min focus:outline-none"
      >
        <DialogTitle className="sr-only">Pilih Tanggal</DialogTitle>
        <div className="relative bg-[#1A1A1A] rounded-[28px] shadow-2xl w-[320px] flex flex-col animate-in zoom-in-95 duration-200 border border-[#ca1f3d]/20 overflow-hidden font-sans">

          {/* Header Area */}
          <div className="px-6 pt-6 pb-2 shrink-0 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm font-medium tracking-wide">
                {tempDate ? format(tempDate, "yyyy", { locale: id }) : "Tahun"}
              </span>
              <span className="text-3xl font-bold text-white">
                {formattedDate}
              </span>
            </div>
            <div className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
              <Pencil className="w-5 h-5 text-[#ffbe00]" />
            </div>
          </div>

          <div className="mx-0 h-[1px] bg-transparent mb-0"></div>

          {/* Calendar Grid */}
          <div className="px-4 pb-4 flex justify-center w-full">
            {/* 
                    Injecting Critical BadminTour Theme CSS Override
                */}
            <style jsx global>{`
                    .rdp-root {
                        --rdp-accent-color: #ca1f3d; /* Brand Red */
                        --rdp-background-color: #2b1515;
                        color: #ffffff;
                    }
                    .rdp-month_caption {
                        padding: 0 10px;
                        margin-bottom: 10px;
                        font-weight: 700;
                        color: #ffbe00; /* Yellow Month Title */
                    }
                    .rdp-button_next, .rdp-button_previous {
                        background: transparent;
                        border: none;
                        color: #ffffff;
                        border-radius: 99px;
                    }
                    .rdp-button_next:hover, .rdp-button_previous:hover {
                        background: rgba(255,255,255,0.1);
                        color: #ffbe00;
                    }
                    .rdp-day {
                        width: 40px;
                        height: 40px;
                        border-radius: 99px;
                        font-size: 0.9rem;
                        color: #ffffff;
                    }
                    .rdp-day:hover:not(.rdp-day_selected) {
                        background-color: rgba(202, 31, 61, 0.2);
                        color: #ffbe00;
                    }
                    .rdp-day_selected {
                        background-color: #ca1f3d !important; /* Brand Red */
                        color: #ffffff !important;
                        font-weight: bold;
                        box-shadow: 0 4px 10px rgba(202, 31, 61, 0.4);
                    }
                    .rdp-day_today {
                        border: 2px solid #ffbe00; /* Yellow Border for Today */
                        color: #ffbe00;
                        font-weight: bold;
                    }
                `}</style>

            <DayPicker
              mode="single"
              required
              selected={tempDate}
              onSelect={setTempDate}
              showOutsideDays={false}
              className="m-0"

              classNames={{
                today: `rdp-day_today`,
                selected: `rdp-day_selected`,
                root: `${defaultClassNames.root} shadow-none`,
                chevron: `fill-white w-6 h-6 hover:fill-[#ffbe00] transition-colors`,
              }}
            />
          </div>

          {/* Actions */}
          <div className="p-4 pt-0 flex justify-end gap-2 text-sm font-medium">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-gray-400 hover:bg-white/5 rounded-full transition-colors font-medium hover:text-white"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 py-2.5 text-black bg-[#ffbe00] hover:bg-[#ffbe00]/90 rounded-full transition-colors font-bold shadow-[0_0_15px_rgba(255,190,0,0.3)]"
            >
              PILIH
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
