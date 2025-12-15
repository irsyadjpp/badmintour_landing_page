'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BookingWidgetProps {
  totalSlots: number;
  currentParticipants: number;
  waitlistCount: number;
  minLevel: 'Beginner' | 'Intermediate' | 'Advance';
  userLevel: 'Beginner' | 'Intermediate' | 'Advance'; // Simulasi level user yang login
  price: number;
}

export default function BookingWidget({
  totalSlots = 12,
  currentParticipants = 8,
  waitlistCount = 0,
  minLevel = 'Intermediate',
  userLevel = 'Beginner', // Coba ubah ini jadi 'Intermediate' untuk tes unlock
  price
}: BookingWidgetProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [localParticipants, setLocalParticipants] = useState(currentParticipants);
  const [localWaitlist, setLocalWaitlist] = useState(waitlistCount);

  const isFull = localParticipants >= totalSlots;
  const progressPercentage = (localParticipants / totalSlots) * 100;

  // Cek apakah user memenuhi syarat level
  const levels = ['Beginner', 'Intermediate', 'Advance'];
  const isLevelEligible = levels.indexOf(userLevel) >= levels.indexOf(minLevel);

  const handleJoin = () => {
    if (!isLevelEligible) return;

    if (isFull) {
      setLocalWaitlist(prev => prev + 1);
      alert("Kamu masuk antrian prioritas! Kami akan kabari jika ada slot kosong.");
    } else {
      setLocalParticipants(prev => prev + 1);
      setIsJoined(true);
    }
  };

  return (
    <Card className="w-full max-w-md border-2 shadow-lg">
      <CardHeader className="bg-muted/20 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-black uppercase">Daftar Mabar</CardTitle>
          <Badge variant="outline" className="font-bold border-primary text-primary">
            Rp {price.toLocaleString('id-ID')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        
        {/* Status Slot */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Kuota Pemain</span>
            <span className={isFull ? "text-destructive" : "text-primary"}>
              {localParticipants}/{totalSlots} {isFull && `(+${localWaitlist} Antri)`}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-4 rounded-full bg-secondary" />
        </div>

        {/* Level Requirement Alert */}
        {!isLevelEligible && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <Lock className="h-4 w-4" />
            <AlertTitle>Level Terkunci</AlertTitle>
            <AlertDescription>
              Event ini khusus level <b>{minLevel}</b> ke atas. Level kamu saat ini: <b>{userLevel}</b>.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        {!isJoined ? (
          <Button 
            className="w-full h-12 text-lg font-bold rounded-xl shadow-md"
            size="lg"
            disabled={!isLevelEligible}
            variant={isFull ? "outline" : "default"}
            onClick={handleJoin}
          >
            {isFull ? "Join Waitlist (Antri)" : "Amankan Slot"}
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <p className="font-bold text-green-700 dark:text-green-400">Kamu Terdaftar!</p>
            <p className="text-xs text-muted-foreground">Tunjukkan QR Code saat di lapangan.</p>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          *Pembatalan maksimal 24 jam sebelum jadwal main.
        </p>
      </CardContent>
    </Card>
  );
}
