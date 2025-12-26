'use client';

import { useSession } from 'next-auth/react';
import { Trophy, CalendarDays, Clock, MapPin, QrCode, ArrowRight, Ticket, Swords, Dumbbell, UserCog, Users, Medal, SearchX, ShoppingBag, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DashboardSkeleton from '@/components/dashboard/dashboard-skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from "react-qr-code";
import Image from 'next/image';

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any>(null); 
  
  // State untuk Jersey Orders
  const [jerseyOrders, setJerseyOrders] = useState<any[]>([]);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Fetch Mock Ticket (existing logic)
            // setTimeout(() => { setIsLoading(false) }, 1000); // Simulasi

            // 2. Fetch Real Jersey Orders
            const res = await fetch('/api/member/jersey');
            if (res.ok) {
                const data = await res.json();
                setJerseyOrders(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (session) fetchData();
  }, [session]);

  if (status === "loading" || isLoading) {
      return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-20">
        
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

        {/* ... EXISTING SECTIONS ... */}
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

        {/* --- FITUR BARU: MY JERSEY ORDERS --- */}
        <section>
            <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-[#ca1f3d]" /> MY JERSEY ORDERS
                </h3>
                <Link href="/jersey">
                    <Button variant="link" className="text-[#ffbe00] text-xs font-bold">Order Lagi</Button>
                </Link>
            </div>

            {jerseyOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jerseyOrders.map((order) => (
                        <div key={order.orderId} className="bg-[#151515] p-4 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:border-[#ca1f3d]/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <Image src="/images/jersey-season-1.png" width={40} height={40} alt="Jersey" className="object-contain" />
                                </div>
                                <div>
                                    <p className="font-black text-white text-sm">{order.items[0].customName || "NO NAME"} (Size: {order.items[0].size})</p>
                                    <p className="text-xs text-gray-500 font-mono mt-1">{order.orderId}</p>
                                    <Badge className={`mt-2 text-[10px] ${order.pickupStatus === 'picked_up' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {order.pickupStatus === 'picked_up' ? 'SUDAH DIAMBIL' : 'SIAP DIAMBIL'}
                                    </Badge>
                                </div>
                            </div>
                            <Button 
                                onClick={() => setSelectedQr(order.orderId)}
                                className="h-10 w-10 rounded-full bg-white text-black hover:bg-[#ffbe00] p-0 flex items-center justify-center"
                            >
                                <QrCode className="w-5 h-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#151515] border border-white/5 border-dashed rounded-[2rem] p-8 text-center">
                    <p className="text-gray-500 text-sm">Belum ada order jersey.</p>
                </div>
            )}
        </section>

        {/* MODAL QR CODE VIEWER */}
        <Dialog open={!!selectedQr} onOpenChange={(open) => !open && setSelectedQr(null)}>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-center">Scan for Pickup</DialogTitle>
                </DialogHeader>
                <div className="bg-white p-6 rounded-2xl mx-auto my-4">
                    {selectedQr && (
                         <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={selectedQr}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    )}
                    <p className="text-center text-black font-mono font-bold mt-4 tracking-widest">{selectedQr}</p>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

// Helper Component for Game Card
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