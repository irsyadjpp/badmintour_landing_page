'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function MemberDashboard() {
  return (
    <div className="bg-gray-50 text-bad-dark min-h-screen pb-20">
      <header className="bg-bad-dark text-white pt-8 pb-6 px-6 rounded-b-[2rem] shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Welcome Back,
            </p>
            <h1 className="text-3xl font-black">KEVIN.S</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-bad-yellow border-2 border-white overflow-hidden">
            <Image
              src="https://ui-avatars.com/api/?name=Kevin+S&background=FFEB3B&color=000"
              alt="Profile"
              width={48}
              height={48}
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-between border border-white/10">
          <div className="text-center">
            <span className="block text-xl font-black text-accent">12</span>
            <span className="text-[10px] text-gray-300 uppercase">
              Matches
            </span>
          </div>
          <div className="text-center border-x border-white/10 px-6">
            <span className="block text-xl font-black text-white">60%</span>
            <span className="text-[10px] text-gray-300 uppercase">
              Win Rate
            </span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-black text-white">B</span>
            <span className="text-[10px] text-gray-300 uppercase">Level</span>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-4 relative z-10">
        <h2 className="text-gray-900 font-bold text-lg mb-4 ml-2">
          Menu Utama
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/member/jersey"
            className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition group border border-gray-100"
          >
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-xl">
              👕
            </div>
            <h3 className="font-bold text-gray-900 leading-tight">
              Claim Jersey
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Limited Drop Season 1
            </p>
          </Link>

          <Link
            href="/#schedule"
            className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition group border border-gray-100"
          >
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-xl">
              📅
            </div>
            <h3 className="font-bold text-gray-900 leading-tight">
              Jadwal Mabar
            </h3>
            <p className="text-xs text-gray-500 mt-1">Cek slot kosong</p>
          </Link>

          <Link
            href="#"
            className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition group border border-gray-100"
          >
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-xl">
              📊
            </div>
            <h3 className="font-bold text-gray-900 leading-tight">Riwayat</h3>
            <p className="text-xs text-gray-500 mt-1">Statistik permainan</p>
          </Link>

          <Link
            href="#"
            className="bg-accent p-5 rounded-3xl shadow-sm hover:shadow-md transition group border border-yellow-400 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-black/5 rounded-full -mr-8 -mt-8"></div>
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition text-xl">
              🆔
            </div>
            <h3 className="font-bold text-black leading-tight">Member ID</h3>
            <p className="text-xs text-black/70 mt-1">Show QR Code</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-400 text-sm font-bold hover:text-primary"
          >
            Keluar Aplikasi
          </Link>
        </div>
      </main>
    </div>
  );
}
