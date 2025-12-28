'use client';

import { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AdminReportsPage() {
    const { toast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch Events untuk Dropdown
    useEffect(() => {
        const fetchEvents = async () => {
            const res = await fetch('/api/events'); // Gunakan API event existing
            const data = await res.json();
            if (data.data) setEvents(data.data);
        };
        fetchEvents();
    }, []);

    const handleDownload = async () => {
        if (!selectedEvent) return;
        setLoading(true);

        try {
            const res = await fetch('/api/admin/reports/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: selectedEvent })
            });

            if (!res.ok) throw new Error("Gagal download");

            // Logic trigger download file di browser
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Get filename from header
            const disposition = res.headers.get('Content-Disposition');
            let filename = 'Data_Peserta.csv';
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) { 
                  filename = matches[1].replace(/['"]/g, '');
                }
            }
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            a.remove();
            
            toast({ title: "Berhasil", description: "File CSV berhasil diunduh." });
        } catch (e) {
            toast({ title: "Gagal", description: "Terjadi kesalahan saat export.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-white">LAPORAN & EXPORT</h1>
                <p className="text-gray-400">Unduh data peserta untuk keperluan absensi manual.</p>
            </div>

            <Card className="p-8 bg-[#151515] border border-white/10 rounded-[2rem]">
                <div className="max-w-xl space-y-6">
                    <div className="flex items-center gap-4 text-white mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Export Data Peserta</h3>
                            <p className="text-sm text-gray-500">Format: .CSV (Excel Compatible)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Pilih Event</label>
                        <Select onValueChange={setSelectedEvent}>
                            <SelectTrigger className="h-12 rounded-xl bg-[#0a0a0a] border-white/10 text-white">
                                <SelectValue placeholder="Pilih jadwal mabar..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                {events.map((evt) => (
                                    <SelectItem key={evt.id} value={evt.id}>
                                        {evt.title} ({new Date(evt.date).toLocaleDateString()})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        onClick={handleDownload} 
                        disabled={!selectedEvent || loading}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                    >
                        {loading ? "Generating CSV..." : <><Download className="w-4 h-4 mr-2" /> DOWNLOAD DATA PESERTA</>}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
