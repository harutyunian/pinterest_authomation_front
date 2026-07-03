import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ytmp3Tokens as t } from '../theme/ytmp3-tokens';
import { FloatingActionCard } from './ytmp3/FloatingActionCard';
import { PublicPageShell } from './ytmp3/PublicPageShell';

export function AuthLayout() {
  return (
    <PublicPageShell
      title="Sign in to your account"
      subtitle="Manage Pinterest automation from one dashboard."
      card={
        <FloatingActionCard maxWidth={420}>
          <Outlet />
        </FloatingActionCard>
      }
      footer={
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Box component="span" sx={{ color: t.textMuted, fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} Social Automation
          </Box>
        </Box>
      }
    />
  );
}
