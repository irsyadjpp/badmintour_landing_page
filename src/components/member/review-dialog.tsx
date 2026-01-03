"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    eventId: string;
    event?: {
      title: string;
    };
  };
}

export function ReviewDialog({ isOpen, onClose, booking }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Pilih Rating",
        description: "Silakan berikan bintang 1-5.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          eventId: booking.eventId,
          rating,
          comment,
          isAnonymous: false, // Default false for now
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal mengirim ulasan");

      toast({
        title: "Terima Kasih!",
        description: "Ulasan Anda telah diterima.",
        className: "bg-green-600 text-white border-0",
      });

      // Refresh Data
      queryClient.invalidateQueries({ queryKey: ["member-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["drilling-bookings"] });

      onClose(); // Close Modal

      // Reset Form
      setTimeout(() => {
        setRating(0);
        setComment("");
      }, 500);

    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#151515] border-white/10 text-white sm:max-w-md rounded-[2rem]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
            BERI <span className="text-[#ffbe00]">ULASAN</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Bagaimana sesi latihan <span className="text-white font-bold">{booking.event?.title}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
          {/* Star Input */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${star <= (hoverRating || rating)
                      ? "fill-[#ffbe00] text-[#ffbe00]"
                      : "text-gray-600"
                    }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          <div className="text-sm font-bold text-[#ffbe00] h-4">
            {hoverRating === 1 && "Sangat Buruk 😡"}
            {hoverRating === 2 && "Kurang ☹️"}
            {hoverRating === 3 && "Cukup 😐"}
            {hoverRating === 4 && "Bagus 🙂"}
            {hoverRating === 5 && "Sangat Puas! 🔥"}
            {!hoverRating && rating > 0 && "Terima Kasih!"}
          </div>

          <Textarea
            placeholder="Tulis ulasanmu di sini (opsional)..."
            className="bg-[#0a0a0a] border-white/10 rounded-xl min-h-[100px] text-white focus:border-[#ffbe00]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <DialogFooter className="sm:justify-center w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#ffbe00] text-black font-bold hover:bg-[#ffbe00]/90 rounded-xl px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim...
              </>
            ) : (
              "KIRIM ULASAN"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
