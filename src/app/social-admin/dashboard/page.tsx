'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Image, Eye, Share2, TrendingUp, Instagram, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function SocialAdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const connected = searchParams.get('connected');

  // Connection State
  const [integration, setIntegration] = useState<any>(null);
  const [tiktokIntegration, setTiktokIntegration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Instagram Status
    const unsubIg = onSnapshot(doc(db, "system_config", "social_integration"), (docSnapshot) => {
      if (docSnapshot.exists()) setIntegration(docSnapshot.data());
      else setIntegration(null);
    });

    // Listen to TikTok Status
    const unsubTiktok = onSnapshot(doc(db, "system_config", "tiktok_integration"), (docSnapshot) => {
      if (docSnapshot.exists()) setTiktokIntegration(docSnapshot.data());
      else setTiktokIntegration(null);
      setLoading(false); // Set loading false after at least one check (conceptually simplified)
    });

    return () => {
      unsubIg();
      unsubTiktok();
    };
  }, []);

  const handleConnect = () => {
    window.location.href = "/api/social/auth/login";
  };

  const handleConnectTikTok = () => {
    window.location.href = "/api/social/auth/tiktok/login";
  };

  // Mock Data (Nanti bisa diganti real data fetch)
  const stats = [
    {
      title: "Total Moments",
      value: "124",
      icon: Image,
      description: "+12 week over week"
    },
    {
      title: "Total Views",
      value: "4.2k",
      icon: Eye,
      description: "+18% from last month"
    },
    {
      title: "Shared Stories",
      value: "89",
      icon: Share2,
      description: "Generated via Story Tool"
    },
    {
      title: "Engagement Rate",
      value: "12.5%",
      icon: TrendingUp,
      description: "Based on interactions"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
          DASHBOARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ff4e00]">SOCIAL</span>
        </h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening in the community.</p>
      </div>

      {/* ALERTS */}
      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-900 text-white">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
        </Alert>
      )}

      {/* CONNECTIVITY STATUS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* INSTAGRAM CARD */}
        <Card className="bg-[#1A1A1A] border-[#333] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" /> Instagram Integration
            </CardTitle>
            <CardDescription className="text-gray-400">
              Connect your Instagram Professional account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-400 animate-pulse">Checking status...</p>
            ) : integration ? (
              <div className="flex items-center gap-4 bg-green-900/20 p-4 rounded-xl border border-green-900/50">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-green-500">Connected</p>
                  <p className="text-xs text-gray-400">Page ID: {integration.facebookPageId}</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-900/50">
                <p className="text-sm text-yellow-500 font-bold mb-2">Not Connected</p>
                <Button
                  onClick={handleConnect}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-bold"
                >
                  <Instagram className="w-4 h-4 mr-2" /> Connect Instagram
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* TIKTOK CARD */}
        <Card className="bg-[#1A1A1A] border-[#333] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-cyan-400 font-black text-lg">♪</span> TikTok Integration
            </CardTitle>
            <CardDescription className="text-gray-400">
              Connect your TikTok for Developers account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-400 animate-pulse">Checking status...</p>
            ) : tiktokIntegration ? (
              <div className="flex items-center gap-4 bg-green-900/20 p-4 rounded-xl border border-green-900/50">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-green-500">Connected</p>
                  <p className="text-xs text-gray-400">User: {tiktokIntegration.displayName}</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-900/50">
                <p className="text-sm text-yellow-500 font-bold mb-2">Not Connected</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleConnectTikTok}
                    className="w-full bg-black hover:bg-gray-900 border border-gray-700 text-white font-bold"
                  >
                    <span className="mr-2 font-black text-cyan-400">♪</span> Connect TikTok
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-[#1A1A1A] border-[#333] text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-[#ffbe00]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* RECENT ACTIVITY OR QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#1A1A1A] border-[#333] text-white h-[300px] flex items-center justify-center border-dashed">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Review Analytics Chart (Coming Soon)</p>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#333] text-white h-[300px] flex items-center justify-center border-dashed">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Recent Uploads (Coming Soon)</p>
        </Card>
      </div>
    </div>
  );
}
