import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import XIcon from '@mui/icons-material/X';
import { Box, Typography } from '@mui/material';
import { glassCardSx, LANDING_FONT } from './welcomeStyles';

const socialPlatforms = [
  { name: 'Pinterest', icon: PinterestIcon, color: '#E60023' },
  { name: 'Instagram', icon: InstagramIcon, color: '#E4405F' },
  { name: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
  { name: 'LinkedIn', icon: LinkedInIcon, color: '#0A66C2' },
  { name: 'X', icon: XIcon, color: '#e7e9ea' },
] as const;

export function WelcomePlatformGrid() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: LANDING_FONT,
          fontWeight: 700,
          textAlign: 'center',
          mb: 3,
          letterSpacing: '-0.02em',
        }}
      >
        Supported platforms
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 2,
        }}
      >
        {socialPlatforms.map(({ name, icon: Icon, color }) => (
          <Box
            key={name}
            sx={{
              ...glassCardSx,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              p: 2.5,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: `0 12px 32px ${color}40`,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: `2px solid ${color}66`,
                bgcolor: 'rgba(255,255,255,0.04)',
              }}
            >
              <Icon sx={{ fontSize: 32, color }} />
            </Box>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.75)', fontFamily: LANDING_FONT, fontWeight: 600 }}
            >
              {name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
