
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
import {
  MoreHorizontal,
  PlusCircle,
  FileDown,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Tipe data dummy untuk contoh
const members = [
  {
    id: "USR001",
    name: "Kevin Sanjaya",
    email: "kevin.sanjaya@example.com",
    avatar: "https://ui-avatars.com/api/?name=Kevin+Sanjaya&background=random",
    level: "Advance",
    joinDate: "2023-01-15",
    status: "Active",
  },
  {
    id: "USR002",
    name: "Siti Aisyah",
    email: "siti.aisyah@example.com",
    avatar: "https://ui-avatars.com/api/?name=Siti+Aisyah&background=random",
    level: "Beginner",
    joinDate: "2024-03-20",
    status: "Active",
  },
  {
    id: "USR003",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random",
    level: "Intermediate",
    joinDate: "2023-05-10",
    status: "Inactive",
  },
  {
    id: "USR004",
    name: "Marcus Gideon",
    email: "marcus.gideon@example.com",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Gideon&background=random",
    level: "Pro",
    joinDate: "2022-11-30",
    status: "Active",
  },
];

export default function MemberManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-bad-dark tracking-tight">Member Management</h1>
        <p className="text-muted-foreground">
          View, manage, and export member data.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Skill Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="rounded-full border"
                    />
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{member.level}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      member.status === "Active" ? "default" : "destructive"
                    }
                    className={
                      member.status === "Active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>{member.joinDate}</TableCell>
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Member</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Deactivate
                      </DropdownMenuItem>
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
