import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PinIcon from '@mui/icons-material/PushPin';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TelegramIcon from '@mui/icons-material/Telegram';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Button,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { getMe } from '../api/auth';
import { getSchedule } from '../api/schedule';
import { getTelegramSettings } from '../api/telegram';
import { AdminCard } from '../components/layout/AdminCard';
import { KpiCard } from '../components/layout/KpiCard';
import { useAuthStore } from '../stores/authStore';

const featureCards = [
  {
    title: 'Pin Creator',
    description: 'AI home decor titles, descriptions, hashtags, and vertical pin images.',
    icon: <PinIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    link: '/pin-creator',
    cta: 'Open Pinterest',
    adminOnly: true,
  },
  {
    title: 'Content Studio',
    description: 'Generate images, videos, and character replacements with Gemini.',
    icon: <AutoAwesomeIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    link: '/image-generator',
    cta: 'Open Studio',
    adminOnly: true,
  },
  {
    title: 'Telegram',
    description: 'Bot connection, channel posting, and interval scheduling.',
    icon: <TelegramIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    link: '/telegram',
    cta: 'Configure',
    adminOnly: true,
  },
  {
    title: 'Schedule',
    description: 'Pinterest automatic posting interval and timezone.',
    icon: <ScheduleIcon sx={{ fontSize: 28, color: 'primary.main' }} />,
    link: '/settings',
    cta: 'Settings',
    adminOnly: false,
  },
];

export function DashboardPage() {
  const storedUser = useAuthStore((s) => s.user);
  const isAdmin = storedUser?.role === 'admin';
  const userId = storedUser?.id;

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    initialData: storedUser ?? undefined,
  });

  const { data: schedule } = useQuery({
    queryKey: ['schedule', userId],
    queryFn: getSchedule,
    enabled: Boolean(userId),
  });

  const { data: telegram } = useQuery({
    queryKey: ['telegram-settings', userId],
    queryFn: getTelegramSettings,
    enabled: Boolean(userId) && isAdmin,
  });

  const postsPerDay = schedule?.enabled
    ? Math.floor(24 / (schedule.intervalHours || 5))
    : 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        {isLoading ? (
          <Skeleton variant="text" width={300} height={40} />
        ) : (
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1" color="text.secondary">
              Welcome back, <strong>{user?.username}</strong>
            </Typography>
            {user?.role === 'admin' && (
              <Chip label="Administrator" color="primary" size="small" />
            )}
          </Stack>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Pinterest schedule"
            value={schedule?.enabled ? `${postsPerDay}/day` : 'Paused'}
            change={schedule?.enabled ? 'Active' : 'Off'}
            positive={Boolean(schedule?.enabled)}
            icon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Post interval"
            value={schedule ? `${schedule.intervalHours}h` : '—'}
            change={schedule?.timezone?.split('/').pop() ?? 'Timezone'}
            positive
            icon={<ScheduleIcon sx={{ fontSize: 20 }} />}
          />
        </Grid>
        {isAdmin && (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                label="Telegram bot"
                value={telegram?.enabled ? 'Active' : 'Paused'}
                change={telegram?.scheduleEnabled ? 'Auto-post on' : 'Manual'}
                positive={Boolean(telegram?.enabled)}
                icon={<TelegramIcon sx={{ fontSize: 20 }} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard
                label="Campaigns"
                value="—"
                change="Coming soon"
                positive={false}
                icon={<PinIcon sx={{ fontSize: 20 }} />}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, mb: 2, display: 'block' }}>
        Quick actions
      </Typography>
      <Grid container spacing={2}>
        {featureCards
          .filter((card) => !card.adminOnly || isAdmin)
          .map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <AdminCard
                sx={{
                  height: '100%',
                  transition: 'border-color 0.2s, transform 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{card.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {card.description}
                </Typography>
                <Button component={RouterLink} to={card.link} size="small" variant="outlined">
                  {card.cta}
                </Button>
              </AdminCard>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
