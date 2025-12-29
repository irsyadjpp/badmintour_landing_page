'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft,
  MoreHorizontal, Pencil, QrCode, Ticket, CheckCircle2,
  DollarSign, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');

  useEffect(() => {
    const loadData = async () => {
      // Handle async params in Next.js 15
      const resolvedParams = await params;
      const id = resolvedParams?.id;

      if (!id) return;

      try {
        // 1. Fetch Event Details
        const eventRes = await fetch(`/api/events/${id}`);
        const eventData = await eventRes.json();

        if (eventData.success) {
          setEvent(eventData.data);
        }

        // 2. Fetch Participants
        const partRes = await fetch(`/api/events/${id}/participants`);
        const partData = await partRes.json();

        if (partData.success) {
          setParticipants(partData.data);
        }
      } catch (error) {
        console.error("Error loading data", error);
        toast({ title: "Error", description: "Gagal memuat data event", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params, toast]);

  if (loading) return <div className="p-10 text-center text-white">Loading details...</div>;
  if (!event) return <div className="p-10 text-center text-white">Event not found</div>;

  const isFull = (event.bookedSlot || 0) >= event.quota;

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header / Nav */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Event Detail</h1>
          <p className="text-gray-400 text-xs">Manage attendees and sessions.</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href={`/host/events/${event.id}/edit`}>
            <Button variant="outline" className="border-white/10 text-white bg-transparent hover:bg-white/10 gap-2">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </Link>
          <Button className="bg-[#ca1f3d] hover:bg-[#a01830] text-white gap-2">
            <QrCode className="w-4 h-4" /> Scan
          </Button>
        </div>
      </div>

      {/* Event Overview Card */}
      <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Ticket className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <Badge className="bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/20 mb-2">
              {event.type?.toUpperCase()}
            </Badge>
            <h2 className="text-4xl font-black text-white leading-none uppercase">{event.title}</h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-[#ffbe00]" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-[#ffbe00]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-[#ffbe00]" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="p-4 bg-black/30 rounded-2xl border border-white/5">
              <p className="text-xs text-gray-500 uppercase font-bold">Total Peserta</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{event.bookedSlot || 0}</span>
                <span className="text-gray-500 mb-1">/ {event.quota}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#00f2ea]"
                  style={{ width: `${Math.min(100, ((event.bookedSlot || 0) / event.quota) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-4 bg-black/30 rounded-2xl border border-white/5">
              <p className="text-xs text-gray-500 uppercase font-bold">Total Revenue</p>
              <p className="text-2xl font-black text-[#00f2ea]">
                Rp {((event.bookedSlot || 0) * event.price).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Participants Section */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#151515] p-1 rounded-xl mb-6">
            <TabsTrigger value="participants" className="data-[state=active]:bg-[#ca1f3d] data-[state=active]:text-white rounded-lg px-6">
              Daftar Peserta ({participants.length})
            </TabsTrigger>
            <TabsTrigger value="waiting" disabled className="data-[state=active]:bg-[#ca1f3d] data-[state=active]:text-white rounded-lg px-6">
              Waiting List (Coming Soon)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants">
            <Card className="bg-[#151515] border-white/5 rounded-[2rem] overflow-hidden">
              {participants.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {participants.map((p, i) => (
                    <div key={p.id || i} className="p-5 flex items-center gap-4 hover:bg-white/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white border border-white/10">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-lg">{p.name || "Guest User"}</p>
                          {p.id ? (
                            <Badge variant="secondary" className="text-[10px] h-5 bg-blue-500/10 text-blue-400 border-none">Member</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-5 border-white/20 text-gray-400">Guest</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Joined: {new Date(p.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> PAID
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                  <Users className="w-12 h-12 mb-4 opacity-50" />
                  <p>Belum ada peserta yang mendaftar.</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
