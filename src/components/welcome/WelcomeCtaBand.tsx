import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LANDING_FONT } from './welcomeStyles';

export function WelcomeCtaBand() {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 6 },
        px: 3,
        borderRadius: 4,
        textAlign: 'center',
        background:
          'linear-gradient(135deg, rgba(230,0,35,0.2) 0%, rgba(99,102,241,0.25) 50%, rgba(30,27,75,0.6) 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontFamily: LANDING_FONT, fontWeight: 700, letterSpacing: '-0.02em', mb: 1 }}
      >
        Ready to automate?
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
        Start scheduling and creating content in minutes.
      </Typography>
      <Button
        component={RouterLink}
        to="/login"
        variant="contained"
        size="large"
        sx={{
          px: 4,
          bgcolor: '#E60023',
          fontFamily: LANDING_FONT,
          fontWeight: 600,
          '&:hover': { bgcolor: '#AD081B' },
        }}
      >
        Get started
      </Button>
    </Box>
  );
}
