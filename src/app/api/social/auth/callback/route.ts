import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getConnectedInstagramAccount, getLongLivedToken } from "@/lib/instagram";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/social-admin/dashboard?error=${error}`, req.url));
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    // 1. Exchange Code for Short-Lived Token
    const shortToken = await exchangeCodeForToken(code);

    // 2. Exchange for Long-Lived Token (60 days)
    const longToken = await getLongLivedToken(shortToken.access_token);

    // 3. Get Instagram Business Account ID
    const accountInfo = await getConnectedInstagramAccount(longToken.access_token);

    // 4. Save to Firestore
    // We use a singleton document for simplicity in this MVP, 
    // assuming one global Instagram account for the platform.
    // Or we could store it under `system_config/instagram`.

    await setDoc(doc(db, "system_config", "social_integration"), {
      platform: 'instagram',
      accessToken: longToken.access_token,
      tokenExpiresAt: Date.now() + (longToken.expires_in * 1000),
      instagramBusinessAccountId: accountInfo.instagramBusinessAccountId,
      facebookPageId: accountInfo.facebookPageId,
      connectedAt: new Date().toISOString(),
      connectedBy: session.user.email,
      updatedAt: new Date().toISOString()
    });

    // 5. Redirect back to Dashboard with Success
    return NextResponse.redirect(new URL('/social-admin/dashboard?connected=true', req.url));

  } catch (err: any) {
    console.error("Instagram Auth Error:", err);
    return NextResponse.redirect(new URL(`/social-admin/dashboard?error=${encodeURIComponent(err.message)}`, req.url));
  }
}
