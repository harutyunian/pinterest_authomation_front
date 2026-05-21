import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ScheduleIcon from '@mui/icons-material/Schedule';
import XIcon from '@mui/icons-material/X';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { fetchCiCdStatus } from '../api/ciCd';

const socialPlatforms = [
  { name: 'Pinterest', icon: PinterestIcon, color: '#E60023' },
  { name: 'Instagram', icon: InstagramIcon, color: '#E4405F' },
  { name: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
  { name: 'LinkedIn', icon: LinkedInIcon, color: '#0A66C2' },
  { name: 'X', icon: XIcon, color: '#000000' },
] as const;

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

export function WelcomePage() {
  const ciCdQuery = useQuery({
    queryKey: ['ci-cd-status'],
    queryFn: fetchCiCdStatus,
    retry: 1,
    staleTime: 60_000,
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(160deg, #0f0f14 0%, #1a1a2e 35%, #16213e 70%, #0f3460 100%)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230,0,35,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 6, md: 10 } }}>
        <Stack spacing={6} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
            label="Social media automation platform"
            sx={{
              bgcolor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontWeight: 600,
            }}
          />

          <Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                fontSize: { xs: '2.25rem', md: '3.5rem' },
                background: 'linear-gradient(90deg, #fff 0%, #e0e7ff 50%, #fda4af 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Social Automation
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                maxWidth: 560,
                mx: 'auto',
                color: 'rgba(255,255,255,0.72)',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              One place to schedule, create, and grow your presence across every major
              social network — powered by intelligent automation.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {socialPlatforms.map(({ name, icon: Icon, color }) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: 88,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${color}40`,
                  },
                }}
              >
                <Icon sx={{ fontSize: 40, color }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {name}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: '#E60023',
                '&:hover': { bgcolor: '#AD081B' },
              }}
            >
              Get started
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.35)',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              Sign in
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              border: '1px dashed rgba(255,255,255,0.2)',
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              API / CI·CD:
            </Typography>
            {ciCdQuery.isLoading && <CircularProgress size={18} sx={{ color: '#fff' }} />}
            {ciCdQuery.isError && (
              <Chip label="offline" size="small" color="error" variant="outlined" />
            )}
            {ciCdQuery.isSuccess && (
              <Chip
                label={ciCdQuery.data}
                size="small"
                sx={{
                  bgcolor: 'rgba(34,197,94,0.2)',
                  color: '#86efac',
                  fontWeight: 600,
                  border: '1px solid rgba(34,197,94,0.4)',
                }}
              />
            )}
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ mt: 10, justifyContent: 'center' }}
        >
          {features.map((feature) => (
            <Box
              key={feature.title}
              sx={{
                flex: 1,
                maxWidth: 320,
                p: 3,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'left',
              }}
            >
              <Box sx={{ color: '#fda4af', mb: 1.5 }}>{feature.icon}</Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
