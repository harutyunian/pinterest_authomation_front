import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';
import { ToolHeroShell, type ToolHeroNavItem } from './ToolHeroShell';

type PublicPageShellProps = {
  logo?: string;
  title: string;
  subtitle?: string;
  nav?: ToolHeroNavItem[];
  card?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

const DEFAULT_NAV: ToolHeroNavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: 'Sign in', href: '/login' },
];

export function PublicPageShell({
  logo = 'Social Automation',
  title,
  subtitle,
  nav = DEFAULT_NAV,
  card,
  children,
  footer,
}: PublicPageShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: t.bodyBg }}>
      <ToolHeroShell logo={logo} title={title} subtitle={subtitle} nav={nav} />
      {card}
      {children}
      {footer ?? (
        <Box sx={{ py: 3, textAlign: 'center', px: 2 }}>
          <Typography variant="caption" sx={{ color: t.textMuted }}>
            © {new Date().getFullYear()} Social Automation
          </Typography>
        </Box>
      )}
    </Box>
  );
}
