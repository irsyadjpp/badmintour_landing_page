import { NextRequest, NextResponse } from "next/server";
import { exchangeTikTokCodeForToken, getTikTokUserInfo } from "@/lib/tiktok";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
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
    // 1. Exchange Code for Token
    const tokenData = await exchangeTikTokCodeForToken(code);

    // 2. Fetch User Info (Optional, but good for verification)
    const userInfo = await getTikTokUserInfo(tokenData.access_token);

    // 3. Save to Firestore (tiktok_integration)
    await setDoc(doc(db, "system_config", "tiktok_integration"), {
      platform: 'tiktok',
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt: Date.now() + (tokenData.expires_in * 1000), // usually 24h
      refreshTokenExpiresAt: Date.now() + (tokenData.refresh_expires_in * 1000), // usually 1 year
      tiktokOpenId: tokenData.open_id,
      displayName: userInfo.display_name,
      avatarUrl: userInfo.avatar_url,
      connectedAt: new Date().toISOString(),
      connectedBy: session.user.email,
      updatedAt: new Date().toISOString()
    });

    // 4. Redirect back to Dashboard with Success
    return NextResponse.redirect(new URL('/social-admin/dashboard?tiktok_connected=true', req.url));

  } catch (err: any) {
    console.error("TikTok Auth Error:", err);
    return NextResponse.redirect(new URL(`/social-admin/dashboard?error=${encodeURIComponent(err.message)}`, req.url));
  }
}
