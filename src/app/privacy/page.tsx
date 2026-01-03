'use client';

import Link from 'next/link';
import {
    Shield,
    Lock,
    Eye,
    Server,
    UserCheck,
    Cookie,
    Mail,
    ChevronLeft,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ca1f3d] selection:text-white font-sans">

            {/* 1. HERO HEADER */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#ca1f3d]/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffbe00]/10 border border-[#ffbe00]/20 text-[#ffbe00] text-xs font-bold uppercase tracking-widest mb-6">
                        <Shield className="w-3 h-3" />
                        Trust & Safety
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]">Policy</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Kami menjaga privasi data Lo biar bisa mabar dengan tenang. Transparan, aman, dan nggak neko-neko.
                    </p>
                    <p className="mt-4 text-xs text-gray-500 font-mono">
                        Last Updated: 26 December 2025
                    </p>
                </div>
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT: TABLE OF CONTENTS (Sticky) */}
                <div className="hidden lg:block lg:col-span-4">
                    <div className="sticky top-24 space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">On This Page</p>
                        <TOCLink href="#data-collection" label="1. Data yang Kami Kumpulkan" active />
                        <TOCLink href="#data-usage" label="2. Cara Kami Pakai Data Lo" />
                        <TOCLink href="#data-sharing" label="3. Berbagi Data (Third Party)" />
                        <TOCLink href="#security" label="4. Keamanan & Enkripsi" />
                        <TOCLink href="#rights" label="5. Hak Kendali Lo" />
                        <TOCLink href="#contact" label="6. Kontak Kami" />

                        <div className="pt-8 px-4">
                            <Link href="/">
                                <Button className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-[#ffbe00] hover:text-black rounded-full h-12 px-6 gap-2 font-bold transition-all group uppercase tracking-widest">
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT: POLICY CONTENT */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Section 1 */}
                    <section id="data-collection" className="scroll-mt-24">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#ca1f3d]/10 flex items-center justify-center text-[#ca1f3d]">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">1. Data yang Kami Kumpulkan</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p className="mb-4">
                                Biar sistem matchmaking dan leaderboard jalan mulus, kami butuh beberapa data dari Lo saat mendaftar atau make aplikasi BadminTour:
                            </p>
                            <ul className="space-y-4 list-none pl-0">
                                <ListItem title="Identitas Dasar">
                                    Nama, Email, dan Foto Profil (biasanya dari Google Login). Kami juga generate PIN unik buat akses login alternatif.
                                </ListItem>
                                <ListItem title="Data Aktivitas">
                                    History mabar, statistik menang/kalah (buat level skill), dan klub yang Lo ikutin.
                                </ListItem>
                                <ListItem title="Kontak (Opsional)">
                                    Nomor WhatsApp, cuma dipake kalau Lo pesen Jersey atau ada update mendadak soal venue mabar.
                                </ListItem>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section id="data-usage" className="scroll-mt-24">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#ffbe00]/10 flex items-center justify-center text-[#ffbe00]">
                                <Server className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">2. Cara Kami Pakai Data</h2>
                        </div>
                        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                            <p className="text-gray-400 mb-6">
                                Data Lo nggak kami jual ke pinjol atau spammer. Kami cuma pake buat:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <UsageCard icon={UserCheck} title="Matchmaking" desc="Nyari lawan yang skill-nya seimbang sama Lo." />
                                <UsageCard icon={Shield} title="Verifikasi" desc="Mastiin yang booking lapangan itu manusia asli, bukan bot." />
                                <UsageCard icon={FileText} title="Leaderboard" desc="Nampilin ranking Lo di komunitas (bisa di-hide kok)." />
                                <UsageCard icon={Cookie} title="Personalisasi" desc="Rekomendasi event mabar di sekitar lokasi Lo." />
                            </div>
                        </Card>
                    </section>

                    {/* Section 3 */}
                    <section id="data-sharing" className="scroll-mt-24">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#ca1f3d]/10 flex items-center justify-center text-[#ca1f3d]">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">3. Keamanan Data</h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Kami pake standar enkripsi industri (SSL/TLS) buat ngirim data Lo. Database kami (Firestore) dilindungi Google Cloud Security yang ketat.
                            PIN Login Lo di-hash (diacak) jadi admin pun nggak bisa baca PIN aslinya.
                        </p>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-4 items-start">
                            <div className="mt-1 text-yellow-500"><Lock className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-yellow-500 text-sm uppercase mb-1">Penting</h4>
                                <p className="text-xs text-gray-400">
                                    Jangan pernah kasih PIN 6 digit Lo ke siapa pun, termasuk yang ngaku admin BadminTour. Admin resmi ngga pernah minta PIN/OTP.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section id="rights" className="scroll-mt-24">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#ffbe00]/10 flex items-center justify-center text-[#ffbe00]">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">4. Hak Kendali Lo</h2>
                        </div>
                        <p className="text-gray-400 mb-4">Lo punya kendali penuh atas akun Lo:</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-400 marker:text-[#ffbe00]">
                            <li><strong className="text-white">Akses & Edit:</strong> Bisa ganti foto, nickname, atau data diri kapan aja di menu Profile.</li>
                            <li><strong className="text-white">Hapus Akun:</strong> Kalau mau pensiun dini, Lo bisa request hapus akun permanen. Semua data history & rank bakal ilang selamanya.</li>
                            <li><strong className="text-white">Opt-out:</strong> Bisa matiin notifikasi email/WA kalau dirasa ganggu.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section id="contact" className="scroll-mt-24 pb-20">
                        <Card className="bg-gradient-to-br from-[#151515] to-[#1a1a1a] border-white/10 p-8 rounded-[2rem] text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Masih Bingung?</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                Kalau ada yang kurang jelas soal privasi atau ada unek-unek, DM aja langsung atau kirim email.
                            </p>
                            <Button className="h-12 px-8 rounded-full bg-white text-black font-bold hover:bg-gray-200">
                                support@badmintour.com
                            </Button>
                        </Card>
                    </section>

                </div>
            </div>

            {/* Footer Simple */}
            <footer className="border-t border-white/10 py-12 text-center">
                <p className="text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} BadminTour. All rights reserved.<br />
                    <span className="text-xs opacity-50">Dibuat dengan keringat dan shuttlecock.</span>
                </p>
            </footer>

        </div>
    );
}

// --- HELPER COMPONENTS ---

function TOCLink({ href, label, active = false }: { href: string, label: string, active?: boolean }) {
    return (
        <a
            href={href}
            className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${active
                ? 'bg-[#ca1f3d] text-white shadow-lg shadow-[#ca1f3d]/20 scale-105'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
        >
            {label}
        </a>
    )
}

function ListItem({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <li className="bg-[#151515] border border-white/5 p-4 rounded-xl flex gap-4 items-start">
            <div className="w-2 h-2 rounded-full bg-[#ffbe00] mt-2 shrink-0"></div>
            <div>
                <strong className="text-white block mb-1">{title}</strong>
                <span className="text-sm">{children}</span>
            </div>
        </li>
    )
}

function UsageCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
            <Icon className="w-5 h-5 text-gray-500 mb-3" />
            <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </div>
    )
}
