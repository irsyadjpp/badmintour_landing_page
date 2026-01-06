import { db } from "@/lib/firebase-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Star, Zap, ArrowUpRight, Trophy, Target, Medal, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface PlayerStats {
  id: string; // This will temporarily hold normalized phone, then replaced by userId if available
  name: string;
  nickname: string;
  avatar: string;
  role: string;
  totalBookings: number;
  drillingCount: number;
  mabarCount: number;
  totalSpend: number;
  points: number; // Custom metric for "Loyalty Points"
}

// --- HELPER: Normalize Phone Number ---
function normalizePhone(phone: string): string {
  if (!phone) return "";
  let p = phone.replace(/\D/g, ''); // Remove non-digits
  if (p.startsWith('0')) {
    p = '62' + p.substring(1);
  }
  if (p.startsWith('8')) {
    p = '62' + p;
  }
  return p;
}

// --- DATA FETCHING ---
async function getHallOfFameData() {
  try {
    // 1. Fetch recent transactions/bookings
    const bookingsSnap = await db.collection('bookings')
      .where('status', 'in', ['paid', 'confirmed', 'CONFIRMED', 'approved'])
      .orderBy('bookedAt', 'desc')
      .limit(1000)
      .get();

    const statsMap = new Map<string, PlayerStats>();
    const phoneToUserIdMap = new Map<string, string>(); // Keep track of registered Users for a phone

    // 2. Aggregate Data by Phone Number
    bookingsSnap.docs.forEach(doc => {
      const data = doc.data();
      const rawPhone = data.phoneNumber || data.userPhone || "";

      // Skip if no phone (can't track)
      if (!rawPhone) return;

      const normalizedPhone = normalizePhone(rawPhone);
      // Valid phone check (basic length)
      if (!normalizedPhone || normalizedPhone.length < 5) return;

      // Link Phone to UserID if available (prioritize registered accounts)
      if (data.userId && data.userId !== 'guest' && !phoneToUserIdMap.has(normalizedPhone)) {
        phoneToUserIdMap.set(normalizedPhone, data.userId);
      }

      if (!statsMap.has(normalizedPhone)) {
        statsMap.set(normalizedPhone, {
          id: normalizedPhone, // Temporary ID is phone
          name: data.userName || "Guest",
          nickname: "",
          avatar: "", // Will fetch later
          role: "guest",
          totalBookings: 0,
          drillingCount: 0,
          mabarCount: 0,
          totalSpend: 0,
          points: 0
        });
      }

      const player = statsMap.get(normalizedPhone)!;
      player.totalBookings += 1;

      // Update name to latest used name if it's currently generic
      if (data.userName && (player.name === "Guest" || player.name === "Member")) {
        player.name = data.userName;
      }

      // Estimate Spend
      const price = typeof data.totalPrice === 'number' ? data.totalPrice : 0;
      player.totalSpend += price;

      // Classify Type
      const isDrilling = (data.eventTitle && data.eventTitle.toLowerCase().includes('drilling')) || (data.type === 'drilling');
      if (isDrilling) {
        player.drillingCount += 1;
      } else {
        player.mabarCount += 1;
      }

      // Calculate Points: 100 pts per booking + 1 pt per 1000 IDR spend
      player.points = (player.totalBookings * 100) + Math.floor(player.totalSpend / 10000);
    });

    // 3. Fetch User Details for Top Players
    // Convert to array and sort
    let players = Array.from(statsMap.values()).sort((a, b) => b.points - a.points);
    const topPlayers = players.slice(0, 50);

    // Enrich with Registered User Data if linked
    await Promise.all(topPlayers.map(async (p) => {
      const linkedUserId = phoneToUserIdMap.get(p.id); // p.id is phone here

      if (linkedUserId) {
        try {
          const userDoc = await db.collection('users').doc(linkedUserId).get();
          if (userDoc.exists) {
            const uData = userDoc.data() as any;
            p.id = linkedUserId; // Restore real User ID
            p.name = uData.name || p.name;
            p.nickname = uData.nickname || uData.username || p.name.split(' ')[0];
            p.avatar = uData.image || uData.photoURL || uData.avatar || "";
            p.role = uData.role || "member";
          }
        } catch (e) {
          // ignore error
        }
      } else {
        // It's a Guest / Manual Booking
        // Use default avatar or initials
        p.role = "community";
        p.nickname = p.name.split(' ')[0].substring(0, 10);
        // Ensure ID is masked/hashed safely if client sees it (or just use phone with guest prefix)
        // We will just leave it as phone for unique key, but not display it
        // Or better, mask it:
        p.id = "guest_" + p.id.substring(Math.max(0, p.id.length - 4));
      }
    }));

    return topPlayers;

  } catch (error) {
    console.error("Failed to fetch Hall of Fame data", error);
    return [];
  }
}

export default async function HallOfFamePage() {
  const players = await getHallOfFameData();

  // DERIVE CATEGORIES
  const topRanked = [...players].sort((a, b) => b.points - a.points);
  const mostActive = [...players].sort((a, b) => b.totalBookings - a.totalBookings);
  const drillingKings = [...players].sort((a, b) => b.drillingCount - a.drillingCount);

  const mvp = topRanked[0];
  const runnerUp = topRanked[1]; // Using Runner up as Rising Star placeholder or just 2nd place

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#ffbe00] selection:text-black">
      <Header />

      <main className="pt-28 pb-20">

        {/* --- HERO SECTION --- */}
        <section className="relative px-4 mb-24 mt-8 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[400px] bg-[#ca1f3d]/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 container mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <Crown className="w-5 h-5 text-[#ffbe00] fill-[#ffbe00]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Community Legends</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-6 leading-[0.85] text-slate-900">
              HALL OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ca1f3d] to-orange-500">FAME</span>
            </h1>

            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Apreasiasi untuk member paling loyal, paling rajin, dan paling berdedikasi di Badmintour.
              <br /><span className="text-slate-900 font-bold">Points = (Bookings × 100) + (Spend / 10k)</span>
            </p>
          </div>
        </section>

        {mvp && (
          <section className="container mx-auto px-4 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* MVP CARD */}
              <div className="relative group perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ca1f3d] to-[#ffbe00] rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative bg-[#111] rounded-[3rem] p-10 md:p-14 text-white overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Crown className="w-64 h-64 text-white rotate-12" />
                  </div>

                  <Badge className="bg-[#ffbe00] text-black hover:bg-[#ffbe00] border-0 mb-6 px-4 py-2 text-xs font-black uppercase tracking-widest">
                    Season Leader
                  </Badge>

                  <div className="relative z-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#ffbe00] mb-8 relative">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={mvp.avatar} className="object-cover" />
                        <AvatarFallback className="bg-slate-800 text-3xl font-bold">{mvp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-3 -right-3 bg-[#ca1f3d] text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-[#111]">1</div>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-2 leading-none">{mvp.nickname || mvp.name.split(' ')[0]}</h2>
                    <p className="text-gray-400 font-bold text-xl mb-8">{mvp.name}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Points</p>
                        <p className="text-2xl font-black text-[#ffbe00]">{mvp.points}</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Bookings</p>
                        <p className="text-2xl font-black text-white">{mvp.totalBookings}</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Drilling</p>
                        <p className="text-2xl font-black text-white">{mvp.drillingCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RUNNER UP / STATS */}
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex items-center gap-6 group hover:-translate-y-1 transition-transform">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex-shrink-0 relative">
                    {runnerUp?.avatar ? (
                      <Avatar className="w-full h-full">
                        <AvatarImage src={runnerUp.avatar} />
                        <AvatarFallback>{runnerUp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-slate-300">2</div>
                    )}
                    <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">#2</div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Runner Up</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none mb-1">{runnerUp?.name || "No Runner Up"}</h3>
                    <p className="text-sm font-bold text-[#ca1f3d]">{runnerUp?.points || 0} Points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100">
                    <ShoppingBag className="w-8 h-8 text-blue-500 mb-4" />
                    <p className="text-3xl font-black text-slate-900 mb-1">{mostActive[0]?.name.split(' ')[0]}</p>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Most Orders</p>
                  </div>
                  <div className="bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100">
                    <Target className="w-8 h-8 text-orange-500 mb-4" />
                    <p className="text-3xl font-black text-slate-900 mb-1">{drillingKings[0]?.name.split(' ')[0]}</p>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Drilling King</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- LEADERBOARD TABS & LIST --- */}
        <section className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="p-8 pb-0">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-[#ffbe00] fill-current" />
                Global Leaderboard
              </h3>
            </div>

            {/* SCROLLABLE LIST */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest w-24">Rank</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Player</th>
                    <th className="px-8 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Mabar</th>
                    <th className="px-8 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Drilling</th>
                    <th className="px-8 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topRanked.slice(0, 20).map((player, idx) => (
                    <tr key={player.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        {idx < 3 ? (
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm",
                            idx === 0 ? "bg-[#ffbe00]" : idx === 1 ? "bg-slate-400" : "bg-orange-400"
                          )}>
                            {idx + 1}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-bold ml-2">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10 border border-slate-100">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-[#ca1f3d] transition-colors">{player.name}</p>
                            <p className="text-xs text-slate-400 font-medium capitalize">{player.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center hidden md:table-cell">
                        <span className="font-bold text-slate-600">{player.mabarCount}</span>
                      </td>
                      <td className="px-8 py-5 text-center hidden md:table-cell">
                        <span className="font-bold text-slate-600">{player.drillingCount}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="font-black text-slate-900 text-lg">{player.points.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {topRanked.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-medium">
                Belum ada data member yang aktif.
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
