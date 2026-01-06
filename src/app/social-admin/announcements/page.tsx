'use client';

import { Card } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function SocialAdminAnnouncementsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
          COMMUNITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ff4e00]">ANNOUNCEMENTS</span>
        </h1>
        <p className="text-gray-400 mt-2">Manage running text and popup banners.</p>
      </div>

      <Card className="bg-[#1A1A1A] border-[#333] border-dashed h-[400px] flex flex-col items-center justify-center text-gray-500 space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#333] flex items-center justify-center">
          <Megaphone className="w-8 h-8 text-[#ffbe00]" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">Under Development</h3>
          <p className="text-sm mt-1">This feature will allow you to push notifications to all members.</p>
        </div>
      </Card>
    </div>
  );
}
