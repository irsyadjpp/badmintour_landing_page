'use client';

import { FinanceNav } from '@/components/admin/finance-nav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Wallet, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function CoaPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['finance-coa'],
    queryFn: async () => {
      const res = await fetch('/api/admin/finance/coa');
      if (!res.ok) throw new Error('Failed to fetch COA');
      return res.json();
    }
  });

  const coaData = data?.data || [];

  // Grouping configuration
  const groups = [
    { key: 'ASSET', label: '1-000 ASET (Harta)', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { key: 'LIABILITY', label: '2-000 KEWAJIBAN', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { key: 'EQUITY', label: '3-000 MODAL', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { key: 'REVENUE', label: '4-000 PENDAPATAN', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { key: 'COGS', label: '5-000 BEBAN POKOK', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { key: 'EXPENSE', label: '6-000 OPEX', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  if (isLoading) {
    return (
      <main>
        <FinanceNav />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="animate-spin text-[#ffbe00] w-12 h-12" />
        </div>
      </main>
    );
  }

  // Helper to filter accounts for a group. 
  // Should include the HEADER (suffix 000) and children.
  const getAccounts = (type: string) => {
    return coaData.filter((item: any) => {
      // Match specific Type OR Match header code logic (e.g. Asset starts with 1)
      // Since we have 'type' field in Firestore, simple filter:
      if (item.type === type) return true;

      // Handle Headers separately if they are marked as HEADER but we want them in specific cards
      // e.g. 1-000 is HEADER type, but belongs to ASSET card
      if (item.type === 'HEADER') {
        if (type === 'ASSET' && item.code.startsWith('1')) return true;
        if (type === 'LIABILITY' && item.code.startsWith('2')) return true;
        if (type === 'EQUITY' && item.code.startsWith('3')) return true;
        if (type === 'REVENUE' && item.code.startsWith('4')) return true;
        if (type === 'COGS' && item.code.startsWith('5')) return true;
        if (type === 'EXPENSE' && item.code.startsWith('6')) return true;
      }
      return false;
    }).sort((a: any, b: any) => a.code.localeCompare(b.code));
  };

  return (
    <main className="pb-20">
      <FinanceNav />
      <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Wallet className="w-8 h-8 text-[#ffbe00]" /> CHART OF ACCOUNTS
            </h1>
            <p className="text-gray-400 mt-1">Klasifikasi dan struktur akun keuangan (Master Data).</p>
          </div>
          <Button className="bg-[#ffbe00] hover:bg-[#d9a200] text-black font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(255,190,0,0.3)]">
            <Plus className="w-5 h-5 mr-2" /> TAMBAH AKUN
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((group) => {
            const accounts = getAccounts(group.key);
            if (accounts.length === 0) return null;

            return (
              <Card key={group.key} className={`p-6 rounded-[2.5rem] bg-[#151515] border-white/5 border relative overflow-hidden group hover:border-[#ffbe00]/30 transition-all duration-300 shadow-xl`}>
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500 opacity-20 ${group.bg.replace('/10', '/30')}`}></div>

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${group.bg} ${group.color}`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <h2 className={`text-xl font-bold uppercase tracking-wider ${group.color}`}>
                    {group.label}
                  </h2>
                </div>

                <div className="space-y-3 relative z-10">
                  {accounts.map((item: any) => (
                    <div key={item.code} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition group/item">
                      <div className="flex flex-col">
                        <span className={`font-jersey text-2xl tracking-wide ${item.type === 'HEADER' ? 'text-white font-bold' : 'text-gray-300'}`}>
                          {item.code}
                        </span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest group-hover/item:text-white transition-colors">
                          {item.name}
                        </span>
                        {item.description && (
                          <span className="text-[10px] text-gray-600 mt-1">{item.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.type === 'HEADER' && (
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] text-white uppercase font-black border border-white/5">
                            HEADER
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  )
}
