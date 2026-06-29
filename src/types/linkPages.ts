export type LinkPageTheme = 'midnight' | 'rose' | 'ocean' | 'sunset' | 'ember';

export type LinkPlatform =
  | 'website'
  | 'instagram'
  | 'pinterest'
  | 'facebook'
  | 'linkedin'
  | 'x'
  | 'youtube'
  | 'tiktok'
  | 'telegram'
  | 'email'
  | 'custom';

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  platform: LinkPlatform;
  sortOrder: number;
  isActive: boolean;
};

export type LinkProfile = {
  id: string;
  slug: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  theme: LinkPageTheme;
  published: boolean;
  publicUrl: string;
  links: LinkItem[];
};

export const LINK_PLATFORMS: { value: LinkPlatform; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'email', label: 'Email' },
  { value: 'custom', label: 'Custom' },
];

export const LINK_THEMES: { value: LinkPageTheme; label: string; preview: string }[] = [
  { value: 'midnight', label: 'Midnight', preview: 'linear-gradient(135deg, #0d1012, #171b1f)' },
  { value: 'rose', label: 'Rose', preview: 'linear-gradient(135deg, #1a0b10, #3b1020)' },
  { value: 'ocean', label: 'Ocean', preview: 'linear-gradient(135deg, #07131f, #0d2a3f)' },
  { value: 'sunset', label: 'Sunset', preview: 'linear-gradient(135deg, #1f1028, #4a1f2f)' },
  { value: 'ember', label: 'Ember', preview: 'linear-gradient(135deg, #1a1008, #3a1f0d)' },
];
