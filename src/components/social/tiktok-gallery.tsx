'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, MessageCircle, Share2, PlayCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TikTokVideo {
  id: string;
  title: string;
  cover_image_url: string;
  embed_html: string;
  embed_link: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  create_time: number;
}

export default function TikTokGallery() {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<TikTokVideo | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/social/tiktok/videos');
      const data = await res.json();

      if (data.error) {
        // If it's just "not connected", fail silently or show empty
        if (data.error === "TikTok not connected") {
          setVideos([]);
        } else {
          setError(data.error);
        }
      } else {
        setVideos(data.videos || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-900 text-red-500 rounded-lg">
        Error loading videos: {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-[#1A1A1A] rounded-xl border border-[#333] border-dashed">
        <p>No videos found or TikTok not connected.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="group relative">
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#333] cursor-pointer hover:border-[#ffbe00] transition-all">
                {/* Thumbnail */}
                <div className="aspect-[9/16] relative bg-gray-900">
                  <img
                    src={video.cover_image_url}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all">
                    <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center gap-3 text-xs text-white font-medium">
                      <div className="flex items-center gap-1">
                        <PlayCircle className="w-3 h-3" /> {Intl.NumberFormat('en-US', { notation: "compact" }).format(video.view_count)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {Intl.NumberFormat('en-US', { notation: "compact" }).format(video.like_count)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-black border-[#333] text-white max-w-sm sm:max-w-md p-0 overflow-hidden">
              {/* Embed Player */}
              {/* Since TikTok embed HTML often contains scripts, using iframe simply or dangerouslySetInnerHTML */}
              <div className="w-full aspect-[9/16] bg-black flex items-center justify-center">
                {/* Use iframe directly if possible or dangerouslySetInnerHTML */}
                {/* TikTok Embed Link usually sends to web player. Embed HTML is better but needs script execution. */}
                {/* For simplicity/security, imply redirect or basic iframe if embed_link allows it */}
                <iframe
                  src={'https://www.tiktok.com/embed/v2/' + video.id}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 bg-zinc-900">
                <h3 className="font-bold text-sm line-clamp-2 mb-2">{video.title || "No Caption"}</h3>
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {video.like_count}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {video.comment_count}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {video.share_count}</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
