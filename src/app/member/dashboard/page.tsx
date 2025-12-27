
'use client';

import { useSession } from 'next-auth/react';
import { Trophy, CalendarDays, Clock, MapPin, QrCode, ArrowRight, Ticket, Swords, Dumbbell, UserCog, Users, Medal, SearchX, Shirt, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import DashboardSkeleton from '@/components/dashboard/dashboard-skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from "react-qr-code";

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  
  // State untuk Order Jersey
  const [jerseyOrders, setJerseyOrders] = useState<any[]>([]);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Fetch Jersey Orders
            const res = await fetch('/api/member/jersey');
            if (res.ok) {
                const data = await res.json();
                if(data.success) setJerseyOrders(data.data);
            }
            
            // 2. Fetch Active Booking (Tiket Mabar)
            const resTicket = await fetch('/api/member/bookings');
            const dataTicket = await resTicket.json();
            if (dataTicket.success && dataTicket.active) {
                setActiveTicket(dataTicket.active);
            }

        } catch (e) { console.error(e) } 
        finally { setIsLoading(false); }
    };

    if (session) fetchData();
    else setIsLoading(false);
  }, [session]);

  // Logic Download QR
  const handleDownloadQR = (orderId: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgElement = document.getElementById("dashboard-qr-svg");

    if (!ctx || !svgElement) return;

    canvas.width = 1080;
    canvas.height = 1350;

    // Background
    ctx.fillStyle = "#151515";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Logo
    const logoImg = new window.Image();
    logoImg.src = "/images/logo.png";
    logoImg.crossOrigin = "anonymous";

    logoImg.onload = () => {
        // Draw Logo
        const logoWidth = 200;
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        const logoX = (canvas.width - logoWidth) / 2;
        ctx.drawImage(logoImg, logoX, 150, logoWidth, logoHeight);

        // Draw Text
        ctx.font = "bold 60px sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("BADMINTOUR", canvas.width / 2, 150 + logoHeight + 80);

        ctx.font = "40px sans-serif";
        ctx.fillStyle = "#FFBE00";
        ctx.fillText("OFFICIAL JERSEY ORDER", canvas.width / 2, 150 + logoHeight + 140);

        // Draw QR
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const qrImg = new window.Image();

        qrImg.onload = () => {
            const qrBoxSize = 600;
            const qrBoxX = (canvas.width - qrBoxSize) / 2;
            const qrBoxY = 600;
            
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
            
            const padding = 50;
            ctx.drawImage(qrImg, qrBoxX + padding, qrBoxY + padding, qrBoxSize - (padding*2), qrBoxSize - (padding*2));
            URL.revokeObjectURL(url);

            ctx.font = "bold 50px monospace";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(orderId, canvas.width / 2, qrBoxY + qrBoxSize + 100);

            ctx.font = "30px sans-serif";
            ctx.fillStyle = "#888888";
            ctx.fillText("Scan this code at pickup location", canvas.width / 2, canvas.height - 100);

            const link = document.createElement("a");
            link.download = `JERSEY-ORDER-${orderId}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        qrImg.src = url;
    };
  };

  if (status === "loading" || isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 pb-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="flex items-center gap-5 relative z-10">
                <Avatar className="w-20 h-20 border-4 border-[#1A1A1A] shadow-xl">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-[#ffbe00] text-black font-black text-2xl">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">Hi, {session?.user?.name?.split(' ')[0] || 'Athlete'}!</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[#ffbe00] border-[#ffbe00]/30 bg-[#ffbe00]/10 text-[10px] uppercase tracking-widest font-bold">Member</Badge>
                        <span className="text-xs text-gray-500 font-mono">ID: {session?.user?.id?.slice(0,6).toUpperCase() || '---'}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto relative z-10">
                <Link href="/member/profile" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto h-12 px-8 rounded-xl bg-[#ffbe00] text-black hover:bg-yellow-400 font-black shadow-[0_0_20px_rgba(255,190,0,0.4)] hover:scale-105 transition-transform">
                        <UserCog className="w-4 h-4 mr-2" /> LENGKAPI PROFILE
                    </Button>
                </Link>
            </div>
        </header>

        {/* SECTION JERSEY ORDERS */}
        <section>
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-[#ca1f3d]" /> MY JERSEY PRE-ORDER
                </h3>
                {/* --- UPDATE: Link Mengarah ke /member/jersey --- */}
                <Link href="/member/jersey">
                    <Button variant="link" className="text-[#ffbe00] text-xs font-bold">Pesan Lagi +</Button>
                </Link>
            </div>

            {jerseyOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jerseyOrders.map((order) => (
                        <div key={order.orderId} className="bg-[#151515] p-4 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:border-[#ca1f3d]/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                    <Image src="/images/jersey-season-1.png" width={50} height={50} alt="Jersey" className="object-contain" />
                                </div>
                                <div>
                                    <p className="font-black text-white text-sm uppercase tracking-wide">{order.backName} <span className="text-gray-500 text-xs">({order.size})</span></p>
                                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{order.orderId}</p>
                                    <Badge className={`mt-2 text-[10px] ${order.pickupStatus === 'picked_up' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {order.pickupStatus === 'picked_up' ? 'SUDAH DIAMBIL' : 'SIAP DIAMBIL'}
                                    </Badge>
                                </div>
                            </div>
                            <Button 
                                onClick={() => setSelectedQr(order.orderId)}
                                className="h-10 w-10 rounded-full bg-white text-black hover:bg-[#ffbe00] p-0 flex items-center justify-center shadow-lg"
                            >
                                <QrCode className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#151515] border border-white/5 border-dashed rounded-[2rem] p-6 text-center">
                    <p className="text-gray-500 text-sm mb-4">Belum ada pesanan jersey.</p>
                    <Link href="/member/jersey">
                        <Button variant="outline" className="border-[#ca1f3d] text-[#ca1f3d] hover:bg-[#ca1f3d] hover:text-white rounded-xl h-10 px-6 font-bold text-xs">
                            Pesan Sekarang
                        </Button>
                    </Link>
                </div>
            )}
        </section>

        {/* GAME MODE SELECTION */}
        <section>
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2"><Swords className="w-5 h-5 text-[#ffbe00]" /> CHOOSE YOUR GAME</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GameCard href="/member/mabar" icon={Users} color="text-blue-500" bgColor="bg-blue-500" title="Mabar" desc="Gabung sesi main bareng komunitas." />
                <GameCard href="/member/mabar?type=sparring" icon={Swords} color="text-red-500" bgColor="bg-red-500" title="Sparring" desc="Tantang komunitas lain." />
                <GameCard href="/member/drilling" icon={Dumbbell} color="text-green-500" bgColor="bg-green-500" title="Drilling" desc="Latihan intensif dengan pelatih." />
                <GameCard href="/member/tournaments" icon={Trophy} color="text-[#ffbe00]" bgColor="bg-[#ffbe00]" title="Turnamen" desc="Kompetisi resmi berhadiah." />
            </div>
        </section>
        
        {/* ACTIVE TICKET SECTION */}
        <section>
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2"><Ticket className="w-5 h-5 text-[#ffbe00]" /> UPCOMING SESSION</h3>
            </div>
            
            {activeTicket ? (
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0f0f0f] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col md:flex-row relative shadow-2xl group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffbe00] to-orange-500"></div>
                    <div className="p-8 flex-1 relative z-10 flex flex-col justify-between">
                        <div>
                            <div className="flex gap-2 mb-4">
                                <Badge className="bg-green-500/10 text-green-500 border-0 text-[10px] uppercase font-bold px-3 py-1 animate-pulse">● READY</Badge>
                                <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px] uppercase font-bold px-3 py-1">{activeTicket.court}</Badge>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{activeTicket.event}</h2>
                            <p className="text-sm text-gray-500 font-medium">Slot Mabar dikonfirmasi. Tunjukkan QR Code ini ke Host.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div><p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Date</p><p className="text-xl font-black text-white font-jersey">{activeTicket.date}</p></div>
                            <div><p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p><p className="text-xl font-black text-white font-jersey">{activeTicket.time}</p></div>
                            <div className="col-span-2"><p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</p><p className="text-base font-bold text-white">{activeTicket.location}</p></div>
                        </div>
                    </div>
                    <div className="relative p-8 bg-white text-black flex flex-col items-center justify-center md:w-72 md:border-l-2 md:border-dashed md:border-gray-300">
                        <div className="bg-black p-2 rounded-xl mb-4"><QrCode className="w-32 h-32 text-white" /></div>
                        <p className="text-[10px] font-mono text-center uppercase tracking-widest opacity-60">Scan to Play</p>
                        <p className="text-xl font-black font-mono mt-1 tracking-widest">{activeTicket.id}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-[#151515] border border-white/5 border-dashed rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6 text-gray-600">
                        <SearchX className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-2">Belum ada jadwal main</h4>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">Kamu belum mendaftar mabar atau turnamen apapun minggu ini. Yuk cari lawan main!</p>
                    <Link href="/member/mabar">
                        <Button variant="outline" className="border-[#ffbe00] text-[#ffbe00] hover:bg-[#ffbe00] hover:text-black font-bold rounded-xl h-12 px-8">
                            Cari Mabar Sekarang
                        </Button>
                    </Link>
                </div>
            )}
        </section>

        {/* MODAL VIEW QR CODE */}
        <Dialog open={!!selectedQr} onOpenChange={(open) => !open && setSelectedQr(null)}>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-xs rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-center font-black text-[#ffbe00] tracking-widest uppercase">Scan for Pickup</DialogTitle>
                </DialogHeader>
                <div className="bg-white p-6 rounded-2xl mx-auto my-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    {selectedQr && (
                         <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                            <QRCode
                                id="dashboard-qr-svg"
                                size={180}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={selectedQr}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    )}
                </div>
                <p className="text-center font-mono font-bold text-white text-lg tracking-widest mb-4">{selectedQr}</p>
                <Button 
                    onClick={() => selectedQr && handleDownloadQR(selectedQr)} 
                    className="w-full rounded-xl bg-[#151515] border border-white/20 text-white hover:bg-[#ffbe00] hover:text-black font-bold"
                >
                    <Download className="w-4 h-4 mr-2" /> Download Ticket
                </Button>
            </DialogContent>
        </Dialog>

    </div>
  );
}

// Helper (GameCard)
function GameCard({ href, icon: Icon, color, bgColor, title, desc }: any) {
    return (
        <Link href={href} className="group">
            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] h-full relative overflow-hidden transition-all duration-300 group-hover:bg-[#1A1A1A] group-hover:border-[#ffbe00]/50 group-hover:-translate-y-1">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className={`w-24 h-24 ${color}`} />
                </div>
                <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl ${bgColor}/10 ${color} flex items-center justify-center mb-4 group-hover:${bgColor} group-hover:text-white transition-colors`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-1">{title}</h4>
                    <p className="text-xs text-gray-400">{desc}</p>
                </div>
            </Card>
        </Link>
    );
}

    
