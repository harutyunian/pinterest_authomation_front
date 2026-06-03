export type PlatformId = 'pinterest' | 'instagram' | 'facebook' | 'linkedin' | 'x';

export const NAV_LINKS = [
  { label: 'Features', href: '#features', active: false },
  { label: 'Solutions', href: '#', active: false },
  { label: 'Pricing', href: '#pricing', active: false },
] as const;

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
    iconBgClass: 'bg-white/10',
    iconColorClass: 'text-white',
  },
];

export const STAT_PILLS = ['5+ platforms', 'AI content', 'Scheduled posts'] as const;

export const FEATURES = [
  {
    icon: { type: 'material' as const, name: 'schedule' },
    title: 'Smart scheduling',
    description:
      'Plan and automate posts across your social channels. Our algorithm finds the best time to reach your audience.',
    iconBgClass: 'bg-landing-primary-container/20 text-landing-primary-container',
    cardClass: '',
  },
  {
    icon: { type: 'material' as const, name: 'auto_awesome' },
    title: 'AI-powered content',
    description:
      'Generate images and copy tailored to each platform. Professional posts created in seconds, not hours.',
    iconBgClass: 'bg-landing-primary-container text-landing-on-primary-container shadow-lg shadow-landing-primary-container/20',
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

export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 20,
    period: 'month',
    description: 'For individuals getting started with social automation.',
    features: [
      '2 connected platforms',
      '50 scheduled posts / month',
      'Basic AI content generation',
      'Email support',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 40,
    period: 'month',
    description: 'For creators and small teams scaling their presence.',
    features: [
      'All 5 platforms',
      'Unlimited scheduled posts',
      'Advanced AI content & images',
      'Analytics dashboard',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 245,
    period: 'month',
    description: 'For agencies and brands with high-volume needs.',
    features: [
      'Unlimited team members',
      'Multi-account management',
      'Custom AI workflows',
      'Dedicated account manager',
      'SLA & API access',
    ],
    highlighted: false,
  },
] as const;

export const FOOTER_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Documentation', href: '#' },
] as const;
