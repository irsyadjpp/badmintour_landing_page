'use client';

import Link from 'next/link';
import { 
    Gavel, 
    UserX, 
    CreditCard, 
    AlertTriangle, 
    ShieldAlert, 
    Users, 
    ChevronLeft,
    ScrollText,
    Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ca1f3d] selection:text-white font-sans">
            
            {/* 1. HERO HEADER */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/5">
                {/* Background Ambience */}
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#ca1f3d]/10 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffbe00]/10 border border-[#ffbe00]/20 text-[#ffbe00] text-xs font-black uppercase tracking-widest mb-6">
                        <Gavel className="w-3 h-3" />
                        Rules of The Game
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        TERMS OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]">SERVICE</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Baca aturan mainnya dulu sebelum turun ke lapangan. Fair play is a must, no drama allowed.
                    </p>
                    <p className="mt-4 text-xs text-gray-500 font-mono">
                        Effective Date: 1 January 2026
                    </p>
                </div>
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LEFT: TABLE OF CONTENTS (Sticky) */}
                <div className="hidden lg:block lg:col-span-4">
                    <div className="sticky top-28 space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">Game Rules</p>
                        <TOCLink href="#account" label="1. Akun & Identitas" active />
                        <TOCLink href="#community" label="2. Kode Etik Komunitas" />
                        <TOCLink href="#booking" label="3. Booking & Pembayaran" />
                        <TOCLink href="#cancellation" label="4. Ghosting & Cancel" />
                        <TOCLink href="#liability" label="5. Risiko Cedera (Penting)" />
                        <TOCLink href="#termination" label="6. Banned Policy" />
                        
                        <div className="pt-8 px-4">
                            <Link href="/">
                                {/* UPDATE: High Contrast Yellow Theme Button */}
                                <Button className="w-full bg-transparent border-2 border-[#ffbe00] text-[#ffbe00] hover:bg-[#ffbe00] hover:text-black rounded-xl gap-2 font-black h-12 transition-all uppercase tracking-wide">
                                    <ChevronLeft className="w-5 h-5"/> Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TERMS CONTENT */}
                <div className="lg:col-span-8 space-y-16">
                    
                    {/* 1. Account */}
                    <section id="account" className="scroll-mt-32">
                        <SectionHeader number="01" title="Akun & Identitas" icon={Users} />
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p className="mb-4">
                                BadminTour adalah tempat buat manusia asli, bukan bot atau akun smurf.
                            </p>
                            <ul className="grid gap-4 list-none pl-0">
                                <RuleCard 
                                    title="Real Name Policy" 
                                    desc="Gunakan nama asli atau nickname yang dikenal. Jangan menyamar jadi atlet Pelatnas kalau skill masih 'tepok bulu'." 
                                />
                                <RuleCard 
                                    title="One Person, One Account" 
                                    desc="Dilarang keras bikin multiple account buat manipulasi sistem ranking/level." 
                                />
                                <RuleCard 
                                    title="Security" 
                                    desc="Lo bertanggung jawab penuh atas PIN login Lo. Jangan kasih tau siapapun." 
                                />
                            </ul>
                        </div>
                    </section>

                    {/* 2. Community Code */}
                    <section id="community" className="scroll-mt-32">
                        <SectionHeader number="02" title="Kode Etik Komunitas" icon={Flag} />
                        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                            <p className="text-gray-400 mb-6">
                                Kita di sini buat have fun dan cari keringat, bukan cari musuh.
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 mt-1">✓</div>
                                    <div>
                                        <h4 className="text-white font-bold">Respect Skill Level</h4>
                                        <p className="text-sm text-gray-500">Jangan bully newbie. Kalau Lo Pro, ajarin yang Rookie. Kalau Lo Rookie, hormat sama suhu.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 mt-1">✕</div>
                                    <div>
                                        <h4 className="text-white font-bold">No Toxicity</h4>
                                        <p className="text-sm text-gray-500">Trash talk di lapangan wajar, tapi rasisme, pelecehan, atau kekerasan fisik = <span className="text-[#ca1f3d] font-bold">INSTANT BAN.</span></p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* 3. Booking & Payment */}
                    <section id="booking" className="scroll-mt-32">
                        <SectionHeader number="03" title="Booking & Pembayaran" icon={CreditCard} />
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p>
                                Sistem kami menggunakan <strong>Pre-paid Booking</strong> untuk Mabar dan Drilling.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-[#ffbe00]">
                                <li>Pembayaran wajib lunas via QRIS/E-Wallet sebelum slot dikonfirmasi.</li>
                                <li>Harga yang tertera sudah termasuk biaya sewa lapangan, kok (shuttlecock), dan fee Host.</li>
                                <li>Biaya admin aplikasi (Platform Fee) tidak dapat dikembalikan (non-refundable).</li>
                            </ul>
                        </div>
                    </section>

                    {/* 4. Cancellation */}
                    <section id="cancellation" className="scroll-mt-32">
                        <SectionHeader number="04" title="Ghosting & Cancel" icon={UserX} />
                        <Card className="bg-gradient-to-br from-[#151515] to-[#1a1a1a] border-[#ca1f3d]/20 p-6 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-[#ca1f3d]" />
                                <h3 className="text-lg font-bold text-white">Cancellation Policy</h3>
                            </div>
                            <div className="space-y-4 text-sm text-gray-400">
                                <p>
                                    <strong className="text-white block mb-1">H-24 Jam (Safe Zone)</strong>
                                    Cancel sebelum 24 jam acara, dana dikembalikan 100% (minus fee admin) ke saldo Wallet.
                                </p>
                                <p>
                                    <strong className="text-white block mb-1">Last Minute (Danger Zone)</strong>
                                    Cancel dadakan (kurang dari 24 jam) atau <strong>No Show (Ghosting)</strong> tanpa kabar = Hangus. Dana akan diberikan ke Host sebagai kompensasi slot kosong.
                                </p>
                            </div>
                        </Card>
                    </section>

                    {/* 5. Liability */}
                    <section id="liability" className="scroll-mt-32">
                        <SectionHeader number="05" title="Risiko Cedera" icon={ShieldAlert} />
                        <div className="bg-[#ffbe00]/5 border border-[#ffbe00]/20 p-6 rounded-[2rem]">
                            <h4 className="text-[#ffbe00] font-bold text-lg mb-2 uppercase flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Disclaimer Penting
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Badminton adalah olahraga fisik intensitas tinggi. Dengan bergabung di event BadminTour, Lo menyadari risiko cedera (terkilir, otot ketarik, dll) adalah tanggung jawab pribadi.
                                <br/><br/>
                                BadminTour maupun Host <strong>tidak bertanggung jawab</strong> atas cedera fisik, kehilangan barang berharga di GOR, atau kerusakan raket akibat benturan saat bermain (clash).
                            </p>
                        </div>
                    </section>

                    {/* 6. Termination */}
                    <section id="termination" className="scroll-mt-32 pb-20">
                        <SectionHeader number="06" title="Red Card (Banned)" icon={Gavel} />
                        <p className="text-gray-400 mb-6">
                            Kami berhak membekukan atau menghapus akun Lo secara permanen jika:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BanCard text="Melakukan penipuan pembayaran." />
                            <BanCard text="Terlibat perkelahian fisik di GOR." />
                            <BanCard text="Melakukan pelecehan (Verbal/Fisik)." />
                            <BanCard text="Spamming atau promosi judi online." />
                        </div>
                    </section>

                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 text-center bg-[#050505]">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <ScrollText className="w-5 h-5 text-[#ca1f3d]" />
                    <span className="font-bold text-white">BadminTour Legal</span>
                </div>
                <p className="text-gray-600 text-sm">
                    Play Fair. Respect Others. Smash Hard.<br/>
                    &copy; 2026 BadminTour.
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
            className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                active 
                ? 'bg-[#ca1f3d] text-white shadow-lg shadow-[#ca1f3d]/20 scale-105' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
        >
            {label}
        </a>
    )
}

function SectionHeader({ number, title, icon: Icon }: any) {
    return (
        <div className="flex items-end gap-4 mb-6 border-b border-white/10 pb-4">
            <span className="text-5xl font-black text-white/5">{number}</span>
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-white/5 rounded-lg text-[#ffbe00]">
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">{title}</h2>
            </div>
        </div>
    )
}

function RuleCard({ title, desc }: { title: string, desc: string }) {
    return (
        <li className="bg-[#151515] border border-white/5 p-5 rounded-2xl hover:border-[#ffbe00]/30 transition-colors">
            <strong className="text-white block mb-2 text-lg font-bold">{title}</strong>
            <span className="text-sm text-gray-400 leading-relaxed">{desc}</span>
        </li>
    )
}

function BanCard({ text }: { text: string }) {
    return (
        <div className="bg-[#ca1f3d]/10 border border-[#ca1f3d]/20 p-4 rounded-xl flex items-center gap-3 text-sm text-gray-300">
            <div className="w-2 h-2 bg-[#ca1f3d] rounded-full shrink-0"></div>
            {text}
        </div>
    )
}
