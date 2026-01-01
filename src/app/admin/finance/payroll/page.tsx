'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DollarSign, CheckCircle2, AlertCircle, Calendar, Users, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface UnpaidSession {
  id: string;
  title: string;
  date: string;
  coachName: string;
  coachId: string;
  attendeesCount: number;
  type: 'private' | 'drilling' | 'mabar';
  price: number;
  calculatedFee: number;
  status: 'pending' | 'paid';
}

export default function PayrollPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<UnpaidSession[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // FETCH UNPAID SESSIONS
  // In a real app, this would be an API call like /api/admin/finance/unpaid-sessions
  // For now, we will mock the data fetch or stimulate it 
  const fetchUnpaidSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/finance/payroll/unpaid');
      const data = await res.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Gagal memuat data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidSessions();
  }, []);

  const handlePay = async (sessionData: UnpaidSession) => {
    setProcessingId(sessionData.id);
    try {
      const res = await fetch('/api/admin/finance/payroll/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionData.id,
          amount: sessionData.calculatedFee,
          coachId: sessionData.coachId,
          coachName: sessionData.coachName,
          description: `Payroll: ${sessionData.title} (${sessionData.date})`
        })
      });

      const result = await res.json();
      if (result.success) {
        toast({
          title: "Pembayaran Berhasil",
          description: `Slip gaji untuk ${sessionData.coachName} telah dibuat.`,
          className: "bg-green-600 text-white"
        });
        fetchUnpaidSessions(); // Refresh list
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ title: "Gagal Membayar", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  // Calculate Total Pending
  const totalPending = sessions.reduce((acc, curr) => acc + curr.calculatedFee, 0);

  return (
    <div className="space-y-8 pb-20 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
            <Wallet className="w-8 h-8 text-[#ffbe00]" /> Payroll System
          </h1>
          <p className="text-gray-400 mt-1 font-medium">Kelola gaji dan fee pelatih per sesi.</p>
        </div>
        <div className="bg-[#151515] px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-end">
          <span className="text-xs font-bold text-gray-500 uppercase">Total Pending Payment</span>
          <span className="text-2xl font-black text-[#ffbe00]">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPending)}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 bg-[#151515] rounded-[2rem] border border-white/5">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Semua Terbayar!</h3>
          <p className="text-gray-500">Tidak ada sesi yang menunggu pembayaran fee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sessions.map((item) => (
            <Card key={item.id} className="bg-[#151515] border-white/10 hover:border-white/20 transition-all">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 flex-1">
                  <div className="hidden md:flex w-16 h-16 bg-[#ffbe00]/10 rounded-2xl items-center justify-center text-[#ffbe00] font-black text-2xl border border-[#ffbe00]/20">
                    {item.coachName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold border-white/20 text-gray-400">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {format(new Date(item.date), 'dd MMM yyyy', { locale: localeId })}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      Coach: <span className="text-white font-bold">{item.coachName}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <Users className="w-3 h-3" /> {item.attendeesCount} Peserta
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 min-w-[150px]">
                  <span className="text-xs font-bold text-gray-500 uppercase">Estimasi Fee</span>
                  <span className="text-2xl font-black text-green-500">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.calculatedFee)}
                  </span>
                  <div className="text-[10px] text-gray-500 italic">
                    {item.type === 'private' ? '(80% Profit Sharing)' : '(Flat Fee / Head)'}
                  </div>
                </div>

                <Button
                  onClick={() => handlePay(item)}
                  disabled={loading || processingId === item.id}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold h-12 px-6 rounded-xl shadow-lg w-full md:w-auto"
                >
                  {processingId === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Payslip"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
