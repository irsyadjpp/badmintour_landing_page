'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Trophy, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface Coach {
  id: string;
  name: string;
  nickname: string;
  image: string;
  location: string;
  rating: string;
  reviewCount: number;
  specialization: string[];
  experienceYears: string;
  price: number;
}

export default function PrivateCoachPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('/api/coaches');
        const data = await res.json();
        if (data.success) {
          setCoaches(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch coaches", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <Header />

      {/* BACKGROUND ACCENTS (Red/Yellow Focused) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hover:none">
        <div className="absolute -top-[20%] right-[10%] w-[60%] h-[60%] bg-[#ca1f3d]/5 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[30%] left-[10%] w-[40%] h-[40%] bg-[#ffbe00]/5 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      <main className="flex-1 relative z-10 pt-32 pb-24">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto">

          {/* CENTERED PAGE HEADER */}
          <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="outline" className="mb-6 border-[#ca1f3d] text-[#ca1f3d] bg-[#ca1f3d]/10 tracking-widest uppercase font-bold px-4 py-1.5">
              ELITE COACHING
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9] text-gray-900 stats-heading">
              FIND YOUR <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00] block md:inline md:ml-4">
                MENTOR.
              </span>
            </h1>

            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Belajar langsung dari yang terbaik. Pilih coach sesuai gaya mainmu dan raih potensi maksimalmu.
            </p>
          </div>

          {/* COACHES GRID */}
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-gray-300" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {coaches.map((coach, index) => (
                <div
                  key={coach.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="group relative animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards duration-700"
                >
                  {/* Hover Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#ca1f3d] to-[#ffbe00] rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-sm brightness-110" />

                  <div className="relative flex flex-col h-full bg-white border border-gray-100 rounded-[2rem] overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 shadow-lg hover:shadow-xl">

                    {/* Top Image Section */}
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      {coach.image ? (
                        <img src={coach.image} alt={coach.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                          <div className="text-6xl font-black opacity-20">{coach.name.charAt(0)}</div>
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                          <h3 className="text-white text-xl font-black uppercase tracking-tight leading-tight shadow-black drop-shadow-md">
                            {coach.nickname || coach.name.split(' ')[0]}
                          </h3>
                          <div className="flex items-center gap-1 text-white/90 text-xs font-bold mt-1">
                            <MapPin className="w-3 h-3" /> {coach.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-[#ffbe00] text-black px-2 py-1 rounded-lg text-xs font-black shadow-lg">
                          <Star className="w-3 h-3 fill-black" /> {coach.rating}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {coach.specialization && coach.specialization.slice(0, 2).map((spec, i) => (
                          <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-600 font-bold border-0 text-[10px] uppercase tracking-wider">
                            {spec}
                          </Badge>
                        ))}
                        {coach.experienceYears && (
                          <Badge variant="outline" className="border-gray-200 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                            {coach.experienceYears}+ Yrs Exp
                          </Badge>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Starting from</p>
                          <p className="text-lg font-black text-gray-900">
                            {coach.price ? `Rp ${coach.price.toLocaleString('id-ID')}` : 'Ask Price'}
                          </p>
                        </div>
                        <Link href={`/profile/${coach.id}`}>
                          <Button size="icon" className="w-10 h-10 rounded-full bg-black text-white hover:bg-[#ffbe00] hover:text-black transition-colors shadow-lg">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
