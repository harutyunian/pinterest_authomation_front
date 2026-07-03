import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { ytmp3Tokens as t } from '../theme/ytmp3-tokens';
import { PublicPageShell } from './ytmp3/PublicPageShell';

export function PublicToolsLayout() {
  return (
    <PublicPageShell
      logo="Free Tools"
      title="Free online tools"
      subtitle="AI image generation and more — no account required."
      nav={[
        { label: 'All tools', href: '/tools' },
        { label: 'Home', href: '/' },
        { label: 'Sign in', href: '/login' },
      ]}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          mt: `${t.cardOverlap}px`,
          px: `${t.gutter}px`,
          pb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            bgcolor: t.surface,
            borderRadius: `${t.radius}px`,
            boxShadow: t.shadow,
            p: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Box sx={{ py: 3, textAlign: 'center', borderTop: `1px solid ${t.borderLight}` }}>
        <Typography variant="caption" sx={{ color: t.textMuted }}>
          <Link component={RouterLink} to="/privacy" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          {' · '}
          Need automation?{' '}
          <Link component={RouterLink} to="/login" underline="hover" sx={{ color: t.primary }}>
            Create an account
          </Link>
        </Typography>
      </Box>
    </PublicPageShell>
  );
}
