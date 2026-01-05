import { cn, formatRupiah, cleanCurrency } from '@/lib/utils';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, Save, Loader2, Dumbbell, Users, Trophy, Info, MapPin, Clock, DollarSign, User, ArrowRight, Pencil, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch'; // Added Switch
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Material3DatePickerDialogFinal } from '@/components/ui/material-3-date-picker-dialog';
import { Material3TimePicker } from '@/components/ui/material-3-time-picker';
import { Material3Input } from '@/components/ui/material-3-input';
import { StatusModal } from '@/components/ui/status-modal';
import { Material3Textarea } from '@/components/ui/material-3-textarea';
import {
  Material3Select,
  Material3SelectTrigger,
  Material3SelectValue,
  Material3SelectContent,
  Material3SelectItem
} from '@/components/ui/material-3-select';

interface EventFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  eventId?: string; // Required for edit
  successRedirectUrl?: string; // Optional custom redirect URL
}

export function EventForm({ mode, initialData, eventId, successRedirectUrl }: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState<any[]>([]);

  // State Date & Time
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // Status Modal State
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    description: ''
  });

  // Structured Criteria List
  const [criteriaList, setCriteriaList] = useState<{ p1: string; p2: string; club: string }[]>([
    { p1: '', p2: '', club: '' }
  ]);

  // Recurring Schedule State
  const [isRecurring, setIsRecurring] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'mabar',
    coachName: '',
    location: '',
    price: '',
    quota: '12',
    description: '',
    allowWaitingList: false, // Default false
    coachNickname: '', // Store Nickname
    externalLink: '',
    allowedUserTypes: 'both', // 'member' | 'both' (guest allowed)
    partnerMechanism: 'user', // 'user' | 'coach'
    skillLevel: 'all', // 'beginner' | 'intermediate' | 'advanced' | 'all'
    curriculum: '', // Drilling curriculum
    organizer: '', // Tournament Organizer
    playerCriteria: '', // Tournament Player Criteria
    prizes: '', // Tournament Prizes
    sparringOpponent: '', // Sparring: Opponent Team Name (Optional)
    matchFormat: '', // Sparring: e.g. "5 Partai (3MD, 2XD)"
    assistantCoachIds: [] as string[],
    assistantCoachNames: [] as string[]
  });

  // Drilling Costs State
  const [drillCosts, setDrillCosts] = useState({
    court: formatRupiah(175000),
    shuttle: formatRupiah(83000),
    tool: formatRupiah(20000),
    coach: formatRupiah(300000)
  });

  // LOAD INITIAL DATA (FOR EDIT)
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || '',
        type: initialData.type ? initialData.type.toLowerCase() : 'mabar',
        coachName: initialData.coachName || '',
        coachNickname: initialData.coachNickname || '',
        externalLink: initialData.externalLink || '',
        allowedUserTypes: initialData.allowedUserTypes?.[1] === 'guest' || initialData.allowedUserTypes?.includes('guest') ? 'both' : 'member',
        partnerMechanism: initialData.partnerMechanism || 'user',
        skillLevel: initialData.skillLevel ? initialData.skillLevel.toLowerCase() : 'all',
        curriculum: initialData.curriculum || '',
        location: initialData.location || '',
        price: (initialData.price !== undefined && initialData.price !== null) ? formatRupiah(initialData.price) : '',
        quota: initialData.quota?.toString() || '12',
        description: initialData.description || '',
        allowWaitingList: initialData.allowWaitingList || false,
        organizer: initialData.organizer || '',
        playerCriteria: initialData.playerCriteria || '',
        prizes: initialData.prizes || '',
        sparringOpponent: initialData.sparringOpponent || '',
        matchFormat: initialData.matchFormat || '',
        assistantCoachIds: initialData.assistantCoachIds || [],
        assistantCoachNames: initialData.assistantCoachNames || []
      }));

      // Update Drill Costs for Edit
      if (initialData.financials) {
        setDrillCosts({
          court: formatRupiah(initialData.financials.courtCost || 0),
          shuttle: formatRupiah(initialData.financials.shuttlecockCost || 0),
          tool: formatRupiah(initialData.financials.toolCost || 0),
          coach: formatRupiah(initialData.financials.coachFee || 0)
        });
      } else if (initialData.cost_court || initialData.cost_shuttle) {
        setDrillCosts({
          court: formatRupiah(initialData.cost_court || 0),
          shuttle: formatRupiah(initialData.cost_shuttle || 0),
          tool: formatRupiah(initialData.cost_tool || 0),
          coach: formatRupiah(initialData.cost_coach || 0)
        });
      }

      // Robust Date Parsing
      if (initialData.date) {
        if (initialData.date.includes(' - ')) {
          const [startStr, endStr] = initialData.date.split(' - ');
          setSelectedDate(new Date(startStr));
          setSelectedEndDate(new Date(endStr));
        } else {
          // Handle potential timestamp or string
          const d = new Date(initialData.date);
          if (!isNaN(d.getTime())) setSelectedDate(d);
        }
      }

      // Robust Time Parsing (Handle various separators)
      if (initialData.time) {
        // Match HH:mm - HH:mm or HH:mm-HH:mm
        const parts = initialData.time.split(/\s*-\s*/);
        if (parts.length >= 2) {
          setStartTime(parts[0]);
          setEndTime(parts[1]);
        }
      }
    }
  }, [mode, initialData]);

  // FETCH COACHES
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('/api/coaches');
        const data = await res.json();
        if (data.success) {
          setCoaches(data.data);
        }
      } catch (error) {
        console.error("Gagal load coach", error);
      }
    };
    fetchCoaches();
  }, []);

  // LOAD MODULES
  const [modules, setModules] = useState<any[]>([]);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch('/api/coach/modules'); // Fetch all modules
        const data = await res.json();
        if (data.data) setModules(data.data);
      } catch (error) {
        console.error("Gagal load modules", error);
      }
    };
    fetchModules();
  }, []);

  // SYNC NICKNAME IF MISSING ON LOAD (Legacy Data Support)
  useEffect(() => {
    if (formData.coachName && !formData.coachNickname && coaches.length > 0) {
      const found = coaches.find(c => c.name === formData.coachName);
      if (found?.nickname) {
        setFormData(prev => ({ ...prev, coachNickname: found.nickname }));
      }
    }
  }, [coaches, formData.coachName, formData.coachNickname]);

  // AUTO-SET END TIME
  useEffect(() => {
    if (startTime && !endTime && mode === 'create') { // Only auto-set on create or if empty
      const [h, m] = startTime.split(':').map(Number);
      let nextH = h + 2;
      if (nextH >= 24) nextH -= 24;
      const formattedEnd = `${nextH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      setEndTime(formattedEnd);
    }
  }, [startTime, endTime, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!selectedDate || !startTime || !endTime) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'DATA BELUM LENGKAP',
        description: 'Mohon lengkapi tanggal dan waktu kegiatan sebelum menyimpan.',
        actionLabel: 'OK, MENGERTI'
      });
      setLoading(false);
      return;
    }

    const cleanPrice = formData.price.replace(/\D/g, '');

    // Serialize Criteria List to String if it has data
    let serializedCriteria = formData.playerCriteria;
    if (criteriaList.some(c => c.p1 || c.p2 || c.club)) {
      serializedCriteria = criteriaList.map((c, i) =>
        `#${i + 1} [${c.p1} & ${c.p2}] (${c.club || 'Open'})`
      ).join('\n');
    }

    // Format Date Range for Tournament
    let finalDate = format(selectedDate, 'yyyy-MM-dd');
    if (formData.type === 'tournament' && selectedEndDate) {
      finalDate = `${format(selectedDate, 'yyyy-MM-dd')} - ${format(selectedEndDate, 'yyyy-MM-dd')}`;
    }

    const finalPayload = {
      ...formData,
      playerCriteria: serializedCriteria,
      price: cleanPrice,
      date: finalDate,
      time: `${startTime} - ${endTime}`,
      // Transform allowedUserTypes string to array for backend
      allowedUserTypes: formData.allowedUserTypes === 'both' ? ['member', 'guest'] : ['member'],
      isRecurring, // Include Recurring Flag
      // Drilling Costs
      cost_court: cleanCurrency(drillCosts.court),
      cost_shuttle: cleanCurrency(drillCosts.shuttle),
      cost_tool: cleanCurrency(drillCosts.tool),
      cost_coach: cleanCurrency(drillCosts.coach)
    };

    try {
      const url = mode === 'create' ? '/api/events' : `/api/events/${eventId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      if (res.ok) {
        setStatusModal({
          isOpen: true,
          type: 'success',
          title: mode === 'create' ? 'EVENT DIBUAT!' : 'EVENT DIPERBARUI!',
          description: mode === 'create' ? 'Jadwal kegiatan berhasil ditambahkan ke sistem.' : 'Perubahan data kegiatan berhasil disimpan.',
          actionLabel: 'LANJUTKAN',
          onAction: () => {
            if (successRedirectUrl) {
              router.push(successRedirectUrl);
            } else {
              router.push('/host/events');
            }
            router.refresh();
          }
        });
      } else {
        throw new Error("Gagal menyimpan data");
      }
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'GAGAL MENYIMPAN',
        description: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
        actionLabel: 'COBA LAGI'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="bg-[#151515] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* KOLOM KIRI: Informasi Dasar */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Info className="w-5 h-5 text-[#ffbe00]" /> Informasi Utama
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <Material3Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({ ...formData, type: val, coachName: val !== 'drilling' ? '' : formData.coachName })}
                >
                  <Material3SelectTrigger label="Jenis Event" hasValue={!!formData.type}>
                    <Material3SelectValue />
                  </Material3SelectTrigger>
                  <Material3SelectContent>
                    <Material3SelectItem value="mabar"><span className="flex items-center gap-2"><Users className="w-4 h-4" /> Mabar (Fun Game)</span></Material3SelectItem>
                    <Material3SelectItem value="sparring"><span className="flex items-center gap-2"><Users className="w-4 h-4 text-red-500" /> Sparring (Vs Team)</span></Material3SelectItem>
                    <Material3SelectItem value="drilling"><span className="flex items-center gap-2"><Dumbbell className="w-4 h-4" /> Drilling / Clinic</span></Material3SelectItem>
                    <Material3SelectItem value="tournament"><span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Turnamen</span></Material3SelectItem>
                  </Material3SelectContent>
                </Material3Select>
              </div>

              {/* LOGIC DROPDOWN COACH */}
              {formData.type === 'drilling' && (
                <>
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    {/* COACH SELECTION */}
                    <Material3Select
                      value={formData.coachName}
                      onValueChange={(val) => {
                        const selectedCoach = coaches.find(c => c.name === val);
                        setFormData({
                          ...formData,
                          coachName: val,
                          coachNickname: selectedCoach?.nickname || '' // Auto-fill nickname
                        });
                      }}
                    >
                      <Material3SelectTrigger label="Pilih Coach" hasValue={!!formData.coachName}>
                        <Material3SelectValue placeholder="Siapa pelatihnya?" />
                      </Material3SelectTrigger>
                      <Material3SelectContent>
                        {coaches.length > 0 ? (
                          coaches.map((coach) => (
                            <Material3SelectItem key={coach.id} value={coach.name}>
                              <span className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#00f2ea]" />
                                {coach.name}
                              </span>
                            </Material3SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-xs text-gray-500 text-center">Belum ada data Coach</div>
                        )}
                      </Material3SelectContent>
                    </Material3Select>

                    {/* MODULE SELECTION (Only show if Coach is Selected) */}
                    {formData.coachName && (
                      <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-left-2">
                        <Material3Select
                          value={(formData as any).moduleId || ""}
                          onValueChange={(val) => {
                            const selectedModule = modules.find(m => m.id === val);
                            if (selectedModule) {
                              setFormData({
                                ...formData,
                                // @ts-ignore
                                moduleId: selectedModule.id,
                                // @ts-ignore
                                moduleTitle: selectedModule.title,
                                // Auto-fill details from module
                                skillLevel: selectedModule.level?.toLowerCase() === 'advance' ? 'advanced' : selectedModule.level?.toLowerCase() || 'all',
                                curriculum: `[Module: ${selectedModule.title}]\n\nDrills:\n- ${selectedModule.drills?.join('\n- ')}`
                              });
                              toast({ title: "Modul Dipilih", description: `Materi "${selectedModule.title}" telah dimuat.` });
                            }
                          }}
                        >
                          <Material3SelectTrigger label="Pilih Modul Latihan (Opsional)" hasValue={!!(formData as any).moduleId}>
                            <Material3SelectValue placeholder="Gunakan Modul dari Library?" />
                          </Material3SelectTrigger>
                          <Material3SelectContent>
                            {modules.filter(m => m.coachName === formData.coachName || !m.coachName).length > 0 ? (
                              modules
                                .filter(m => m.coachName === formData.coachName || !m.coachName) // Filter by Coach
                                .map((mod) => (
                                  <Material3SelectItem key={mod.id} value={mod.id}>
                                    <span className="flex items-center gap-2">
                                      <Dumbbell className="w-4 h-4 text-primary" />
                                      {mod.title}
                                    </span>
                                  </Material3SelectItem>
                                ))
                            ) : (
                              <div className="p-2 text-xs text-gray-500 text-center">Coach ini belum punya Modul</div>
                            )}
                          </Material3SelectContent>
                        </Material3Select>
                        <p className="text-[10px] text-gray-400 mt-1 ml-1">*Memilih modul akan mengisi otomatis detail kurikulum.</p>
                      </div>
                    )}

                    {/* ASISTEN COACH SELECTION (Enable Multiple) */}
                    <div className="pt-2 animate-in slide-in-from-left-3">
                      <Label className="text-xs text-gray-400 mb-2 block">Asisten Coach (Opsional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-[#1A1A1A] border-white/10 text-left font-normal text-white hover:bg-[#222]">
                            {formData.assistantCoachNames.length > 0
                              ? `${formData.assistantCoachNames.length} Asisten: ${formData.assistantCoachNames.join(', ')}`
                              : "Pilih Asisten Coach (Bisa > 1)"}
                            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 bg-[#1A1A1A] border-white/10 text-white" align="start">
                          <div className="p-2 space-y-2 max-h-[200px] overflow-y-auto">
                            {coaches
                              .filter(c => c.name !== formData.coachName) // Exclude Main Coach
                              .map(coach => (
                                <div key={coach.id} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                                  onClick={() => {
                                    const isSelected = formData.assistantCoachIds.includes(coach.id);
                                    let newIds, newNames;

                                    if (isSelected) {
                                      newIds = formData.assistantCoachIds.filter(id => id !== coach.id);
                                      newNames = formData.assistantCoachNames.filter(name => name !== coach.name);
                                    } else {
                                      newIds = [...formData.assistantCoachIds, coach.id];
                                      newNames = [...formData.assistantCoachNames, coach.name];
                                    }

                                    setFormData({ ...formData, assistantCoachIds: newIds, assistantCoachNames: newNames });
                                  }}>
                                  <Checkbox
                                    checked={formData.assistantCoachIds.includes(coach.id)}
                                    onCheckedChange={() => { }} // Handled by parent div click
                                    className="border-white/20 data-[state=checked]:bg-[#00f2ea] data-[state=checked]:text-black"
                                  />
                                  <span className="text-sm">{coach.name}</span>
                                </div>
                              ))}
                            {coaches.filter(c => c.name !== formData.coachName).length === 0 && (
                              <p className="text-xs text-gray-500 text-center py-2">Tidak ada coach lain tersedia.</p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Skill Level & Curriculum for Drilling */}
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border border-[#00f2ea]/20 bg-[#00f2ea]/5 p-4 rounded-xl mt-2 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Dumbbell className="w-4 h-4 text-[#00f2ea]" />
                      <span className="text-xs font-bold text-[#00f2ea] uppercase">Drilling Details</span>
                    </div>

                    <div className="space-y-1">
                      <Material3Select
                        value={formData.skillLevel}
                        onValueChange={(val) => setFormData({ ...formData, skillLevel: val })}
                      >
                        <Material3SelectTrigger label="Level Skill Target" hasValue={!!formData.skillLevel}>
                          <Material3SelectValue />
                        </Material3SelectTrigger>
                        <Material3SelectContent>
                          <Material3SelectItem value="beginner">Beginner (Pemula)</Material3SelectItem>
                          <Material3SelectItem value="intermediate">Intermediate (Menengah)</Material3SelectItem>
                          <Material3SelectItem value="advanced">Advanced (Mahir)</Material3SelectItem>
                          <Material3SelectItem value="all">All Levels (Semua Level)</Material3SelectItem>
                        </Material3SelectContent>
                      </Material3Select>
                    </div>

                    <div className="space-y-1">
                      <Material3Textarea
                        label="Kurikulum / Materi Latihan"
                        placeholder="Jelaskan fokus latihan (e.g. Footwork, Smol, Defense)"
                        value={formData.curriculum}
                        onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* DRILLING FINANCIALS & SIMULATION */}
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border border-[#00f2ea]/20 bg-[#00f2ea]/5 p-4 rounded-xl mt-4">
                    <div className="flex items-center gap-2 mb-2 p-2 bg-[#00f2ea]/10 rounded-lg">
                      <DollarSign className="w-4 h-4 text-[#00f2ea]" />
                      <span className="text-xs font-bold text-[#00f2ea] uppercase">Estimasi Biaya & Harga (Drilling)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Material3Input
                        label="Sewa Lapangan"
                        type="text"
                        value={drillCosts.court}
                        onChange={(e) => setDrillCosts({ ...drillCosts, court: formatRupiah(e.target.value) })}
                      />
                      <Material3Input
                        label="Shuttlecock"
                        type="text"
                        value={drillCosts.shuttle}
                        onChange={(e) => setDrillCosts({ ...drillCosts, shuttle: formatRupiah(e.target.value) })}
                      />
                      <Material3Input
                        label="Sewa Alat"
                        type="text"
                        value={drillCosts.tool}
                        onChange={(e) => setDrillCosts({ ...drillCosts, tool: formatRupiah(e.target.value) })}
                      />
                      <Material3Input
                        label="Honor Coach"
                        type="text"
                        value={drillCosts.coach}
                        onChange={(e) => setDrillCosts({ ...drillCosts, coach: formatRupiah(e.target.value) })}
                      />
                    </div>

                    {/* Price Simulation Table */}
                    <div className="bg-[#1A1A1A] rounded-lg p-3 border border-white/10 mt-2">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Simulasi Harga Jual (Quota: {formData.quota})</p>
                      <div className="space-y-1">
                        {(() => {
                          const totalCost = Number(cleanCurrency(drillCosts.court)) + Number(cleanCurrency(drillCosts.shuttle)) + Number(cleanCurrency(drillCosts.tool)) + Number(cleanCurrency(drillCosts.coach));
                          const quotaNum = Number(formData.quota) || 12;
                          const hpp = totalCost / quotaNum;
                          const calc = (margin: number) => Math.ceil((hpp + (hpp * margin)) / 5000) * 5000;

                          const tiers = [
                            { l: 'Trial (-14%)', p: calc(-0.14), c: 'text-green-400' },
                            { l: 'Pelajar (+3%)', p: calc(0.03), c: 'text-blue-400' },
                            { l: 'Member (+12%)', p: calc(0.12), c: 'text-white' },
                            { l: 'Normal (+20%)', p: calc(0.20), c: 'text-yellow-400' },
                            { l: 'Drop-In (+29%)', p: calc(0.29), c: 'text-red-400' },
                          ];

                          return tiers.map((t, idx) => (
                            <div key={idx} className="flex justify-between text-xs border-b border-white/5 pb-1 last:border-0 hover:bg-white/5 px-2 py-0.5 rounded">
                              <span className="text-gray-400 w-24">{t.l}</span>
                              <span className={`font-mono font-bold ${t.c}`}>Rp {t.p.toLocaleString('id-ID')}</span>
                            </div>
                          ));
                        })()}
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-600 mt-2 pt-2 border-t border-white/10">
                        <span>HPP per Orang:</span>
                        <span>Rp {Math.ceil((Number(cleanCurrency(drillCosts.court)) + Number(cleanCurrency(drillCosts.shuttle)) + Number(cleanCurrency(drillCosts.tool)) + Number(cleanCurrency(drillCosts.coach))) / (Number(formData.quota) || 12)).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                </>
              )}

              {/* LOGIC DROPDOWN SPARRING */}
              {formData.type === 'sparring' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border border-red-500/20 bg-red-500/5 p-4 rounded-xl mt-2 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500 uppercase">Detail Sparring</span>
                  </div>

                  <Material3Input
                    label="Tim Lawan (Opponent)"
                    placeholder="Nama Klub / Tim Lawan (Kosongkan jika mencari lawan)"
                    value={formData.sparringOpponent}
                    onChange={(e) => setFormData({ ...formData, sparringOpponent: e.target.value })}
                  />

                  <Material3Select
                    value={formData.skillLevel}
                    onValueChange={(val) => setFormData({ ...formData, skillLevel: val })}
                  >
                    <Material3SelectTrigger label="Level Lawan Dicari" hasValue={!!formData.skillLevel}>
                      <Material3SelectValue />
                    </Material3SelectTrigger>
                    <Material3SelectContent>
                      <Material3SelectItem value="beginner">Beginner (C)</Material3SelectItem>
                      <Material3SelectItem value="intermediate">Intermediate (B)</Material3SelectItem>
                      <Material3SelectItem value="advanced">Advanced (A)</Material3SelectItem>
                      <Material3SelectItem value="all">Open (Semua Level)</Material3SelectItem>
                    </Material3SelectContent>
                  </Material3Select>

                  <Material3Textarea
                    label="Format Pertandingan"
                    placeholder="Contoh: 5 Partai (3 Ganda Putra, 2 Ganda Campuran)"
                    value={formData.matchFormat}
                    onChange={(e) => setFormData({ ...formData, matchFormat: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>
              )}
              {/* LOGIC DROPDOWN TOURNAMENT */}
              {formData.type === 'tournament' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border border-white/10 bg-white/5 p-4 rounded-xl mt-2 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-[#ffbe00]" />
                    <span className="text-xs font-bold text-[#ffbe00] uppercase">Pengaturan Tournament</span>
                  </div>

                  {/* Access Control */}
                  <div className="space-y-1">
                    <Material3Select
                      value={formData.allowedUserTypes}
                      onValueChange={(val) => setFormData({ ...formData, allowedUserTypes: val })}
                    >
                      <Material3SelectTrigger label="Akses Pendaftaran" hasValue={!!formData.allowedUserTypes}>
                        <Material3SelectValue />
                      </Material3SelectTrigger>
                      <Material3SelectContent>
                        <Material3SelectItem value="member">Hanya Member</Material3SelectItem>
                        <Material3SelectItem value="both">Member & Guest (Umum)</Material3SelectItem>
                      </Material3SelectContent>
                    </Material3Select>
                  </div>

                  <div className="space-y-1">
                    <Material3Select
                      value={formData.partnerMechanism}
                      onValueChange={(val) => setFormData({ ...formData, partnerMechanism: val })}
                    >
                      <Material3SelectTrigger label="Mekanisme Pasangan" hasValue={!!formData.partnerMechanism}>
                        <Material3SelectValue />
                      </Material3SelectTrigger>
                      <Material3SelectContent>
                        <Material3SelectItem value="user">Pilih Pasangan Sendiri</Material3SelectItem>
                        <Material3SelectItem value="coach">Ditentukan Coach / Panitia</Material3SelectItem>
                      </Material3SelectContent>
                    </Material3Select>
                  </div>

                  <Material3Input
                    label="Penyelenggara (Organizer)"
                    placeholder="Contoh: PB Djarum / Internal Club"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  />

                  {/* DYNAMIC PLAYER CRITERIA LIST */}
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase">Kriteria Peserta (Patokan)</label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setCriteriaList([...criteriaList, { p1: '', p2: '', club: '' }])}
                        className="h-6 text-[#ffbe00] hover:text-[#ffbe00] hover:bg-[#ffbe00]/10"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Tambah
                      </Button>
                    </div>

                    {criteriaList.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start animate-in slide-in-from-left-2">
                        <div className="grid grid-cols-3 gap-2 flex-1">
                          <Material3Input
                            label={`Patokan (${index + 1})`}
                            placeholder="Grade A"
                            value={item.p1}
                            onChange={(e) => {
                              const newList = [...criteriaList];
                              newList[index].p1 = e.target.value;
                              setCriteriaList(newList);
                            }}
                          />
                          <Material3Input
                            label={`Partner (${index + 1})`}
                            placeholder="Grade B"
                            value={item.p2}
                            onChange={(e) => {
                              const newList = [...criteriaList];
                              newList[index].p2 = e.target.value;
                              setCriteriaList(newList);
                            }}
                          />
                          <Material3Input
                            label={`Asal PB (${index + 1})`}
                            placeholder="PB Djarum"
                            value={item.club}
                            onChange={(e) => {
                              const newList = [...criteriaList];
                              newList[index].club = e.target.value;
                              setCriteriaList(newList);
                            }}
                          />
                        </div>
                        {criteriaList.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newList = criteriaList.filter((_, i) => i !== index);
                              setCriteriaList(newList);
                            }}
                            className="mt-1 text-red-500 hover:text-red-600 hover:bg-red-500/10 h-10 w-10 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <p className="text-[10px] text-gray-500 italic">*Isi detail patokan, pasangan patokan, dan asal klub.</p>
                  </div>

                  <Material3Textarea
                    label="Hadiah (Prizes)"
                    placeholder="Contoh: Juara 1: Rp 1.000.000 + Trophy"
                    value={formData.prizes}
                    onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                    className="min-h-[80px]"
                  />

                  <Material3Input
                    label="Link Eksternal (Opsional)"
                    placeholder="Kosongkan jika pendaftaran internal"
                    value={formData.externalLink}
                    onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                  />
                </div>
              )}

              <Material3Input
                label="Judul Kegiatan"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Material3Textarea
                label="Deskripsi / Catatan"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* KOLOM KANAN: Logistik & Harga */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <MapPin className="w-5 h-5 text-[#ffbe00]" /> Waktu & Lokasi
            </h3>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-4">
                {/* Material 3 Date Picker (Start) */}
                <Material3DatePickerDialogFinal
                  date={selectedDate}
                  setDate={setSelectedDate}
                  label={formData.type === 'tournament' ? "Tanggal Mulai" : "Tanggal Kegiatan"}
                />

                {/* Material 3 Date Picker (End) - Tournament Only */}
                {formData.type === 'tournament' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <Material3DatePickerDialogFinal
                      date={selectedEndDate}
                      setDate={setSelectedEndDate}
                      label="Tanggal Selesai"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <Material3TimePicker
                    label="Waktu Mulai"
                    value={startTime}
                    onChange={setStartTime}
                  />
                  <Material3TimePicker
                    label="Waktu Selesai"
                    value={endTime}
                    onChange={setEndTime}
                  />
                </div>
                {startTime && endTime && (
                  <p className="text-[10px] text-right text-[#ca1f3d] font-bold animate-pulse">
                    *Pastikan waktu sudah benar!
                  </p>
                )}
              </div>

              <Material3Input
                label="Lokasi / Lapangan"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Material3Input
                  label="Harga (IDR)"
                  type="text"
                  value={formData.price}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    if (!raw) {
                      setFormData({ ...formData, price: '' });
                    } else {
                      setFormData({ ...formData, price: formatRupiah(raw) });
                    }
                  }}
                  required
                />
                <Material3Input
                  label="Slot / Kuota"
                  type="number"
                  value={formData.quota}
                  onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                  required
                />
              </div>

              {/* WAITING LIST TOGGLE */}
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#ffbe00]" /> Waiting List
                  </label>
                  <p className="text-[10px] text-gray-400">
                    Izinkan user mendaftar waiting list jika kuota penuh.
                  </p>
                </div>
                <Switch
                  checked={formData.allowWaitingList}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, allowWaitingList: checked })}
                  className="data-[state=checked]:bg-[#ffbe00]"
                />
              </div>

              {/* RECURRING SCHEDULE TOGGLE (Create Mode Only) */}
              {mode === 'create' && (
                <div className="flex items-center justify-between bg-[#00f2ea]/5 p-4 rounded-xl border border-[#00f2ea]/20">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <CalendarPlus className="w-4 h-4 text-[#00f2ea]" /> Jadwal Rutin (4 Sesi)
                    </label>
                    <p className="text-[10px] text-gray-400">
                      Otomatis buat 4 event berturut-turut (Setiap Minggu).
                    </p>
                  </div>
                  <Switch
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                    className="data-[state=checked]:bg-[#00f2ea]"
                  />
                </div>
              )}
            </div>

            <div className="pt-8">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00] text-black font-black text-lg h-16 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(202,31,61,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    MEMPROSES...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'create' ? (
                      <>PUBLISH EVENT SEKARANG <ArrowRight className="w-6 h-6" /></>
                    ) : (
                      <>SIMPAN PERUBAHAN <Save className="w-6 h-6" /></>
                    )}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card >
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        type={statusModal.type}
        title={statusModal.title}
        description={statusModal.description}
        actionLabel={statusModal.actionLabel}
        onAction={statusModal.onAction}
      />
    </form >
  );
}
