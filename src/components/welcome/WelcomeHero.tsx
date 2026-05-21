import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ScheduleIcon from '@mui/icons-material/Schedule';
import XIcon from '@mui/icons-material/X';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { glassCardSx, LANDING_FONT } from './welcomeStyles';

const previewPlatforms = [
  { icon: PinterestIcon, color: '#E60023' },
  { icon: InstagramIcon, color: '#E4405F' },
  { icon: FacebookIcon, color: '#1877F2' },
  { icon: LinkedInIcon, color: '#0A66C2' },
  { icon: XIcon, color: '#e7e9ea' },
] as const;

export function WelcomeHero() {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 4, md: 6 }}
      sx={{ alignItems: 'center', py: { xs: 4, md: 6 } }}
    >
      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
        <Chip
          icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
          label="Social media automation platform"
          sx={{
            mb: 3,
            bgcolor: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontWeight: 600,
            fontFamily: LANDING_FONT,
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontFamily: LANDING_FONT,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            lineHeight: 1.1,
            background: 'linear-gradient(90deg, #fff 0%, #e0e7ff 50%, #fda4af 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Automate every channel from one dashboard
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            maxWidth: 520,
            mx: { xs: 'auto', md: 0 },
            color: 'rgba(255,255,255,0.72)',
            fontWeight: 400,
            lineHeight: 1.6,
            fontFamily: LANDING_FONT,
          }}
        >
          Schedule posts, generate AI content, and grow your presence across every major
          social network — without switching tools.
        </Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            px: 4,
            py: 1.5,
            bgcolor: '#E60023',
            fontFamily: LANDING_FONT,
            fontWeight: 600,
            '&:hover': { bgcolor: '#AD081B' },
          }}
        >
          Get started
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 480,
          ...glassCardSx,
          borderRadius: 4,
          p: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Typography
          variant="overline"
          sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: LANDING_FONT, letterSpacing: 1 }}
        >
          Automation preview
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontFamily: LANDING_FONT, fontWeight: 700, mt: 0.5, mb: 2 }}
        >
          This week&apos;s queue
        </Typography>
        <Stack spacing={1.5}>
          {['Pinterest pin — Tue 9:00', 'Instagram reel — Wed 14:00', 'LinkedIn post — Fri 10:00'].map(
            (item) => (
              <Box
                key={item}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <ScheduleIcon sx={{ fontSize: 20, color: '#a5b4fc' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {item}
                </Typography>
              </Box>
            ),
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap', mt: 3, justifyContent: 'center' }}
        >
          {previewPlatforms.map(({ icon: Icon, color }, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: `2px solid ${color}55`,
                bgcolor: 'rgba(255,255,255,0.04)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.08)' },
              }}
            >
              <Icon sx={{ fontSize: 22, color }} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
