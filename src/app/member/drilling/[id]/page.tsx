
import { db } from "@/lib/firebase-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users, Zap, ArrowLeft, CalendarDays, CheckCircle2, Dumbbell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import JoinEventButton from "@/components/member/join-event-button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getEventDetails(id: string) {
  try {
    const docRef = db.collection('events').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const event = { id: docSnap.id, ...docSnap.data() } as any;

    const bookingsSnap = await db.collection('bookings')
      .where('eventId', '==', id)
      .where('status', 'in', ['paid', 'confirmed', 'CONFIRMED', 'pending_payment', 'pending', 'approved'])
      .get();

    const validBookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((b: any) => {
      const isHostId = b.userId === event.hostId;
      return !isHostId;
    });

    const userIds = validBookings.map(doc => doc.userId).filter(Boolean);
    const userMap: Record<string, any> = {};

    if (userIds.length > 0) {
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
    };

  } catch (error) {
    console.error("Failed to fetch event details", error);
    return null;
  }
}

export default async function MemberDrillingDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const event = await getEventDetails(params.id);

  if (!event) {
    notFound();
  }

  const filled = event.bookedSlot || 0;
  const total = event.quota || 8; // Typically fewer slots for drilling
  const isFull = filled >= total;

  const isJoined = event.participants.some((p: any) => p.userId === session?.user?.id);

  return (
    <div className="space-y-8 px-4 md:px-6 pb-20">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/member/drilling">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-white/10 hover:bg-white/10 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Detail Drilling</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: INFO */}
        <div className="lg:col-span-2 space-y-6">

          {/* HERO CARD */}
          <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest">
                  INTENSIVE DRILLING
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
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-green-500">
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
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-green-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TIME</p>
                    <p className="text-sm font-bold text-white">{event.time} WIB</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-green-500">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">COACH</p>
                    <p className="text-sm font-bold text-white uppercase">{event.coachName || event.coachNickname || event.hostName || "HEAD COACH"}</p>
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
                <h3 className="text-lg font-black text-white mb-1">Lokasi Latihan</h3>
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

          {/* CURRICULUM DESCRIPTION (If Available) */}
          {event.description && (
            <div className="bg-[#151515] border border-white/5 rounded-[2rem] p-6 md:p-8">
              <h3 className="text-lg font-black text-white mb-4">Program Latihan</h3>
              <div className="prose prose-invert prose-sm text-gray-400">
                {event.description}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ACTION */}
        <div className="relative z-20">
          <div className="sticky top-10 space-y-4">
            <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

              <div className="relative z-10 text-center">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Biaya Latihan</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-white block">
                    {event.price === 0 ? 'FREE' : `Rp ${event.price.toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mt-1">/ Sesi</span>
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
                    <span className="font-bold text-gray-500">Coach</span>
                    <span className="font-bold text-white uppercase">{event.coachName || "Coach"}</span>
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
