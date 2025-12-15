import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-0 relative overflow-hidden mt-20">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-6xl md:text-8xl font-black leading-[0.9] mb-6">
              UDAH, JANGAN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                SCROLL TERUS.
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md">
              Mending angkat raket, kita bakar kalori bareng di lapangan. Gak jago? Tenang, yang penting gaya dulu.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-accent transition transform hover:-translate-y-1 flex items-center gap-2"
              >
                <span>Follow Instagram</span>
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-primary hover:text-primary transition"
              >
                Gabung Grup WA
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-bold text-accent mb-4 uppercase tracking-widest">
                Explore
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#services" className="hover:text-white transition">
                    Cari Lawan Sparring
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="hover:text-white transition">
                    Jadwal Mabar Minggu Ini
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">
                    Kelas Drilling Pemula
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Dokumentasi & Highlight
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-accent mb-4 uppercase tracking-widest">
                Community
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Aturan Main (Rules)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Jadi Member VIP
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Merchandise (Soon)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Kontak Admin
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 mt-4 pt-8 border-t border-white/10">
              <p className="text-gray-500">
                📍 <strong className="text-white">Bandung, Jawa Barat.</strong>
                <br />
                Home of Badmintour. Basecamp-nya anak badminton yang santai tapi kompetitif.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black py-4 border-t border-white/10 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto text-xs text-gray-500 font-mono">
          <p>&copy; {new Date().getFullYear()} BADMINTOUR. DIBUAT DENGAN 🏸 DAN ☕ DI BANDUNG.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-accent">
              PRIVACY
            </a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-accent">
              TERMS OF MABAR
            </a>
          </div>
        </div>
      </div>
      
       <div className="absolute bottom-0 left-0 right-0 h-32 opacity-5 pointer-events-none select-none flex items-end overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-[10rem] font-black leading-none text-white">
            BADMINTOUR BANDUNG • BADMINTOUR BANDUNG • BADMINTOUR BANDUNG •
        </div>
    </div>
    </footer>
  );
}
