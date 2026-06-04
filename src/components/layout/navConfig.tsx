import type { ReactNode } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpIcon from '@mui/icons-material/Help';
import PinIcon from '@mui/icons-material/PushPin';
import SettingsIcon from '@mui/icons-material/Settings';
import TelegramIcon from '@mui/icons-material/Telegram';

export type NavItem = {
  id: string;
  label: string;
  path?: string;
  icon: ReactNode;
  adminOnly?: boolean;
  accentTitle?: boolean;
  children?: { label: string; path: string }[];
};

export const mainNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon sx={{ fontSize: 20 }} />,
  },
  {
    id: 'content-studio',
    label: 'Content Studio',
    path: '/image-generator',
    icon: <AutoAwesomeIcon sx={{ fontSize: 20 }} />,
    adminOnly: true,
    accentTitle: true,
    children: [
      { label: 'Image Generator', path: '/image-generator' },
      { label: 'AI Video', path: '/video-generator' },
      { label: 'Character Swap', path: '/character-replacement' },
      { label: 'Stored Videos', path: '/stored-videos' },
    ],
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    path: '/pin-creator',
    icon: <PinIcon sx={{ fontSize: 20 }} />,
    adminOnly: true,
    accentTitle: true,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    path: '/telegram',
    icon: <TelegramIcon sx={{ fontSize: 20 }} />,
    adminOnly: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <SettingsIcon sx={{ fontSize: 20 }} />,
    adminOnly: true,
  },
];

export const bottomNavItems = [
  {
    id: 'support',
    label: 'Support',
    href: 'mailto:support@example.com',
    icon: <HelpIcon sx={{ fontSize: 20 }} />,
  },
] as const;

export const pageTitles: Record<string, { title: string; subtitle?: string; accent?: boolean }> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Overview of your automation workspace',
  },
  '/image-generator': {
    title: 'Content Studio',
    subtitle: 'Generate images with Gemini',
    accent: true,
  },
  '/video-generator': {
    title: 'Content Studio',
    subtitle: 'AI video generation',
    accent: true,
  },
  '/character-replacement': {
    title: 'Content Studio',
    subtitle: 'Character replacement in video',
    accent: true,
  },
  '/stored-videos': {
    title: 'Content Studio',
    subtitle: 'Your stored video assets',
    accent: true,
  },
  '/pin-creator': {
    title: 'Pinterest Automation',
    subtitle: 'Create and publish home decor pins',
    accent: true,
  },
  '/telegram': {
    title: 'Telegram',
    subtitle: 'Channel bot and posting schedule',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'API keys, scheduling, and connected services',
  },
  '/gemini-keys': {
    title: 'Settings',
    subtitle: 'API keys and automation',
  },
};

/** Legacy paths for Content Studio sub-routes */
const contentStudioPaths = new Set([
  '/image-generator',
  '/video-generator',
  '/character-replacement',
  '/stored-videos',
]);

export function isContentStudioPath(path: string) {
  return contentStudioPaths.has(path);
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.path === pathname) return true;
  if (item.children?.some((c) => c.path === pathname)) return true;
  if (item.id === 'content-studio' && isContentStudioPath(pathname)) return true;
  return false;
}
