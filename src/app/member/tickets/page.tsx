'use client';

import { Ticket, Calendar, Clock, MapPin, Loader2, QrCode, Shirt, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from "react-qr-code";

export default function TicketsPage() {
  const { data: session } = useSession();
  const [selectedQr, setSelectedQr] = useState<{ code: string; title: string } | null>(null);

  // Fetch My Active Bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', 'my-tickets', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/member/bookings?mode=list');
      const data = await res.json();
      // Filter: Hanya Status Aktif
      return data.data ? data.data.filter((b: any) =>
        ['paid', 'confirmed', 'pending_approval', 'pending_payment'].includes(b.status)
      ).map((b: any) => ({ ...b, type: 'event' })) : [];
    },
    enabled: !!session?.user?.id
  });

  // Fetch My Jersey Orders
  const { data: jerseyOrders = [], isLoading: jerseyLoading } = useQuery({
    queryKey: ['jersey-orders', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/member/jersey');
      const data = await res.json();
      return data.success ? data.data.map((j: any) => ({ ...j, type: 'jersey' })) : [];
    },
    enabled: !!session?.user?.id
  });

  const isLoading = bookingsLoading || jerseyLoading;

  // Combine & Sort by Date (Newest First)
  const combinedItems = [...bookings, ...jerseyOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.orderedAt).getTime();
    const dateB = new Date(b.createdAt || b.orderedAt).getTime();
    return dateB - dateA;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#ffbe00] mb-4" />
        <p className="font-mono text-[#ffbe00]">MEMUAT TIKET...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">

      {/* STANDARD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#ffbe00]/10 flex items-center justify-center border border-[#ffbe00]/20">
            <Ticket className="w-8 h-8 text-[#ffbe00]" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              TIKET <span className="text-[#ffbe00]">SAYA</span>
            </h1>
            <p className="text-gray-400 mt-1 max-w-xl text-sm">
              Jadwal aktif, turnamen, dan pesanan merchandise Anda.
            </p>
          </div>
        </div>
      </div>

      {/* TICKETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {combinedItems.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-[#1A1A1A] rounded-[2rem] border border-white/5">
            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Tidak Ada Tiket / Pesanan Aktif</h3>
            <p className="text-gray-500">Yuk cari jadwal mabar atau pesan jersey baru!</p>
          </div>
        ) : (
          combinedItems.map((item: any, index: number) => (
            <motion.div
              key={item.id || item.orderId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.type === 'event' ? (
                // --- EVENT TICKET CARD ---
                <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-[#ffbe00]/5 hover:bg-[#1a1a1a]">

                  {/* Status Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffbe00]/10 to-transparent blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>

                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <Badge variant="outline" className={`px-3 py-1 text-[10px] tracking-widest font-bold uppercase
                            ${item.status === 'confirmed' || item.status === 'paid' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                        item.status === 'pending_approval' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' :
                          'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}
                        `}>
                      {item.status === 'pending_payment' ? 'UNPAID' : item.status.replace('_', ' ')}
                    </Badge>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 font-mono">#{item.ticketCode || item.id}</span>
                      <span className="text-sm font-black text-white">
                        Rp {item.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#ffbe00] transition-colors line-clamp-2">
                      {item.event.title || item.eventTitle}
                    </h3>

                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-[#ca1f3d]" />
                        <span>{new Date(item.event.date || item.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-[#ca1f3d]" />
                        <span>{item.event.time || item.eventTime}</span>
                      </div>
                      {(item.event.location || item.eventLocation) && (
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <MapPin className="w-4 h-4 text-[#ca1f3d]" />
                          <span className="truncate">{item.event.location || item.eventLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => setSelectedQr({ code: item.ticketCode || item.id, title: item.event.title || 'Tiket Event' })}
                      className="w-full bg-white/5 text-white hover:bg-[#ffbe00] hover:text-black border border-white/5 font-bold rounded-xl h-10 text-xs shadow-lg transition-all"
                    >
                      <QrCode className="w-4 h-4 mr-2" /> LIHAT QR CODE
                    </Button>
                  </div>

                  {/* Footer Stripe */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Card>
              ) : (
                // --- JERSEY ORDER CARD ---
                <Card className="bg-[#0f172a] border-slate-800 p-6 rounded-[2rem] group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10">

                  {/* Status Glow Blue */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>

                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <Badge variant="outline" className={`px-3 py-1 text-[10px] tracking-widest font-bold uppercase
                            ${item.status === 'paid' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                        'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}
                        `}>
                      {item.status === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
                    </Badge>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500 font-mono">#{item.orderId?.split('-')?.[2] || 'ERR'}</span>
                      <span className="text-sm font-black text-white">
                        Rp {item.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Shirt className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white leading-tight">
                          Jersey Official 2026
                        </h3>
                        <p className="text-slate-400 text-xs">Custom Name</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Nama Punggung</span>
                        <span className="font-bold text-white uppercase tracking-wider">{item.backName}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Ukuran</span>
                        <Badge variant="secondary" className="font-mono">{item.size}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Jumlah</span>
                        <span className="text-white">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => setSelectedQr({ code: item.orderId, title: 'Jersey Order' })}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-10 text-xs shadow-lg shadow-blue-900/20 transition-all"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      LIHAT QR CODE
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={!!selectedQr} onOpenChange={(open) => !open && setSelectedQr(null)}>
        <DialogContent className="bg-[#151515] border-white/10 text-white sm:max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">{selectedQr?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className="bg-white p-4 rounded-3xl">
              {selectedQr?.code && (
                <QRCode
                  value={selectedQr.code}
                  size={200}
                  viewBox={`0 0 256 256`}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              )}
            </div>
            <p className="text-center text-gray-400 font-mono text-sm break-all">
              {selectedQr?.code}
            </p>
            <p className="text-center text-xs text-gray-500">
              Tunjukkan QR Code ini kepada petugas lokasi.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
