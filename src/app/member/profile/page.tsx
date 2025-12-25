
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { 
    User, 
    Phone, 
    MapPin, 
    Save, 
    Shirt, 
    Trophy,
    Loader2,
    Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
// Pastikan path ini benar sesuai struktur folder Anda
// import { db } from '@/lib/firebase-admin'; // CATATAN: Client component tidak boleh import firebase-admin langsung. 
// Kita harus menggunakan Server Action atau API Route. 
// Untuk contoh ini, saya akan simulasi fetch/save.

type ProfileFormValues = {
    fullName: string;
    phoneNumber: string;
    domicile: string;
    jerseySize: string;
    skillLevel: string;
};

export default function MemberProfilePage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, handleSubmit, setValue, watch } = useForm<ProfileFormValues>({
        defaultValues: {
            fullName: session?.user?.name || "",
            phoneNumber: "",
            domicile: "",
            jerseySize: "",
            skillLevel: "Beginner"
        }
    });

    // Simulasi Fetch Data Existing dari DB
    useEffect(() => {
        if(session?.user) {
            // Nanti ganti dengan fetch ke API `/api/member/profile`
            setValue("fullName", session.user.name || "");
        }
    }, [session, setValue]);

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true);
        
        // Simulasi API Call
        setTimeout(() => {
            console.log("Saving data:", data);
            setIsLoading(false);
            toast({
                title: "Profile Updated",
                description: "Data profil kamu berhasil disimpan.",
                className: "bg-green-600 text-white border-none"
            });
        }, 1500);

        // TODO: Buat API Route `POST /api/member/profile` untuk update Firestore
    };

    return (
        <div className="space-y-8 pb-20 max-w-4xl mx-auto">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tighter mb-2">My Profile</h1>
                <p className="text-gray-400">Kelola informasi pribadi dan preferensi permainanmu.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Avatar Section */}
                <div className="lg:col-span-4">
                    <Card className="bg-[#151515] border-white/5 rounded-[2rem] p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#ffbe00]/20 to-transparent"></div>
                        
                        <div className="relative z-10">
                            <div className="w-32 h-32 mx-auto relative mb-4 group cursor-pointer">
                                <Avatar className="w-full h-full border-4 border-[#1A1A1A] shadow-2xl">
                                    <AvatarImage src={session?.user?.image || ""} />
                                    <AvatarFallback className="bg-[#ffbe00] text-black text-4xl font-black">
                                        {session?.user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white">{session?.user?.name}</h3>
                            <p className="text-sm text-gray-500 mb-6">{session?.user?.email}</p>

                            <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5 text-left space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Member Status</span>
                                    <span className="text-[#ffbe00] font-bold uppercase">Active</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Joined Date</span>
                                    <span className="text-white font-mono">Dec 2025</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Edit Form */}
                <div className="lg:col-span-8">
                    <Card className="bg-[#151515] border-white/5 rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="text-white">Personal Information</CardTitle>
                            <CardDescription>Data ini digunakan untuk verifikasi turnamen dan mabar.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3 h-3"/> Display Name
                                    </Label>
                                    <Input 
                                        {...register("fullName")}
                                        className="bg-[#0a0a0a] border-white/10 h-12 rounded-xl text-white font-bold" 
                                        placeholder="Nama Lengkap" 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Phone className="w-3 h-3"/> WhatsApp
                                        </Label>
                                        <Input 
                                            {...register("phoneNumber")}
                                            className="bg-[#0a0a0a] border-white/10 h-12 rounded-xl text-white font-mono" 
                                            placeholder="0812..." 
                                            type="tel"
                                        />
                                    </div>

                                    {/* Domicile */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3 h-3"/> Domicile
                                        </Label>
                                        <Input 
                                            {...register("domicile")}
                                            className="bg-[#0a0a0a] border-white/10 h-12 rounded-xl text-white" 
                                            placeholder="Kota Bandung" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                    {/* Jersey Size */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Shirt className="w-3 h-3"/> Jersey Size
                                        </Label>
                                        <Select onValueChange={(val) => setValue("jerseySize", val)}>
                                            <SelectTrigger className="bg-[#0a0a0a] border-white/10 h-12 rounded-xl text-white">
                                                <SelectValue placeholder="Pilih Ukuran" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                                    <SelectItem key={size} value={size}>{size}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-gray-500">Untuk hadiah member loyal.</p>
                                    </div>

                                    {/* Skill Level */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Trophy className="w-3 h-3"/> Self Assessed Level
                                        </Label>
                                        <Select onValueChange={(val) => setValue("skillLevel", val)} defaultValue="Beginner">
                                            <SelectTrigger className="bg-[#0a0a0a] border-white/10 h-12 rounded-xl text-white">
                                                <SelectValue placeholder="Pilih Level" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                <SelectItem value="Beginner">Beginner (Baru Belajar)</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate (Bisa Rally)</SelectItem>
                                                <SelectItem value="Advanced">Advanced (Kompetitif)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-gray-500">Membantu matchmaking sparring.</p>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full h-14 bg-[#ffbe00] text-black hover:bg-yellow-400 font-black rounded-xl shadow-lg mt-8"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5 mr-2"/>}
                                    SIMPAN PERUBAHAN
                                </Button>

                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

