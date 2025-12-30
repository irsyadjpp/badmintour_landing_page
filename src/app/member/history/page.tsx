'use client';

import { History, Calendar, Clock, MapPin, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const { data: session } = useSession();

  // Fetch History Bookings
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['bookings', 'history', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/member/bookings?mode=list');
      const data = await res.json();
      // Filter: Status Selesai / Gagal / Completed (Past Date)
      return data.data ? data.data.filter((b: any) =>
        ['cancelled', 'rejected', 'completed', 'expired'].includes(b.status) ||
        (new Date(b.eventDate) < new Date() && !['cancelled', 'rejected'].includes(b.status)) // Auto complete if date passed
      ) : [];
    },
    enabled: !!session?.user?.id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center">
        <Loader2 className="animate-spin w-10 h-10 text-[#555] mb-4" />
        <p className="font-mono text-[#555]">MEMUAT RIWAYAT...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">

      {/* STANDARD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              RIWAYAT <span className="text-gray-500">MATCH</span>
            </h1>
            <p className="text-gray-400 mt-1 max-w-xl text-sm">
              Arsip kegiatan dan event yang telah selesai.
            </p>
          </div>
        </div>
      </div>

      {/* HISTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {history.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-[#151515] rounded-[2rem] border border-dashed border-white/10">
            <History className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Belum Ada Riwayat</h3>
            <p className="text-gray-500 text-sm mt-2">Book match pertamamu di menu Drilling atau Mabar!</p>
          </div>
        ) : (
          history.map((item: any, index: number) => {
            const isFailed = item.status === 'cancelled' || item.status === 'rejected';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`bg-[#151515] border-white/5 p-6 rounded-[2rem] group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/10 ${isFailed ? 'opacity-70 grayscale hover:grayscale-0' : ''}`}>

                  {/* Status Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isFailed ? 'from-red-500/20' : 'from-green-500/20'} to-transparent blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>

                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <Badge variant="outline" className={`px-3 py-1 text-[10px] tracking-widest font-bold uppercase
                                        ${isFailed ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'}
                                    `}>
                      {item.status === 'completed' ? 'COMPLETED' : item.status}
                    </Badge>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 font-mono">{item.ticketCode}</span>
                      <span className={`text-sm font-black ${isFailed ? 'text-gray-500 line-through' : 'text-white'}`}>
                        Rp {item.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#ffbe00] transition-colors">
                      {item.event?.title || item.eventTitle}
                    </h3>

                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-[#ca1f3d]" />
                        <span>{new Date(item.event?.date || item.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-[#ca1f3d]" />
                        <span>{item.event?.time || item.eventTime}</span>
                      </div>
                      {(item.event?.location) && (
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <MapPin className="w-4 h-4 text-[#ca1f3d]" />
                          <span className="truncate">{item.event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Stripe */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${isFailed ? 'bg-red-500/20' : 'bg-green-500/20'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
}
