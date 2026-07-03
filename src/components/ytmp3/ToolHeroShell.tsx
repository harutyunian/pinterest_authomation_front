import { Box, Link, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

export type ToolHeroNavItem = { label: string; href: string };

type ToolHeroShellProps = {
  logo: string;
  title: string;
  subtitle?: string;
  nav?: ToolHeroNavItem[];
  children?: ReactNode;
};

export function ToolHeroShell({ logo, title, subtitle, nav = [], children }: ToolHeroShellProps) {
  return (
    <Box
      sx={{
        bgcolor: t.primary,
        color: t.onPrimary,
        minHeight: t.heroMinHeight,
        pb: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: t.containerMax,
          mx: 'auto',
          px: `${t.gutter}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
          gap: 2,
        }}
      >
        <Typography
          component="a"
          href="/"
          sx={{
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'inherit',
            textDecoration: 'none',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          {logo}
        </Typography>
        <Box
          component="nav"
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 2.5,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              underline="hover"
              sx={{ color: 'inherit', fontSize: '0.875rem' }}
            >
              {item.label}
            </Link>
          ))}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', px: 2, pt: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            color: 'inherit',
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: 'inherit', opacity: 0.95, fontSize: '1rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
}
