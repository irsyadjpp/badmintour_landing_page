'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, UserCheck, Trophy } from "lucide-react";
import MatchGenerator from '@/components/mabar/match-generator'; // Pastikan path sesuai

// Dummy Data Peserta
const initialParticipants = [
  { id: 1, name: "Irsyad Jamal", status: "Paid", attended: true, level: "Advance" },
  { id: 2, name: "Budi Santoso", status: "Unpaid", attended: false, level: "Intermediate" },
  { id: 3, name: "Kevin Sanjaya", status: "Paid", attended: true, level: "Pro" },
  { id: 4, name: "Marcus Gideon", status: "Paid", attended: false, level: "Pro" },
  { id: 5, name: "Hendra Setiawan", status: "Paid", attended: true, level: "Legend" },
  // ... tambah data lain
];

export default function SessionControlPanel() {
  const [participants, setParticipants] = useState(initialParticipants);

  // Fungsi toggle status pembayaran
  const togglePayment = (id: number) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, status: p.status === "Paid" ? "Unpaid" : "Paid" } : p
    ));
  };

  // Fungsi toggle absensi
  const toggleAttendance = (id: number) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, attended: !p.attended } : p
    ));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Info Sesi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-6 rounded-xl border">
        <div>
            <h1 className="text-3xl font-black">Mabar GOR Cikutra</h1>
            <p className="text-muted-foreground font-medium">Sabtu, 24 Agustus • 20:00 - 23:00 WIB</p>
        </div>
        <div className="flex gap-3">
             <Card className="p-3 flex items-center gap-3 bg-white dark:bg-black border-l-4 border-l-green-500">
                <Wallet className="h-8 w-8 text-green-600" />
                <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Keuangan</p>
                    <p className="text-lg font-black">Rp 450.000</p>
                </div>
             </Card>
             <Card className="p-3 flex items-center gap-3 bg-white dark:bg-black border-l-4 border-l-primary">
                <UserCheck className="h-8 w-8 text-primary" />
                <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Hadir</p>
                    <p className="text-lg font-black">{participants.filter(p => p.attended).length}/{participants.length}</p>
                </div>
             </Card>
        </div>
      </div>

      {/* Tabs Kontrol Utama */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-4">
          <TabsTrigger value="attendance">Absensi & Bayar</TabsTrigger>
          <TabsTrigger value="game">Matchmaking</TabsTrigger>
        </TabsList>

        {/* CONTENT 1: ABSENSI */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Peserta</CardTitle>
              <CardDescription>Kelola status pembayaran dan kehadiran pemain.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.name}`} />
                        <AvatarFallback>{participant.name.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{participant.name}</p>
                        <Badge variant="outline" className="text-[10px] h-5">{participant.level}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Toggle Paid */}
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-bold uppercase ${participant.status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                            {participant.status === 'Paid' ? 'Lunas' : 'Belum'}
                        </span>
                        <Switch 
                            checked={participant.status === "Paid"}
                            onCheckedChange={() => togglePayment(participant.id)}
                            className="data-[state=checked]:bg-green-600"
                        />
                      </div>

                      {/* Toggle Hadir */}
                      <div className="flex flex-col items-center gap-1">
                         <span className={`text-[10px] font-bold uppercase ${participant.attended ? 'text-primary' : 'text-muted-foreground'}`}>
                            {participant.attended ? 'Hadir' : 'Absen'}
                        </span>
                        <Switch 
                            checked={participant.attended}
                            onCheckedChange={() => toggleAttendance(participant.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENT 2: MATCHMAKING */}
        <TabsContent value="game">
           <div className="flex flex-col gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                 <Trophy className="h-5 w-5 mt-0.5" />
                 <div>
                    <p className="font-bold text-sm">Mode Turnamen Mini</p>
                    <p className="text-xs">Gunakan tab ini saat sesi berlangsung untuk mengacak pasangan bermain secara adil.</p>
                 </div>
              </div>
              
              {/* Reuse Component MatchGenerator yang sudah dibuat */}
              <MatchGenerator />
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
