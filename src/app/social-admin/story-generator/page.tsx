'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, Copy, RefreshCcw } from "lucide-react";
import html2canvas from "html2canvas";

export default function StoryGeneratorPage() {
  const [data, setData] = useState({
    title: "MABAR BADMINTON",
    subtitle: "GOR VELODROME • 19:00 WIB",
    highlight: "SISA 2 SLOT!",
    bgImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80"
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 2 // High Resolution
      });

      const link = document.createElement('a');
      link.download = `story-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
          STORY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ff4e00]">GENERATOR</span>
        </h1>
        <p className="text-gray-400 mt-2">Create engaging Instagram Stories in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* CONTROLS */}
        <Card className="bg-[#1A1A1A] border-[#333] text-white p-6 space-y-6">
          <div className="space-y-2">
            <Label>Event Title</Label>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="bg-[#0a0a0a] border-[#333] text-white uppercase font-bold"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle (Place/Time)</Label>
            <Input
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="bg-[#0a0a0a] border-[#333] text-white uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label>Highlight Text</Label>
            <Input
              value={data.highlight}
              onChange={(e) => setData({ ...data, highlight: e.target.value })}
              className="bg-[#0a0a0a] border-[#333] text-white font-bold text-[#ffbe00]"
            />
          </div>
          <div className="space-y-2">
            <Label>Background Image URL</Label>
            <div className="flex gap-2">
              <Input
                value={data.bgImage}
                onChange={(e) => setData({ ...data, bgImage: e.target.value })}
                className="bg-[#0a0a0a] border-[#333] text-white text-xs"
              />
              <Button variant="outline" size="icon" className="shrink-0 border-[#333] bg-[#0a0a0a]" onClick={() => setData({ ...data, bgImage: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80" })}>
                <RefreshCcw className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          <Button onClick={handleDownload} className="w-full bg-[#ffbe00] text-black font-bold h-12 text-lg">
            <Download className="w-5 h-5 mr-2" />
            Download Image
          </Button>
        </Card>

        {/* PREVIEW */}
        <div className="flex justify-center bg-[#111] p-8 rounded-3xl border border-[#333]">
          {/* 9:16 Aspect Ratio Container */}
          <div
            ref={previewRef}
            className="relative w-[320px] h-[568px] overflow-hidden bg-black shadow-2xl flex flex-col justify-between"
            style={{
              backgroundImage: `url(${data.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

            {/* TOP BRANDING */}
            <div className="relative z-10 p-6 pt-10 text-center">
              <h2 className="text-white font-black italic tracking-tighter text-2xl uppercase drop-shadow-md">
                BADMIN<span className="text-[#ffbe00]">TOUR</span>
              </h2>
            </div>

            {/* CENTER HIGHLIGHT */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
              <div className="bg-[#ffbe00] text-black px-6 py-2 transform -rotate-2 shadow-lg">
                <h1 className="text-3xl font-black uppercase tracking-tighter loading-none">
                  {data.highlight}
                </h1>
              </div>
            </div>

            {/* BOTTOM DETAILS */}
            <div className="relative z-10 p-8 pb-12 text-center space-y-2">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-xl">
                {data.title}
              </h3>
              <div className="h-1 w-20 bg-[#ffbe00] mx-auto rounded-full my-3" />
              <p className="text-white font-bold uppercase tracking-widest text-sm drop-shadow-md">
                {data.subtitle}
              </p>

              <div className="pt-6">
                <div className="inline-block bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Join Now at badmintour.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
