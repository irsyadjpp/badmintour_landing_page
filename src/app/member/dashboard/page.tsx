
'use client';

import { useSession } from 'next-auth/react';
import { Trophy, CalendarDays, Clock, MapPin, QrCode, ArrowRight, Ticket, Swords, Dumbbell, UserCog, Users, Medal, SearchX, Shirt, Download, Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import DashboardSkeleton from '@/components/dashboard/dashboard-skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from "react-qr-code";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function MemberDashboard() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);

    const [jerseyOrders, setJerseyOrders] = useState<any[]>([]);
    const [selectedQr, setSelectedQr] = useState<string | null>(null);

    const { toast } = useToast();
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cancelId, setCancelId] = useState<string | null>(null); // ID booking yg mau di-cancel
    const [canceling, setCanceling] = useState(false);

    // LOGIC CANCEL
    const handleCancelBooking = async () => {
        if (!cancelId) return;
        setCanceling(true);

        try {
            const res = await fetch('/api/bookings/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: cancelId })
            });

            const data = await res.json();

            if (res.ok) {
                toast({ title: "Dibatalkan", description: "Booking telah dibatalkan & slot dikembalikan." });
                setCancelId(null);
                // REFRESH DATA (Panggil fungsi fetch ulang data booking di sini)
                fetchData();
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setCanceling(false);
        }
    };

    // FUNGSI HANDLE UPLOAD
    const handleUploadProof = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            toast({ title: "Error", description: "Pilih file gambar terlebih dahulu.", variant: "destructive" });
            return;
        }

        setUploading(true);

        // Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result;

            try {
                const res = await fetch('/api/bookings/upload-proof', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId: selectedBooking.id, imageBase64: base64 })
                });

                if (res.ok) {
                    toast({ title: "Berhasil", description: "Bukti terkirim. Mohon tunggu verifikasi admin.", className: "bg-green-600 text-white" });
                    setSelectedBooking(null);
                    // TODO: Refresh data booking di sini (panggil ulang fetchBookings jika ada)
                    fetchData();
                } else {
                    throw new Error("Gagal upload");
                }
            } catch (e) {
                toast({ title: "Gagal", description: "Terjadi kesalahan upload.", variant: "destructive" });
            } finally {
                setUploading(false);
            }
        };
    };

    const fetchData = async () => {
        try {
            const res = await fetch('/api/member/jersey');
            if (res.ok) {
                const data = await res.json();
                if (data.success) setJerseyOrders(data.data);
            }

            // Fetch All Active Bookings
            const resBookings = await fetch('/api/member/bookings?mode=list');
            const dataBookings = await resBookings.json();
            if (dataBookings.success) {
                setBookings(dataBookings.data);
                if (dataBookings.data.length > 0) {
                    setActiveTicket(dataBookings.data[0]);
                }
            }

        } catch (e) { console.error(e) }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        if (session) {
            fetchData();
        } else {
            setIsLoading(false)
        };
    }, [session]);

    const handleDownloadQR = (orderId: string) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const svgElement = document.getElementById("dashboard-qr-svg");

        if (!ctx || !svgElement) return;

        canvas.width = 1080;
        canvas.height = 1350;

        ctx.fillStyle = "#151515";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const logoImg = new window.Image();
        logoImg.src = "/images/logo.png";
        logoImg.crossOrigin = "anonymous";

        logoImg.onload = () => {
            const logoWidth = 200;
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            const logoX = (canvas.width - logoWidth) / 2;
            ctx.drawImage(logoImg, logoX, 150, logoWidth, logoHeight);

            ctx.font = "bold 60px sans-serif";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText("BADMINTOUR", canvas.width / 2, 150 + logoHeight + 80);

            ctx.font = "40px sans-serif";
            ctx.fillStyle = "#FFBE00";
            ctx.fillText("OFFICIAL JERSEY ORDER", canvas.width / 2, 150 + logoHeight + 140);

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
                ctx.drawImage(qrImg, qrBoxX + padding, qrBoxY + padding, qrBoxSize - (padding * 2), qrBoxSize - (padding * 2));
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
                            <span className="text-xs text-gray-500 font-mono">ID: {session?.user?.id?.slice(0, 6).toUpperCase() || '---'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto relative z-10">
                    <Link href="/member/profile" className="w-full md:w-auto">
                        <Button className="w-full md:w-auto h-12 px-8 rounded-xl bg-[#ffbe00] text-black hover:bg-yellow-400 font-black shadow-[0_0_20px_rgba(255,190,0,0.4)] hover:scale-105 transition-transform">
                            <UserCog className="w-4 h-4 mr-2" /> PROFILE
                        </Button>
                    </Link>
                </div>
            </header>

            <section>
                <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <Shirt className="w-5 h-5 text-[#ca1f3d]" /> MY JERSEY PRE-ORDER
                    </h3>
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

            {/* UPDATED BOOKING SECTION */}
            <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-6">
                <h3 className="text-xl font-black text-white mb-6">JADWAL SAYA</h3>

                {/* REAL DATA MAPPING */}
                {bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                        <div key={booking.id} className="flex flex-col md:flex-row justify-between items-center bg-[#0a0a0a] p-4 rounded-xl border border-white/5 gap-4 group hover:border-[#ffbe00]/30 transition-colors">
                            <div className="flex-1">
                                <div className="flex justify-between md:justify-start gap-4 mb-1">
                                    <p className="font-bold text-white">{booking.event.title}</p>
                                    <Badge variant="outline" className={`text-[10px] ${booking.status === 'paid' || booking.status === 'confirmed' || booking.status === 'CONFIRMED' ? 'text-green-500 border-green-500/20 bg-green-500/10' :
                                        booking.status === 'pending_payment' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' :
                                            booking.status === 'pending_approval' ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' :
                                                'text-gray-500 border-gray-500/20'
                                        }`}>
                                        {booking.status === 'paid' || booking.status === 'confirmed' || booking.status === 'CONFIRMED' ? 'CONFIRMED' :
                                            booking.status === 'pending_payment' ? 'MENUNGGU PEMBAYARAN' :
                                                booking.status === 'pending_approval' ? 'MENUNGGU APPROVAL' :
                                                    booking.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="text-xs text-gray-500 space-y-0.5">
                                    <p>{new Date(booking.event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • {booking.event.time}</p>
                                    {booking.event.location && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.event.location}</p>}
                                </div>

                                {booking.status === 'pending_payment' && (
                                    <p className="text-xs text-yellow-500 mt-2 font-mono">Total: Rp {booking.totalPrice.toLocaleString('id-ID')}</p>
                                )}
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                {/* Action Buttons based on Status */}
                                {booking.status === 'pending_payment' && (
                                    <Button
                                        size="sm"
                                        onClick={() => setSelectedBooking({ id: booking.id, title: booking.event.title, price: booking.totalPrice.toLocaleString('id-ID') })}
                                        className="w-full md:w-auto bg-yellow-500 text-black font-bold hover:bg-yellow-400"
                                    >
                                        Upload Bukti Bayar
                                    </Button>
                                )}

                                {/* Cancel Button (Only if not completed/cancelled, simpler logic for now) */}
                                {(booking.status !== 'cancelled' && booking.status !== 'rejected') && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={(() => {
                                            // Helper inside render to check if event is past
                                            try {
                                                const now = new Date();
                                                const eventDate = new Date(booking.event.date);

                                                let hours = 23;
                                                let minutes = 59;

                                                if (booking.event.time) {
                                                    // Parse "15.00 - 17.00" -> take "15.00" as start limit for cancellation?
                                                    // User request: "jika jadwal event telah lewat" -> usually means Start Time passed.
                                                    // Let's safe bet: Start Time passed = Cannot Cancel.
                                                    const parts = booking.event.time.split('-');
                                                    const startTimeStr = parts[0].trim().replace('.', ':');
                                                    const [h, m] = startTimeStr.split(':').map(Number);
                                                    if (!isNaN(h)) hours = h;
                                                    if (!isNaN(m)) minutes = m;
                                                }

                                                eventDate.setHours(hours, minutes, 0);
                                                return now > eventDate;
                                            } catch (e) { return false; }
                                        })()}
                                        className="w-full md:w-auto bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setCancelId(booking.id)}
                                    >
                                        BATALKAN
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>Belum ada jadwal aktif.</p>
                        <Link href="/member/mabar"><Button variant="link" className="text-[#ffbe00]">Cari Jadwal Main</Button></Link>
                    </div>
                )}

            </div>

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

            {/* MODAL UPLOAD BUKTI */}
            <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-[2rem] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">Konfirmasi Pembayaran</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 text-center">
                            <p className="text-gray-400 text-xs uppercase font-bold">Total Transfer</p>
                            <p className="text-3xl font-black text-[#ffbe00] mt-1">Rp {selectedBooking?.price}</p>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-xs text-gray-300 mb-1">Transfer ke BCA:</p>
                                <p className="text-lg font-mono font-bold select-all bg-white/5 p-2 rounded-lg">123 456 7890</p>
                                <p className="text-[10px] text-gray-500 mt-1">a.n BadminTour Official</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase text-gray-400">Upload Bukti (Screenshot/Foto)</Label>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="bg-[#0a0a0a] border-white/10 file:bg-white/10 file:text-white file:border-0 file:rounded-lg file:mr-4 file:px-4 file:font-bold hover:file:bg-white/20"
                            />
                        </div>

                        <Button
                            onClick={handleUploadProof}
                            disabled={uploading}
                            className="w-full bg-[#00f2ea] text-black font-black hover:bg-[#00c2bb] h-12 rounded-xl"
                        >
                            {uploading ? "MENGUPLOAD..." : "KIRIM BUKTI TRANSFER"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG KONFIRMASI */}
            <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
                <AlertDialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yakin ingin membatalkan?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Slot Anda akan dibuka kembali untuk orang lain.
                            <br /><br />
                            <span className="text-red-400 font-bold text-xs">*Jika sudah transfer, dana akan masuk proses refund manual (hubungi admin). Pembatalan hanya bisa dilakukan H-6 jam.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">Kembali</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelBooking}
                            disabled={canceling}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                            {canceling ? "Memproses..." : "Ya, Batalkan Booking"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}

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

