export interface InstagramToken {
  access_token: string;
  token_type: string;
  expires_in: number; // Seconds
  user_id?: string;
}

export interface SocialIntegrationConfig {
  userId: string; // The Badmintour Admin User ID who connected this
  platform: 'instagram' | 'tiktok';
  accessToken: string;
  tokenExpiresAt: number; // Timestamp (Date.now() + expires_in * 1000)
  instagramBusinessAccountId?: string;
  facebookPageId?: string;
  tiktokOpenId?: string; // New field for TikTok
  connectedAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface InstagramUserInfo {
  id: string;
  name: string;
  username: string;
}
