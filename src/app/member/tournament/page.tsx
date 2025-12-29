
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, MapPin, Calendar, Clock, Trophy, ExternalLink, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function TournamentEventContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Detail Event
  useEffect(() => {
    if (!eventId) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.data) {
          const found = data.data.find((e: any) => e.id === eventId);
          setEvent(found);
        }
      } catch (error) {
        console.error("Failed to fetch event detail");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [eventId]);

  const handleExternalLink = () => {
    if (event?.externalLink) {
      window.open(event.externalLink, '_blank');
    } else {
      alert("Link pendaftaran belum tersedia.");
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center text-white"><Loader2 className="animate-spin mx-auto w-8 h-8" /> Memuat Data...</div>;
  if (!event) return <div className="min-h-screen pt-24 text-center text-white">Event tidak ditemukan.</div>;

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 max-w-lg mx-auto">
      <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem] space-y-6 relative overflow-hidden">
        {/* Visual Header Ungu untuk Tournament */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-purple-600"></div>

        <div className="text-center">
          <Badge variant="outline" className="mb-2 text-purple-400 border-purple-500/30 bg-purple-500/10">
            EXTERNAL TOURNAMENT
          </Badge>
          <h1 className="text-2xl font-black text-white leading-tight">{event.title}</h1>

          {/* Harga / Biaya Pendaftaran */}
          <p className="font-bold mt-2 text-lg text-purple-400">
            Biaya: Rp {event.price.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center gap-4 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-purple-400 font-bold uppercase">Diselenggarakan Oleh</p>
            <p className="font-bold text-white text-lg">{event.organizer || "Panitia Pelaksana"}</p>
          </div>
        </div>

        <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Clock className="w-5 h-5 text-purple-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-5 h-5 text-purple-500" />
            <span>{event.location}</span>
          </div>
          {event.description && (
            <div className="text-sm text-gray-400 pt-4 border-t border-white/10">
              {event.description}
            </div>
          )}
        </div>

        {/* Tombol ke Link Eksternal */}
        <Button
          onClick={handleExternalLink}
          className="w-full h-14 font-black text-xl rounded-xl shadow-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          <Globe className="mr-2 w-5 h-5" /> DAFTAR SEKARANG
        </Button>

        <p className="text-center text-[10px] text-gray-500">
          Anda akan diarahkan ke halaman pendaftaran eksternal.
        </p>
      </Card>
    </div>
  );
}

export default function TournamentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TournamentEventContent />
    </Suspense>
  );
}
