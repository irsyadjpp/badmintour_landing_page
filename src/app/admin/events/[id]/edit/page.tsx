'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Pencil, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/host/event-form';
import { useToast } from '@/hooks/use-toast';

export default function AdminEditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchEventDetail(params.id as string);
    }
  }, [params.id]);

  const fetchEventDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      if (data.success) {
        setEventData(data.data);
      } else {
        toast({ title: "Gagal", description: "Event tidak ditemukan.", variant: "destructive" });
        router.push('/admin/events');
      }
    } catch (error) {
      console.error("Error loading event", error);
      toast({ title: "Error", description: "Gagal memuat data event.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#ffbe00]" />
        <p>Mengambil data event...</p>
      </div>
    );
  }

  if (!eventData) return null;

  return (
    <div className="space-y-6 pb-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Pencil className="w-8 h-8 text-[#ffbe00]" /> ADMIN EDIT EVENT
          </h1>
          <p className="text-gray-400">Edit detail event sebagai Admin.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Batal
        </Button>
      </div>

      {/* Form with Initial Data */}
      <EventForm
        mode="edit"
        initialData={eventData}
        eventId={params.id as string}
        successRedirectUrl={`/admin/events/${params.id}`} // Redirect back to Admin Detail
      />
    </div>
  );
}
