'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserCog, Save, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export default function AdminProfilePage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data.success && data.data) {
                setFormData({
                    name: data.data.name || session?.user?.name || '',
                    phoneNumber: data.data.phoneNumber || '',
                });
            }
        };
        if (session) fetchProfile();
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                toast({ title: "Admin Linked", description: data.message });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <UserCog className="w-8 h-8 text-[#ca1f3d]" /> Admin Profile
                </h1>
                <p className="text-gray-400">Manage akun operasional & recovery contact.</p>
            </div>

            <Card className="bg-[#151515] border-white/10 p-6 rounded-[1.5rem]">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label>Admin Name</Label>
                        <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[#1A1A1A] border-white/10 text-white" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#ca1f3d] font-bold">Emergency WhatsApp (Pairing)</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <Input 
                                value={formData.phoneNumber} 
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                                className="bg-[#1A1A1A] border-white/10 text-white pl-10 font-mono"
                                placeholder="08xxxxxxxxxx" 
                            />
                        </div>
                        <p className="text-[10px] text-gray-500">Nomor ini digunakan untuk verifikasi login darurat & pairing system.</p>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full bg-white text-black font-bold hover:bg-gray-200">
                        {isLoading ? <Loader2 className="animate-spin"/> : "UPDATE ADMIN DATA"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
