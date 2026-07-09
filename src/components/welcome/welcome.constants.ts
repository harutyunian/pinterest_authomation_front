export type PlatformId = 'pinterest' | 'instagram' | 'facebook' | 'linkedin' | 'x';

export type NavLink =
  | { label: string; to: string; active?: boolean }
  | { label: string; href: string; active?: boolean };

export const NAV_LINKS: NavLink[] = [
  { label: 'Tools', href: '/tools' },
  { label: 'Features', href: '#features', active: false },
  { label: 'Solutions', href: '#', active: false },
];

export const QUEUE_PREVIEW_ITEMS = [
  'Pinterest pin — Tue 9:00',
  'Instagram reel — Wed 14:00',
  'LinkedIn post — Fri 10:00',
] as const;

export const PLATFORMS: {
  id: PlatformId;
  name: string;
  iconBgClass: string;
  iconColorClass: string;
}[] = [
  {
    id: 'pinterest',
    name: 'Pinterest',
    iconBgClass: 'bg-[#E60023]/10',
    iconColorClass: 'text-[#E60023]',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    iconBgClass: 'bg-gradient-to-tr from-[#f9ce34]/20 via-[#ee2a7b]/20 to-[#6228d7]/20',
    iconColorClass: 'text-white',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    iconBgClass: 'bg-[#1877F2]/10',
    iconColorClass: 'text-[#1877F2]',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    iconBgClass: 'bg-[#0A66C2]/10',
    iconColorClass: 'text-[#0A66C2]',
  },
  {
    id: 'x',
    name: 'X',
    iconBgClass: 'bg-gray-100',
    iconColorClass: 'text-[var(--ytmp3-text)]',
  },
];

export const STAT_PILLS = ['5+ platforms', 'AI content', 'Scheduled posts'] as const;

export const FEATURES = [
  {
    icon: { type: 'material' as const, name: 'schedule' },
    title: 'Smart scheduling',
    description:
      'Plan and automate posts across your social channels. Our algorithm finds the best time to reach your audience.',
    iconBgClass: 'bg-landing-primary/10 text-landing-primary',
    cardClass: '',
  },
  {
    icon: { type: 'material' as const, name: 'auto_awesome' },
    title: 'AI-powered content',
    description:
      'Generate images and copy tailored to each platform. Professional posts created in seconds, not hours.',
    iconBgClass: 'bg-landing-primary text-landing-on-primary',
    cardClass: 'border-landing-primary/20',
  },
  {
    icon: { type: 'platform' as const, platformId: 'pinterest' as PlatformId },
    title: 'Pinterest ready',
    description:
      'Pin creation and automation built in from day one. Scale your traffic with visually stunning boards and optimized pins.',
    iconBgClass: 'bg-[#E60023]/20 text-[#E60023]',
    cardClass: '',
  },
] as const;

export const FOOTER_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Documentation', href: '#' },
] as const;
