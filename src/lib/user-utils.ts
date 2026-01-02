import { db } from "@/lib/firebase-admin";
import { UserCategory } from "./pricing";

export async function getUserCategory(userId: string | null | undefined, isStudentClaim: boolean = false): Promise<UserCategory> {
  // 1. Jika tidak login / Walk-in / Drop-in
  if (!userId) {
    return 'drop_in';
  }

  try {
    // 2. Cek Data User (Apakah Pelajar?)
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Prioritas status Pelajar (jika ada flag di database atau claim saat booking)
    // Verifikasi dilakukan oleh Admin nanti, tapi sistem memberi harga estimasi dulu?
    // Atau hanya jika verified? Prompt says "Anda harus verifikasi Kartu Pelajar..."
    // Let's assume for price check we check the 'studentVerified' flag or 'role'.
    if (userData?.role === 'student' || (userData?.studentVerified === true)) {
      return 'student';
    }

    // 3. Cek Riwayat Booking Drilling (Untuk membedakan Trial vs Member)
    // Trial = First Time (Belum ada booking 'drilling' statud 'paid'/'confirmed')
    const historySnapshot = await db.collection('bookings')
      .where('userId', '==', userId)
      .where('type', '==', 'drilling') // Pastikan field type ada di booking
      .where('status', 'in', ['paid', 'confirmed', 'approved', 'CONFIRMED']) // Check valid statuses
      .limit(1)
      .get();

    if (historySnapshot.empty) {
      return 'trial'; // Belum pernah drilling berbayar
    } else {
      return 'member'; // Sudah pernah drilling (Repeat Order)
    }

  } catch (error) {
    console.error("Error getting user category:", error);
    return 'normal'; // Fallback
  }
}
