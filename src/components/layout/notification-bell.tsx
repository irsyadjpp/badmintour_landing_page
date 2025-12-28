'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch Notifikasi
    const fetchNotifs = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
                setUnreadCount(data.data.filter((n: any) => !n.isRead).length);
            }
        } catch (e) { console.error("Notif error"); }
    };

    useEffect(() => {
        fetchNotifs();
        // Polling setiap 60 detik (bisa ganti WebSocket/Firebase listener untuk real-time)
        const interval = setInterval(fetchNotifs, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async () => {
        if (unreadCount > 0) {
            await fetch('/api/notifications', { method: 'PUT' });
            setUnreadCount(0);
            // Update UI lokal biar cepat
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(open) handleMarkAsRead(); }}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-12 h-12 bg-[#1A1A1A] border border-white/10">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#151515] animate-pulse"></span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-[#1A1A1A] border border-white/10 shadow-2xl mr-4 rounded-2xl overflow-hidden" align="end">
                <div className="p-4 border-b border-white/5 bg-[#151515] flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm">Notifikasi</h4>
                    {unreadCount > 0 && <Badge variant="secondary" className="text-[10px] bg-[#ffbe00] text-black hover:bg-[#ffbe00]">{unreadCount} Baru</Badge>}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        <div className="flex flex-col">
                            {notifications.map((notif) => (
                                <div key={notif.id} className={cn("p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 items-start", !notif.isRead && "bg-[#ffbe00]/5")}>
                                    <div className="mt-1">{getIcon(notif.type)}</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-200 leading-tight">{notif.title}</p>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                                        <p className="text-[10px] text-gray-600 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-xs">
                            Tidak ada notifikasi baru.
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
