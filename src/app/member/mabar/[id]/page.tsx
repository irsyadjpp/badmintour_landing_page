
import { db } from "@/lib/firebase-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users, Zap, ArrowLeft, CalendarDays, CheckCircle2, Share2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import JoinEventButton from "@/components/member/join-event-button"; // We will create this client component

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getEventDetails(id: string) {
  try {
    const docRef = db.collection('events').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null; // Let caller handle not found
    }

    const event = { id: docSnap.id, ...docSnap.data() } as any;

    // Fetch Bookings
    const bookingsSnap = await db.collection('bookings')
      .where('eventId', '==', id)
      .where('status', 'in', ['paid', 'confirmed', 'CONFIRMED', 'pending_payment', 'pending', 'approved'])
      .get();

    const validBookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((b: any) => {
      const isHostId = b.userId === event.hostId;
      const isHostRole = (b.userRole === 'host' || b.role === 'host');
      return !isHostId && !isHostRole;
    });

    // Get Participants with Names
    const userIds = validBookings.map((b: any) => b.userId).filter(Boolean);
    const userMap: Record<string, any> = {};

    if (userIds.length > 0) {
      // Fetch fresh user data to ensure nickname/photo are up to date
      // Note: db.getAll supports multiple docs. 
      // If > 10 distinct users, safe to use getAll.
      const distinctUserIds = [...new Set(userIds)];
      const userRefs = distinctUserIds.map(uid => db.collection('users').doc(uid));

      if (userRefs.length > 0) {
        const userDocs = await db.getAll(...userRefs);
        userDocs.forEach(doc => {
          if (doc.exists) {
            userMap[doc.id] = doc.data();
          }
        });
      }
    }

    const participants = validBookings.map((b: any) => {
      const freshUser = userMap[b.userId];
      return {
        name: freshUser?.nickname || freshUser?.name || b.nickname || b.userNickname || (b.userName || b.name || "Unknown").split(' ')[0],
        avatar: freshUser?.image || freshUser?.photoURL || b.userImage || b.avatar || "",
        role: b.userRole || "member",
        userId: b.userId
      };
    });

    const filled = validBookings.length;

    return {
      ...event,
      bookedSlot: filled,
      participants: participants,
      currentUserBooking: null
    };

  } catch (error) {
    console.error("Failed to fetch event details", error);
    return null;
  }
}

export default async function MemberEventDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const event = await getEventDetails(params.id);

  if (!event) {
    notFound();
  }

  const filled = event.bookedSlot || 0;
  const total = event.quota || 12;
  const isFull = filled >= total;

  // Check if current user is joined
  const isJoined = event.participants.some((p: any) => p.userId === session?.user?.id);

  return (
    <div className="space-y-8 px-4 md:px-6 pb-20">

      {/* HEADER / BREADCRUMB */}
      <div className="flex items-center gap-4">
        <Link href="/member/dashboard">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-white/10 hover:bg-white/10 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Detail Event</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: INFO */}
        <div className="lg:col-span-2 space-y-6">

          {/* HERO CARD */}
          <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20 hover:bg-[#ffbe00]/20 px-3 py-1 text-xs font-black uppercase tracking-widest">
                  MABAR RUTIN
                </Badge>
                <span className="text-sm font-bold text-gray-400 px-3 py-1 border border-white/10 rounded-full">
                  {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                {event.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#ffbe00]">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DATE</p>
                    <p className="text-sm font-bold text-white">
                      {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#ffbe00]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TIME</p>
                    <p className="text-sm font-bold text-white">{event.time} WIB</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#ffbe00]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">LEVEL</p>
                    <p className="text-sm font-bold text-white uppercase">{event.level || "All Levels"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ca1f3d]/10 text-[#ca1f3d] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white mb-1">Lokasi Lapangan</h3>
                <p className="text-gray-400 font-medium mb-4">{event.location}</p>
                {event.locationMapLink && (
                  <a href={event.locationMapLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="h-9 text-xs font-bold rounded-xl border-white/10 hover:bg-white/5 text-gray-300 hover:text-white">
                      Buka di Google Maps
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* PARTICIPANTS */}
          <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ffbe00]" />
                Peserta <span className="text-gray-500 font-medium text-sm">({filled}/{total})</span>
              </h3>
            </div>

            {event.participants && event.participants.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {event.participants.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                    <Avatar className="w-10 h-10 border border-white/10">
                      <AvatarImage src={p.avatar} />
                      <AvatarFallback className="bg-[#ffbe00] text-black text-xs font-black">{p.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500 truncate capitalize">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-gray-500 font-medium text-sm">Belum ada peserta. Gas join pertama!</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ACTION */}
        <div className="relative z-20">
          <div className="sticky top-10 space-y-4">
            <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffbe00]/10 to-[#ca1f3d]/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

              <div className="relative z-10 text-center">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Biaya Main</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-white block">
                    {event.price === 0 ? 'FREE' : `Rp ${event.price.toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mt-1">/ Slot</span>
                </div>

                <JoinEventButton
                  eventId={event.id}
                  eventTitle={event.title}
                  eventPrice={event.price}
                  eventTime={event.time}
                  isFull={isFull}
                  isJoined={isJoined}
                />

                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500">Host</span>
                    <span className="font-bold text-white">{event.hostName || event.hostNickname || "Admin"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500">Sisa Slot</span>
                    <span className={cn("font-bold", isFull ? "text-red-500" : "text-green-500")}>
                      {total - filled}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
