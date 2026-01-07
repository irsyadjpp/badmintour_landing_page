import { db } from "@/lib/firebase-admin";
import ShareButton from "@/components/mabar/share-button";
import GuestBookingDialog from "@/components/mabar/guest-booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users, Zap, ArrowLeft, CalendarDays, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";

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

    // Fetch Bookings
    const bookingsSnap = await db.collection('bookings')
      .where('eventId', '==', id)
      .where('status', 'in', ['paid', 'confirmed', 'CONFIRMED', 'pending_payment', 'pending', 'approved'])
      .get();

    const validBookings = bookingsSnap.docs.map(doc => doc.data()).filter(b => {
      const isHostId = b.userId === event.hostId;
      const isHostRole = (b.userRole === 'host' || b.role === 'host');
      return !isHostId && !isHostRole;
    });

    // Get Participants with Names
    const participants = validBookings.map(b => ({
      name: b.nickname || b.userNickname || (b.userName || b.name || "Unknown").split(' ')[0],
      avatar: b.userImage || b.avatar || "",
      role: b.userRole || "member"
    }));

    const filled = validBookings.length;

    return {
      ...event,
      bookedSlot: filled,
      participants: participants
    };

  } catch (error) {
    console.error("Failed to fetch event details", error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEventDetails(params.id);

  if (!event) {
    notFound();
  }

  const filled = event.bookedSlot || 0;
  const total = event.quota || 12;
  const percent = (filled / total) * 100;
  const isFull = filled >= total;

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <Header />

      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hover:none z-0">
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] h-[60%] bg-[#ffbe00]/5 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <main className="flex-1 relative z-10 pt-32 pb-24">
        <div className="container px-4 md:px-8 max-w-6xl mx-auto">

          {/* BREADCRUMB / BACK */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href="/mabar">
              <Button variant="ghost" size="sm" className="h-9 rounded-full px-4 text-gray-500 hover:text-black hover:bg-gray-100 border border-gray-200 shadow-sm transition-all md:hover:pr-5">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Jadwal
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

            {/* LEFT COLUMN: HERO & INFO */}
            <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

              {/* HERO SECTION */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-[#ffbe00] text-black hover:bg-[#ffbe00] border-0 px-3 py-1 text-xs font-black uppercase tracking-widest shadow-sm">
                    MABAR RUTIN
                  </Badge>
                  <span className="text-sm font-bold text-gray-400 px-2 py-0.5 border border-gray-200 rounded-full">
                    {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                  {event.title}
                </h1>

                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 pb-8 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#ffbe00]">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DATE</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#ffbe00]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TIME</p>
                      <p className="text-sm font-bold text-gray-900">{event.time} WIB</p>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#ffbe00]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LEVEL</p>
                      <p className="text-sm font-bold text-gray-900 uppercase">{event.level || event.skillLevel || "All Levels"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#ca1f3d] shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-1">Lokasi Lapangan</h3>
                    <p className="text-gray-600 font-medium mb-3">{event.location}</p>
                    {event.locationMapLink && (
                      <a href={event.locationMapLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-full border-gray-300 hover:border-[#ca1f3d] hover:text-[#ca1f3d] transition-colors">
                          Lihat di Google Maps
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  Tentang Event
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {event.description || "Yuk join mabar rutin bareng komunitas BadminTour! Slot terbatas, siapa cepat dia dapat. Pastikan datang tepat waktu ya!"}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Include Shuttlecock
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Lapangan Premium
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Friendly Match
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Foto Dokumentasi
                  </div>
                </div>
              </div>

              {/* PARTICIPANTS */}
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between">
                  <span>Participants <span className="text-gray-400 font-medium text-sm ml-2">({filled}/{total})</span></span>
                  {filled > 0 && <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">CONFIRMED</span>}
                </h3>

                {event.participants && event.participants.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {event.participants.map((p: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                        <Avatar className="w-10 h-10 border border-gray-100">
                          <AvatarImage src={p.avatar} />
                          <AvatarFallback className="bg-gray-100 text-xs font-bold text-gray-400">{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-400 truncate capitalize">{p.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium text-sm">Belum ada peserta. Jadilah yang pertama!</p>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: STICKY CARD */}
            <div className="relative z-20">
              <div className="sticky top-32 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden relative">
                  {/* DECORATIVE BLUR */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffbe00]/20 to-[#ca1f3d]/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                  <div className="relative z-10">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Harga Tiket</p>
                    <div className="text-center mb-6">
                      <span className="text-4xl font-black text-gray-900 block">
                        {event.price === 0 ? 'FREE' : `Rp ${event.price.toLocaleString('id-ID')}`}
                      </span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mt-1">/ PER ORANG</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50">
                        <span className="font-bold text-gray-500">Host</span>
                        <span className="font-bold text-gray-900">{event.hostName || event.hostNickname || "Admin"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50">
                        <span className="font-bold text-gray-500">Sisa Slot</span>
                        <span className={cn("font-bold", isFull ? "text-red-500" : "text-green-500")}>
                          {total - filled} Seats
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50">
                        <span className="font-bold text-gray-500">Durasi</span>
                        <span className="font-bold text-gray-900">{event.duration || "2-3"} Jam</span>
                      </div>
                    </div>

                    <GuestBookingDialog
                      eventId={event.id}
                      eventTitle={event.title}
                      isFull={isFull}
                      price={event.price}
                      quota={total}
                      bookedSlot={filled}
                    />

                    <p className="text-[10px] text-gray-400 text-center mt-4 font-medium leading-relaxed">
                      *Pastikan saldo cukup atau siapkan pembayaran via QRIS. Pembatalan maks H-1.
                    </p>
                  </div>
                </div>

                {/* SHARE BUTTON COMPONENT */}
                <div className="mt-4 flex justify-center">
                  <ShareButton
                    title={`Mabar Badminton: ${event.title}`}
                    text={`Yuk join mabar tanggal ${new Date(event.date).toLocaleDateString()} jam ${event.time} di ${event.location}!`}
                    url={`/mabar/${event.id}`}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
