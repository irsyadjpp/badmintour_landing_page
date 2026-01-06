'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
// Note: Assuming there is a Moments API or reusing existing one. 
// If not, we'll create a simple one or just mock for now as per "Plan" phase.
// Based on file list, a `src/app/moments` exists, implies public view.
// We need an API to POST/DELETE. I will assume standard fetch interaction to `/api/moments` (to be created/verified).

export default function SocialAdminMomentsPage() {
  const [moments, setMoments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // FORM STATES
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    date: new Date().toISOString().split('T')[0]
  });

  // MOCK FETCH (Replace with real API later)
  useEffect(() => {
    // Simulate Fetch
    setTimeout(() => {
      setMoments([
        { id: 1, title: 'Mabar Semangat Pagi', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80', date: '2024-02-20' },
        { id: 2, title: 'Turnamen Persahabatan', imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80', date: '2024-02-18' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Save
    const newMoment = { id: Date.now(), ...formData };
    setMoments([newMoment, ...moments]);
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Moment uploaded successfully (Mock)!" });
    setFormData({ title: "", imageUrl: "", date: "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
            MANAGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ff4e00]">MOMENTS</span>
          </h1>
          <p className="text-gray-400 mt-2">Upload and manage community documentation.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ffbe00] text-black hover:bg-[#e6ac00] font-bold rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              Upload New Moment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1A1A] border-[#333] text-white">
            <DialogHeader>
              <DialogTitle>Upload Moment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title / Caption</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  placeholder="e.g Serunya Mabar Hari Ini"
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-[#ffbe00] text-black font-bold mt-4">Upload</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moments.map((moment) => (
          <div key={moment.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-[#333]">
            <img src={moment.imageUrl} alt={moment.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="font-bold text-lg leading-tight">{moment.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{moment.date}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-0"><ExternalLink className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" className="bg-red-500/80 hover:bg-red-600 border-0"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
