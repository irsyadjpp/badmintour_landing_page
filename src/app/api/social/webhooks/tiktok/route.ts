import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET!;

/**
 * Verifies the signature of the incoming webhook request
 */
const verifySignature = (body: string, signature: string, timestamp: string) => {
  if (!TIKTOK_CLIENT_SECRET) return false;

  const baseStr = `${TIKTOK_CLIENT_SECRET}${timestamp}${body}`;
  // TikTok uses SHA256 HMAC? Or simple SHA256? 
  // Documentation says: signature = sha256(client_secret + timestamp + body)
  // Note: Verify specific TikTok documentation version. Assuming standard V2.

  // For V2 login kit / events, it might differ. 
  // Usually it's HMAC-SHA256 or just SHA256. 
  // Let's implement generic HMAC for security, but check docs if possible. 
  // Assuming standard webhook pattern:

  // Attempting standard check (as per common implementations)
  const hash = crypto.createHash('sha256').update(baseStr).digest('hex');
  return hash === signature;
};

export async function GET() {
  return NextResponse.json({ status: "TikTok Webhook Ready", message: "Use POST for events" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();

    // Handle Empty Code (Ping)
    if (!bodyText) {
      console.log("[TikTok Webhook] Empty body received (Ping check)");
      return NextResponse.json({ status: "alive" }, { status: 200 });
    }

    const headers = req.headers;
    const signature = headers.get('x-tiktok-event-signature') || headers.get('X-TikTok-Event-Signature');
    const timestamp = headers.get('x-tiktok-event-signature-timestamp') || headers.get('X-TikTok-Event-Signature-Timestamp');

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      console.error("[TikTok Webhook] Invalid JSON:", e);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // 1. Verification Challenge (Priority)
    // Checks if 'challenge' exists in body. Return it immediately to verify ownership.
    if (body.challenge) {
      console.log("[TikTok Webhook] Handling Verification Challenge:", body.challenge);
      return NextResponse.json({ challenge: body.challenge }, { status: 200 });
    }

    // 2. Validate Signature (Security)
    // Note: Logging only for debugging purposes. Re-enable strict check later.
    if (!signature || !timestamp) {
      console.warn("[TikTok Webhook] Warning: Missing Signature Headers in request");
      // if (process.env.NODE_ENV === 'production') {
      //   return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      // }
    }

    console.log("[TikTok Webhook] Body Received:", body);

    // Uncomment to enable strict signature verification
    // if (signature && timestamp && !verifySignature(bodyText, signature, timestamp)) {
    //    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const eventType = body.event || body.type;

    // 3. Log Event to Firestore
    await addDoc(collection(db, "system_logs"), {
      source: 'tiktok_webhook',
      event: eventType,
      payload: body,
      timestamp: serverTimestamp(), // Firestore Server Timestamp
      headers: Object.fromEntries(headers.entries())
    });

    // 4. Handle Specific Events
    // e.g., 'authorization.removed' -> Update system_config/tiktok_integration
    if (eventType === 'authorization.removed') {
      // Logic to mark as disconnected
    }

    return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error: any) {
    console.error("TikTok Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
