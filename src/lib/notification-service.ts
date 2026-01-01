import { adminDb } from '@/lib/firebase-admin';

export type NotificationType = 'ASSESSMENT_COMPLETED' | 'BOOKING_CONFIRMED' | 'PAYMENT_REMINDER' | 'LEVEL_UP';

interface SendNotificationParams {
  userId: string;
  userName?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: any;
}

/**
 * Mocks sending a notification (Email/WhatsApp) and saves to Firestore.
 */
export async function sendNotification({ userId, userName, type, title, message, link, metadata }: SendNotificationParams) {
  console.log(`[MOCK NOTIFICATION] To: ${userName || userId} | Type: ${type} | Title: ${title}`);

  try {
    // 1. Simpan di Firestore (Real Persistence)
    await adminDb.collection('notifications').add({
      userId,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: new Date(),
      metadata: metadata || {}
    });

    // 2. Mock External Service (Email/WA)
    // In a real app, we would call Twilio / SendGrid / Nodemailer here.
    console.log(`[MOCK EXTERNAL] Sending WA to User ${userId}: ${message}`);

    return true;
  } catch (error) {
    console.error("Failed to send notification:", error);
    return false;
  }
}
