import { InstagramToken } from "@/types/social-integration";

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/social/auth/callback`;

/**
 * Generates the "Login with Facebook" URL asking for necessary permissions.
 */
export const getInstagramLoginUrl = () => {
  if (!FACEBOOK_APP_ID) throw new Error("Missing NEXT_PUBLIC_FACEBOOK_APP_ID");

  const scopes = [
    'public_profile',
    'instagram_basic',
    'instagram_content_publish',
    'pages_show_list',
    'pages_read_engagement'
  ].join(',');

  const url = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  url.searchParams.append('client_id', FACEBOOK_APP_ID);
  url.searchParams.append('redirect_uri', REDIRECT_URI);
  url.searchParams.append('scope', scopes);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('state', 'social_admin_connect'); // CSRF protection simple mock

  return url.toString();
};

/**
 * Exchanges the Authorization Code for a Short-Lived Access Token.
 */
export const exchangeCodeForToken = async (code: string): Promise<InstagramToken> => {
  if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) throw new Error("Missing App Credentials");

  const url = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
  url.searchParams.append('client_id', FACEBOOK_APP_ID);
  url.searchParams.append('redirect_uri', REDIRECT_URI);
  url.searchParams.append('client_secret', FACEBOOK_APP_SECRET);
  url.searchParams.append('code', code);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data as InstagramToken;
};

/**
 * Exchanges a Short-Lived Token for a Long-Lived Token (60 Days).
 */
export const getLongLivedToken = async (shortLivedToken: string): Promise<InstagramToken> => {
  if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) throw new Error("Missing App Credentials");

  const url = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
  url.searchParams.append('grant_type', 'fb_exchange_token');
  url.searchParams.append('client_id', FACEBOOK_APP_ID);
  url.searchParams.append('client_secret', FACEBOOK_APP_SECRET);
  url.searchParams.append('fb_exchange_token', shortLivedToken);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  return data as InstagramToken;
};

/**
 * Validates the token and fetches connected Pages & Instagram Accounts.
 * This is crucial to get the `instagram_business_account_id`.
 */
export const getConnectedInstagramAccount = async (accessToken: string) => {
  // 1. Get User's Pages
  const pagesUrl = new URL('https://graph.facebook.com/v18.0/me/accounts');
  pagesUrl.searchParams.append('access_token', accessToken);
  pagesUrl.searchParams.append('fields', 'id,name,instagram_business_account{id,username}');

  const res = await fetch(pagesUrl.toString());
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  // Find the first page that has an Instagram Business Account connected
  const pageWithIg = data.data.find((p: any) => p.instagram_business_account);

  if (!pageWithIg) {
    throw new Error("No Instagram Business Account connected to your Facebook Pages.");
  }

  return {
    facebookPageId: pageWithIg.id,
    instagramBusinessAccountId: pageWithIg.instagram_business_account.id,
    instagramUsername: pageWithIg.instagram_business_account.username
  };
};
