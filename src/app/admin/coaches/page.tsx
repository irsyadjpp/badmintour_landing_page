'use client';

import { useEffect, useState } from 'react';
import { 
    CheckCircle, 
    XCircle, 
    FileText, 
    User, 
    Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function AdminCoachApproval() {
    const { toast } = useToast();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApps = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/coaches');
        const data = await res.json();
        if (data.success) setApplications(data.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleAction = async (appId: string, action: 'approve' | 'reject') => {
        const res = await fetch('/api/admin/coaches', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ appId, action })
        });

        if (res.ok) {
            toast({ 
                title: action === 'approve' ? "Coach Approved" : "Application Rejected", 
                className: action === 'approve' ? "bg-green-600 text-white" : "bg-red-600 text-white" 
            });
            fetchApps(); // Refresh list
        }
    };

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-2">
                    Coach <span className="text-[#00f2ea]">Verification</span>
                </h1>
                <p className="text-gray-400">Tinjau dan setujui aplikasi pelatih baru.</p>
            </div>

            {loading ? (
                <Loader2 className="animate-spin text-white w-8 h-8 mx-auto" />
            ) : applications.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-white/10 rounded-3xl">
                    <p className="text-gray-500">Tidak ada aplikasi pending.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications.map((app) => (
                        <Card key={app.id} className="bg-[#151515] border-white/5 p-6 rounded-[2rem] flex flex-col justify-between">
                            
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar className="w-16 h-16 border-2 border-[#00f2ea]">
                                    <AvatarImage src={app.userImage} />
                                    <AvatarFallback>C</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{app.userName}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{app.userEmail}</p>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="border-[#00f2ea] text-[#00f2ea] text-[10px]">{app.specialty}</Badge>
                                        <Badge variant="outline" className="text-gray-400 text-[10px]">{app.experience} Exp</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 mb-6">
                                <p className="text-sm text-gray-300 italic">"{app.bio}"</p>
                                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Proposed Rate:</span>
                                    <span className="text-[#ffbe00] font-bold">Rp {app.rate} / jam</span>
                                </div>
                                <Button variant="link" className="text-xs text-[#00f2ea] p-0 h-auto mt-2 flex items-center gap-1">
                                    <FileText className="w-3 h-3"/> View Certificate
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    onClick={() => handleAction(app.id, 'reject')}
                                    variant="outline" 
                                    className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <XCircle className="w-4 h-4 mr-2" /> REJECT
                                </Button>
                                <Button 
                                    onClick={() => handleAction(app.id, 'approve')}
                                    className="bg-[#00f2ea] text-black hover:bg-[#00d2cb] font-bold"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> APPROVE
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
