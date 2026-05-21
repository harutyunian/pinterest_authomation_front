import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PinIcon from '@mui/icons-material/PushPin';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { getMe } from '../api/auth';
import { ScheduleSettingsCard } from '../components/ScheduleSettingsCard';
import { useAuthStore } from '../stores/authStore';

const featureCards = [
  {
    title: 'Pin Scheduler',
    description: 'Schedule and publish pins automatically to your boards.',
    icon: <PinIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    status: 'Configured below',
    link: null as string | null,
  },
  {
    title: 'Content Generator',
    description: 'AI home decor title ideas, descriptions, hashtags, and images.',
    icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    status: 'Open Pin Creator',
    link: '/pin-creator',
    adminOnly: true,
  },
  {
    title: 'Campaign Calendar',
    description: 'Plan campaigns and track posting cadence across boards.',
    icon: <CalendarMonthIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    status: 'Coming soon',
    link: null,
  },
];

export function DashboardPage() {
  const storedUser = useAuthStore((s) => s.user);
  const isAdmin = storedUser?.role === 'admin';

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    initialData: storedUser ?? undefined,
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        {isLoading ? (
          <Skeleton variant="text" width={300} height={40} />
        ) : (
          <>
            <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
              Hello, {user?.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You are signed in and ready to automate Pinterest.
              </Typography>
              {user?.role === 'admin' && (
                <Chip label="Administrator" color="primary" size="small" />
              )}
            </Box>
          </>
        )}
      </Box>

      <ScheduleSettingsCard />

      <Grid container spacing={3}>
        {featureCards
          .filter((card) => !('adminOnly' in card && card.adminOnly) || isAdmin)
          .map((card) => (
          <Grid key={card.title} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(230,0,35,0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                {card.link ? (
                  <Button
                    component={RouterLink}
                    to={card.link}
                    size="small"
                    variant="outlined"
                  >
                    {card.status}
                  </Button>
                ) : (
                  <Chip label={card.status} size="small" variant="outlined" />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
