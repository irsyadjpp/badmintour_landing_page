'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Upload, CheckCircle, Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export default function CoachRegistrationPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        specialty: '',
        experience: '',
        rate: '',
        bio: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/coach/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    certificateUrl: "https://mock-storage.com/cert.pdf" // Simulasi Upload
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast({ title: "Berhasil Dikirim", description: "Admin akan meninjau profil Anda.", className: "bg-green-600 text-white" });
                router.push('/member/dashboard');
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-20 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-white italic uppercase mb-2">
                    Become a <span className="text-[#00f2ea]">Coach</span>
                </h1>
                <p className="text-gray-400">Bagikan ilmu, latih komunitas, dan dapatkan penghasilan tambahan.</p>
            </div>

            <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ea]/10 rounded-full blur-[60px] pointer-events-none"></div>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    
                    {/* Specialty */}
                    <div className="space-y-2">
                        <Label className="text-white font-bold">Spesialisasi Melatih</Label>
                        <div className="relative">
                            <Award className="absolute left-3 top-3 w-5 h-5 text-[#00f2ea]" />
                            <Input 
                                placeholder="Contoh: Ganda Putra, Footwork, Smash" 
                                className="pl-10 bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#00f2ea]"
                                value={formData.specialty}
                                onChange={e => setFormData({...formData, specialty: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white font-bold">Pengalaman (Tahun)</Label>
                            <Input 
                                placeholder="ex: 5" 
                                type="number"
                                className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#00f2ea]"
                                value={formData.experience}
                                onChange={e => setFormData({...formData, experience: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white font-bold">Rate / Jam (Rp)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-green-500" />
                                <Input 
                                    placeholder="150000" 
                                    type="number"
                                    className="pl-9 bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#00f2ea]"
                                    value={formData.rate}
                                    onChange={e => setFormData({...formData, rate: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white font-bold">Bio Singkat & Prestasi</Label>
                        <Textarea 
                            placeholder="Ceritakan pengalaman melatih atau prestasi turnamen Anda..." 
                            className="bg-[#0a0a0a] border-white/10 text-white rounded-xl focus:border-[#00f2ea] min-h-[100px]"
                            value={formData.bio}
                            onChange={e => setFormData({...formData, bio: e.target.value})}
                        />
                    </div>

                    <div className="p-4 border border-dashed border-white/20 rounded-xl bg-white/5 text-center cursor-pointer hover:bg-white/10 transition">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-300">Upload Sertifikat Pelatih / Prestasi</p>
                        <p className="text-xs text-gray-500 mt-1">PDF/JPG (Max 2MB)</p>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-14 bg-[#00f2ea] hover:bg-[#00c2bb] text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(0,242,234,0.3)]">
                        {isLoading ? "SENDING..." : "KIRIM APLIKASI"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
