'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon, Check, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${title}\n${text}\n\nJoin di sini: ${shareUrl}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-gray-400 hover:text-gray-900 gap-2 text-xs font-bold uppercase tracking-wider w-full">
          <Share2 className="w-4 h-4" /> Share Event
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-1">
        {/* 1. NATIVE SHARE (Mostly Mobile) */}
        <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer font-medium text-gray-700 focus:bg-gray-50 rounded-lg py-2.5">
          <Share2 className="w-4 h-4 mr-2" /> Share via...
        </DropdownMenuItem>

        {/* 2. WHATSAPP */}
        <DropdownMenuItem onClick={handleWhatsApp} className="cursor-pointer font-medium text-green-600 focus:bg-green-50 rounded-lg py-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0-1h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0-1h1a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5v1a.5.5 0 0 0 1 0v-1h-1" opacity="0" /> {/* Just using path structure to mimic phone/chat icon style broadly if no specific WA icon in standard lucide set. Actually Lucide has Phone, but users recognize the bubble. Let's use custom SVG path for WA or just generic Phone. Actually, let's keep it simple with existing Lucide icons if possible, or inline SVG. */}
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          WhatsApp
        </DropdownMenuItem>

        {/* 3. PLATFORM HINTS (Instagram/TikTok do not have web share links) */}
        <div className="px-2 py-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider border-t border-gray-50 mt-1">
          Copy Link for IG/TikTok
        </div>

        {/* 4. COPY LINK */}
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer font-medium text-gray-700 focus:bg-gray-50 rounded-lg py-2.5">
          {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
