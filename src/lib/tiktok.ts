import { InstagramToken } from "@/types/social-integration"; // We can reuse generic token structure or define specific one

const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/social/auth/tiktok/callback`;

/**
 * Generates the "Login with TikTok" URL.
 */
export const getTikTokLoginUrl = () => {
  if (!TIKTOK_CLIENT_KEY) throw new Error("Missing NEXT_PUBLIC_TIKTOK_CLIENT_KEY");

  const csrfState = Math.random().toString(36).substring(2);
  const url = new URL('https://www.tiktok.com/v2/auth/authorize/');

  url.searchParams.append('client_key', TIKTOK_CLIENT_KEY);
  url.searchParams.append('scope', 'user.info.basic,video.list,video.upload');
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('redirect_uri', REDIRECT_URI);
  url.searchParams.append('state', csrfState);

  return url.toString();
};

/**
 * Exchanges the Authorization Code for an Access Token.
 */
export const exchangeTikTokCodeForToken = async (code: string) => {
  if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) throw new Error("Missing TikTok App Credentials");

  const url = 'https://open.tiktokapis.com/v2/oauth/token/';

  const params = new URLSearchParams();
  params.append('client_key', TIKTOK_CLIENT_KEY);
  params.append('client_secret', TIKTOK_CLIENT_SECRET);
  params.append('code', code);
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', REDIRECT_URI);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error_description || "Failed to exchange TikTok token");
  }

  return data; // contains access_token, expires_in, refresh_token, open_id
};

/**
 * Fetches Basic User Info (Display Name, Avatar)
 */
export const getTikTokUserInfo = async (accessToken: string) => {
  const url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name';

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await res.json();

  if (data.error && data.error.code !== 0) {
    throw new Error(data.error.message || "Failed to fetch TikTok user info");
  }

  return data.data.user;
};
