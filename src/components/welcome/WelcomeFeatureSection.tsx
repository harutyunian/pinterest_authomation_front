import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Box, Stack, Typography } from '@mui/material';
import { glassCardSx, LANDING_FONT } from './welcomeStyles';

const stats = ['5+ platforms', 'AI content', 'Scheduled posts'] as const;

const features = [
  {
    icon: <ScheduleIcon />,
    title: 'Smart scheduling',
    description: 'Plan and automate posts across your social channels.',
  },
  {
    icon: <AutoAwesomeIcon />,
    title: 'AI-powered content',
    description: 'Generate images and copy tailored to each platform.',
  },
  {
    icon: <PinterestIcon />,
    title: 'Pinterest ready',
    description: 'Pin creation and automation built in from day one.',
  },
];

export function WelcomeFeatureSection() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ flexWrap: 'wrap', justifyContent: 'center', mb: 5 }}
      >
        {stats.map((label) => (
          <Box
            key={label}
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontFamily: LANDING_FONT, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Typography
        variant="h5"
        sx={{
          fontFamily: LANDING_FONT,
          fontWeight: 700,
          textAlign: 'center',
          mb: 4,
          letterSpacing: '-0.02em',
        }}
      >
        Why Social Automation
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        sx={{ justifyContent: 'center' }}
      >
        {features.map((feature) => (
          <Box
            key={feature.title}
            sx={{
              flex: 1,
              maxWidth: 360,
              p: 3,
              ...glassCardSx,
              borderRadius: 4,
              textAlign: 'left',
              transition: 'transform 0.2s, border-color 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'rgba(255,255,255,0.18)',
              },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'rgba(230,0,35,0.15)',
                color: '#fda4af',
                mb: 2,
              }}
            >
              {feature.icon}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: LANDING_FONT, fontWeight: 700, mb: 0.5 }}
            >
              {feature.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              {feature.description}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
