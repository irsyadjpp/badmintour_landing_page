import { db } from "@/lib/firebase-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users, Zap, AlertCircle, ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getMabarEvents() {
  try {
    const snapshot = await db.collection('events')
      .where('type', '==', 'mabar')
      .get();

    let eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

    // Enrich with accurate booking counts (Excluding Hosts)
    const eventsWithParticipants = await Promise.all(eventsData.map(async (event) => {
      try {
        const bookingsSnap = await db.collection('bookings')
          .where('eventId', '==', event.id)
          .where('status', 'in', ['paid', 'confirmed', 'CONFIRMED', 'pending_payment', 'pending', 'approved'])
          .get();

        const validBookings = bookingsSnap.docs.map(doc => doc.data()).filter(b => {
          // Exclude Host by ID or Role
          const isHostId = b.userId === event.hostId;
          const isHostRole = (b.userRole === 'host' || b.role === 'host');
          return !isHostId && !isHostRole;
        });

        const avatars = validBookings.map(b => b.userImage || b.avatar || "").filter((url: string) => url.length > 0);
        const filled = validBookings.length;

        return {
          ...event,
          bookedSlot: filled,
          avatars: avatars
        };
      } catch (e) {
        console.error(`Error fetching bookings for event ${event.id}`, e);
        return event;
      }
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventsWithParticipants
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  } catch (error) {
    console.error("Failed to fetch mabar events", error);
    return [];
  }
}

export default async function MabarPage() {
  const events = await getMabarEvents();

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <Header />

      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hover:none">
        <div className="absolute -top-[20%] left-[20%] w-[60%] h-[60%] bg-[#ffbe00]/5 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-[#ca1f3d]/5 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      <main className="flex-1 relative z-10 pt-32 pb-24">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto">

          {/* CENTERED PAGE HEADER */}
          <div className="flex flex-col items-center text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex items-center gap-3 mb-8">
              <Link href="/">
                <Button variant="ghost" size="sm" className="h-9 rounded-full px-4 text-gray-500 hover:text-black hover:bg-gray-100 border border-gray-200 shadow-sm transition-all hover:pr-5">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
              </Link>
              <span className="h-4 w-px bg-gray-300 hidden md:block"></span>
              <Badge variant="outline" className="border-[#ffbe00] text-[#b48600] bg-[#ffbe00]/10 tracking-widest uppercase font-bold px-3 py-1">
                OFFICIAL SCHEDULE
              </Badge>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase mb-8 leading-[0.9] text-gray-900 stats-heading relative">
              MABAR
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] via-orange-500 to-red-600 block md:inline md:ml-6">
                RUTIN.
              </span>
            </h1>

            <p className="text-gray-500 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed mb-10">
              Jadwal main bareng mingguan. <span className="text-gray-900 font-bold decoration-[#ffbe00] underline underline-offset-4 decoration-4">Terbuka untuk semua level</span>. Amankan slotmu sekarang sebelum penuh!
            </p>

            {/* STATS BAR */}
            <div className="inline-flex items-center gap-8 md:gap-12 px-8 py-4 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900 leading-none">{events.length}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Upcoming</p>
              </div>
              <div className="w-px h-10 bg-gray-100"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900 leading-none">ALL</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#ffbe00] mt-1">Levels</p>
              </div>
              <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
              <div className="text-center hidden md:block">
                <p className="text-3xl font-black text-gray-900 leading-none">FUN</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Vibes</p>
              </div>
            </div>
          </div>

          {/* EVENTS GRID */}
          <div className="grid grid-cols-1 gap-10 max-w-6xl mx-auto">
            {events.length > 0 ? (
              events.map((event, index) => {
                const filled = event.bookedSlot || 0;
                const total = event.quota || 12;
                const percent = (filled / total) * 100;
                const isFull = filled >= total;

                return (
                  <div
                    key={event.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="group relative animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards duration-700"
                  >
                    {/* HOVER GLOW */}
                    <div className="absolute -inset-px bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-sm brightness-110" />

                    <div className="relative flex flex-col md:flex-row bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">

                      {/* LEFT: DATE & TYPE */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center p-6 md:p-10 bg-gray-50/80 md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-multiply"></div>

                        <div className="text-center z-10 flex flex-row md:flex-col items-baseline md:items-center gap-3 md:gap-0">
                          <p className="text-xs font-black tracking-[0.2em] text-gray-400 uppercase mb-1 hidden md:block">DATE</p>
                          <p className="text-5xl md:text-7xl font-black text-gray-900 leading-none tracking-tighter">
                            {new Date(event.date).getDate()}
                          </p>
                          <p className="text-sm md:text-base font-bold uppercase text-[#ffbe00] tracking-widest md:mt-2">
                            {new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}
                          </p>
                        </div>

                        <div className="hidden md:flex flex-col gap-2 mt-auto w-full">
                          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                            <Clock className="w-3.5 h-3.5" /> {event.time}
                          </div>
                        </div>
                      </div>

                      {/* MIDDLE: CONTENT */}
                      <div className="flex-1 p-6 md:p-10 flex flex-col relative z-10 bg-white">
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          <Badge className="bg-[#ffbe00] hover:bg-[#ffbe00] text-black text-[10px] font-extrabold uppercase tracking-widest border-0 px-3 py-1 shadow-md">
                            MABAR
                          </Badge>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                              HOST: {event.hostName || event.hostNickname || event.organizer || "ADMIN"}
                            </span>
                          </div>
                          <div className="md:hidden ml-auto flex items-center gap-1.5 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                            <Clock className="w-3 h-3" /> {event.time}
                          </div>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-6 group-hover:text-[#ffbe00] transition-colors pr-4">
                          {event.title}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                          <div className="flex items-center gap-4 group/item">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover/item:bg-[#ffbe00]/10 transition-colors flex items-center justify-center text-[#ffbe00]">
                              <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Location</p>
                              {event.locationMapLink ? (
                                <a href={event.locationMapLink} target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-bold text-gray-900 hover:text-[#ca1f3d] hover:underline transition-all line-clamp-1">
                                  {event.location}
                                </a>
                              ) : (
                                <p className="text-sm md:text-base font-bold text-gray-900 line-clamp-1">{event.location}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 group/item">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover/item:bg-[#00f2ea]/10 transition-colors flex items-center justify-center text-[#00f2ea]">
                              <Zap className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Level</p>
                              <p className="text-sm md:text-base font-bold text-gray-900 uppercase">{event.level || event.skillLevel || "OPEN FOR ALL"}</p>
                            </div>
                          </div>
                        </div>

                        {/* SOCIAL PROOF */}
                        <div className="mt-auto flex items-center gap-5 pt-6 border-t border-gray-100">
                          {event.avatars && event.avatars.length > 0 ? (
                            <div className="flex -space-x-3">
                              {event.avatars.slice(0, 5).map((img: string, idx: number) => (
                                <Avatar key={idx} className="w-9 h-9 border-2 border-white ring-1 ring-gray-100 shadow-sm transition-transform hover:scale-110 hover:z-10">
                                  <AvatarImage src={img} className="object-cover" />
                                  <AvatarFallback className="bg-gray-100 text-[10px] text-gray-500 font-bold">P{idx + 1}</AvatarFallback>
                                </Avatar>
                              ))}
                              {filled > 5 && (
                                <div className="w-9 h-9 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                                  +{filled - 5}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 text-gray-500">
                              <Users className="w-4 h-4" />
                              <span className="text-xs font-bold">Be the first to join!</span>
                            </div>
                          )}
                          {filled > 0 && (
                            <p className="text-xs font-semibold text-gray-500">
                              <span className="text-gray-900 font-black">{filled}</span> Ballers Joined
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT: CTA BLOCK */}
                      <div className="p-6 md:p-10 md:w-72 shrink-0 bg-gray-50/80 border-t md:border-t-0 md:border-l border-gray-100 flex flex-row md:flex-col justify-between items-center relative overflow-hidden backdrop-blur-sm">
                        {/* Background Gradient for CTA */}
                        {isFull ? (
                          <div className="absolute inset-0 bg-red-500/5 mix-blend-multiply" />
                        ) : (
                          <div className="absolute inset-0 bg-[#ffbe00]/5 mix-blend-multiply" />
                        )}

                        <div className="flex flex-col items-start md:items-center gap-1.5 z-10 w-full">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-full md:text-center">Status</p>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-1 md:hidden">
                            <div className={cn("h-full rounded-full", isFull ? "bg-red-500" : "bg-green-500")} style={{ width: `${percent}%` }} />
                          </div>

                          <div className="flex items-center gap-2 md:justify-center w-full">
                            <span className={cn("w-2 h-2 rounded-full hidden md:block", isFull ? "bg-red-500" : "bg-green-500 animate-pulse")} />
                            <span className={cn("text-xs font-bold uppercase", isFull ? "text-red-600" : "text-green-600")}>
                              {isFull ? "FULL BOOKED" : `${total - filled} SLOTS LEFT`}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end md:items-center z-10 my-0 md:my-auto">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 line-through decoration-red-500/50 mb-0.5">
                            {event.price > 0 ? 'Rp ' + (event.price * 1.2).toLocaleString('id-ID') : ''}
                          </p>
                          <p className="text-xl md:text-3xl font-black text-gray-900">
                            {event.price === 0 ? 'FREE' : `Rp ${event.price.toLocaleString('id-ID')}`}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block mt-1">/ PERSON</p>
                        </div>


                        <Link href={`/mabar/${event.id}`} className="w-full relative z-10 hidden md:block">
                          <Button className={cn(
                            "w-full h-14 rounded-2xl font-black uppercase tracking-[0.15em] shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-xs",
                            isFull
                              ? "bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-not-allowed border border-gray-300 shadow-none"
                              : "bg-[#ffbe00] text-black hover:bg-[#ffca28] shadow-[0_8px_25px_rgba(255,190,0,0.25)] hover:shadow-[0_12px_30px_rgba(255,190,0,0.35)]"
                          )}>
                            {isFull ? 'Waitlist' : 'Join Now'}
                          </Button>
                        </Link>

                        {/* Mobile Button Overlay */}
                        <Link href={`/mabar/${event.id}`} className="absolute inset-0 z-20 md:hidden" aria-label="View Event Details" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-200 rounded-[3rem] bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 animate-pulse group">
                  <CalendarDays className="w-10 h-10 text-gray-300 group-hover:text-[#ffbe00] transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Belum Ada Jadwal</h3>
                <p className="text-gray-500 font-medium max-w-sm text-center leading-relaxed">
                  Jadwal Mabar baru akan segera dirilis. <br /> Pantau terus halaman ini ya!
                </p>
              </div>
            )}
          </div>
        </div>
      </main >
      <Footer />
    </div >
  );
}
