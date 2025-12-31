'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { FinanceNav } from '@/components/admin/finance-nav';

export default function ApprovalsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-approvals'],
    queryFn: async () => {
      const res = await fetch('/api/admin/finance/approvals');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  const requests = data?.data || [];

  const mutation = useMutation({
    mutationFn: async ({ id, action }: { id: string, action: 'approve' | 'reject' }) => {
      const res = await fetch('/api/admin/finance/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: (data) => {
      toast({ title: 'Success', description: data.message });
      queryClient.invalidateQueries({ queryKey: ['admin-approvals'] });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  });

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    mutation.mutate({ id, action });
  };

  return (
    <main>
      <FinanceNav />

      <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-[#ffbe00]" /> APPROVALS & REIMBURSEMENT
            </h1>
            <p className="text-gray-400 mt-1">Kelola persetujuan payout dan request dana dari Coach/Staff.</p>
          </div>
        </div>

        <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-6 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1A1A1A]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Tanggal Request</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Coach</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Bank Details</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-right">Nominal</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#ffbe00]" />
                  </TableCell>
                </TableRow>
              ) : requests.length > 0 ? (
                requests.map((req: any) => (
                  <TableRow key={req.id} className="border-white/5 hover:bg-white/5 transition">
                    <TableCell className="text-gray-300">
                      {format(new Date(req.requestedAt), 'dd MMM yyyy HH:mm', { locale: idLocale })}
                    </TableCell>
                    <TableCell className="font-bold text-white">{req.coachName}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {req.bankDetails}
                      {req.notes && <div className="text-xs italic opacity-50 mt-1">Note: {req.notes}</div>}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#00f2ea] text-lg">
                      Rp {req.amount.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={req.status === 'paid' ? 'default' : req.status === 'pending' ? 'secondary' : 'destructive'}
                        className={`uppercase font-bold ${req.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-black font-bold h-8 w-8 p-0 rounded-full"
                            onClick={() => handleAction(req.id, 'approve')}
                            disabled={mutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleAction(req.id, 'reject')}
                            disabled={mutation.isPending}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {req.status === 'paid' && (
                        <span className="text-xs text-gray-500 flex items-center justify-end gap-1">
                          <CheckCircle className="w-3 h-3" /> Processed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
