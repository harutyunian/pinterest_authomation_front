import PinterestIcon from '@mui/icons-material/Pinterest';
import TelegramIcon from '@mui/icons-material/Telegram';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GeminiKeysSection } from '../components/settings/GeminiKeysSection';
import { ScheduleSettingsCard } from '../components/ScheduleSettingsCard';
import { AdminCard } from '../components/layout/AdminCard';

function ConnectedAccountRow({
  name,
  description,
  status,
  statusColor,
  actionLabel,
  actionTo,
}: {
  name: string;
  description: string;
  status: string;
  statusColor: 'success' | 'default' | 'warning';
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <AdminCard padding={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <Chip label={status} size="small" color={statusColor} />
          <Typography
            component={RouterLink}
            to={actionTo}
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {actionLabel} →
          </Typography>
        </Stack>
      </Stack>
    </AdminCard>
  );
}

export function SettingsPage() {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>
        Connected accounts
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <ConnectedAccountRow
          name="Pinterest"
          description="OAuth connection and board publishing for pins"
          status="Configure in Pin Creator"
          statusColor="default"
          actionLabel="Open Pinterest"
          actionTo="/pin-creator"
        />
        <ConnectedAccountRow
          name="Telegram"
          description="Bot token, channel ID, and scheduled posting"
          status="Manage channel"
          statusColor="default"
          actionLabel="Open Telegram"
          actionTo="/telegram"
        />
      </Stack>

      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>
        Automation engine
      </Typography>
      <Box sx={{ mb: 4 }}>
        <ScheduleSettingsCard embedded />
      </Box>

      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>
        API configuration
      </Typography>
      <GeminiKeysSection />

      <Stack direction="row" spacing={2} sx={{ mt: 3, opacity: 0.5, justifyContent: 'center' }}>
        <PinterestIcon fontSize="small" />
        <TelegramIcon fontSize="small" />
      </Stack>
    </Box>
  );
}
