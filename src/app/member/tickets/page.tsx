'use client';

import { Ticket, Calendar, Clock, MapPin, Loader2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import QRCode from "react-qr-code";

export default function TicketsPage() {
  const { data: session } = useSession();

  // Fetch My Active Bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', 'my-tickets', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/member/bookings?mode=list');
      const data = await res.json();
      // Filter: Hanya Status Aktif
      return data.data ? data.data.filter((b: any) =>
        ['paid', 'confirmed', 'pending_approval', 'pending_payment'].includes(b.status)
      ) : [];
    },
    enabled: !!session?.user?.id
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
              Jadwal aktif mabar, drilling, dan turnamen Anda.
            </p>
          </div>
        </div>
      </div>

      {/* TICKETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {bookings.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-[#1A1A1A] rounded-[2rem] border border-white/5">
            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Tidak Ada Tiket Aktif</h3>
            <p className="text-gray-500">Yuk cari jadwal mabar atau drilling baru!</p>
          </div>
        ) : (
          bookings.map((booking: any, index: number) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-[#ffbe00]/5">

                {/* Status Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffbe00]/10 to-transparent blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <Badge variant="outline" className={`px-3 py-1 text-[10px] tracking-widest font-bold uppercase
                        ${booking.status === 'confirmed' || booking.status === 'paid' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                      booking.status === 'pending_approval' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' :
                        'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}
                    `}>
                    {booking.status === 'pending_payment' ? 'UNPAID' : booking.status.replace('_', ' ')}
                  </Badge>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-mono">#{booking.ticketCode}</span>
                    <span className="text-sm font-black text-white">
                      Rp {booking.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#ffbe00] transition-colors line-clamp-2">
                    {booking.event.title || booking.eventTitle}
                  </h3>

                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Calendar className="w-4 h-4 text-[#ca1f3d]" />
                      <span>{new Date(booking.event.date || booking.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Clock className="w-4 h-4 text-[#ca1f3d]" />
                      <span>{booking.event.time || booking.eventTime}</span>
                    </div>
                    {(booking.event.location || booking.eventLocation) && (
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-[#ca1f3d]" />
                        <span className="truncate">{booking.event.location || booking.eventLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full bg-white/5 text-white hover:bg-[#ffbe00] hover:text-black border border-white/5 font-bold rounded-xl h-10 text-xs">
                    <QrCode className="w-4 h-4 mr-2" /> DETAIL TIKET
                  </Button>
                </div>

                {/* Footer Stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
