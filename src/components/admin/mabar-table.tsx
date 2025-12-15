'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Settings, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipe data dummy untuk contoh
const mabarSessions = [
  { id: "M001", date: "2024-08-24", time: "20:00", location: "GOR Cikutra", participants: 12, maxSlot: 12, status: "Full" },
  { id: "M002", date: "2024-08-27", time: "19:00", location: "GOR Koni", participants: 8, maxSlot: 12, status: "Open" },
  { id: "M003", date: "2024-08-31", time: "08:00", location: "Pro Arena", participants: 2, maxSlot: 16, status: "Open" },
];

export default function AdminMabarTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Manajemen Jadwal Mabar</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Buat Jadwal Baru
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Kuota</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mabarSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold">{session.date}</span>
                    <span className="text-xs text-muted-foreground">{session.time} WIB</span>
                  </div>
                </TableCell>
                <TableCell>{session.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">
                        {session.participants}/{session.maxSlot}
                    </span>
                    {/* Visual bar sederhana */}
                    <div className="h-2 w-16 rounded-full bg-secondary overflow-hidden">
                        <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(session.participants / session.maxSlot) * 100}%` }} 
                        />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={session.status === "Full" ? "destructive" : "default"} className={session.status === "Open" ? "bg-green-600 hover:bg-green-700" : ""}>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem> <Settings className="mr-2 h-4 w-4"/> Kelola Sesi (Check-in)</DropdownMenuItem>
                      <DropdownMenuItem>Edit Jadwal</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Batalkan Sesi</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
