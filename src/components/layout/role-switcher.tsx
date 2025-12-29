
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Shield, User, CheckCircle, Trophy, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRedirectUrl } from '@/lib/role-utils';

export default function RoleSwitcher() {
    const { data: session, update } = useSession(); // 'update' from next-auth is key!
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Ambil roles dari session (pastikan type definition next-auth sudah diupdate)
    const roles = (session?.user as any)?.roles || [];
    const currentRole = (session?.user as any)?.role;

    // Jika hanya punya 1 role, jangan tampilkan switcher
    if (roles.length <= 1) return null;

    const handleSwitch = async (targetRole: string) => {
        if (targetRole === currentRole) return;
        setLoading(true);

        try {
            // 1. Update di Database via API
            const res = await fetch('/api/user/switch-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetRole })
            });

            if (!res.ok) throw new Error("Gagal switch");

            // 2. Update Session di Client (Tanpa logout)
            await update({ role: targetRole });

            // 3. Redirect ke dashboard yang sesuai
            const targetUrl = getRedirectUrl(targetRole);
            
            toast({ title: "Role Berubah", description: `Beralih ke mode ${targetRole.toUpperCase()}` });
            
            // Hard reload untuk memastikan semua komponen merender ulang sesuai role baru
            window.location.href = targetUrl;

        } catch (error) {
            toast({ title: "Error", description: "Gagal mengganti role", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (r: string) => {
        switch(r) {
            case 'superadmin': return <Crown className="w-4 h-4 text-red-500" />;
            case 'admin': return <Shield className="w-4 h-4 text-orange-500" />;
            case 'host': return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case 'coach': return <Trophy className="w-4 h-4 text-[#00f2ea]" />;
            default: return <User className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-[#1A1A1A] border-white/10 text-white hover:bg-white/10 gap-2 h-9 rounded-full px-4">
                    {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : getIcon(currentRole)}
                    <span className="uppercase font-bold text-xs">{currentRole}</span>
                    <Badge variant="secondary" className="text-[10px] h-5 bg-white/10 text-gray-400 hover:bg-white/20">Switch</Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-white/10 text-white rounded-xl">
                <DropdownMenuLabel className="text-gray-500 text-xs uppercase">Ganti Akun Role</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                
                {roles.map((r: string) => (
                    <DropdownMenuItem 
                        key={r}
                        onClick={() => handleSwitch(r)}
                        className={`cursor-pointer gap-3 p-3 focus:bg-white/5 ${r === currentRole ? 'bg-white/5' : ''}`}
                    >
                        {getIcon(r)}
                        <div className="flex-1">
                            <p className="text-sm font-bold uppercase">{r}</p>
                            {r === currentRole && <p className="text-[10px] text-[#00f2ea]">Sedang Aktif</p>}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
