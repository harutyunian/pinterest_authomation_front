import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LANDING_FONT } from './welcomeStyles';

export function WelcomeNav() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(11,13,18,0.72)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <AutoAwesomeIcon sx={{ color: '#E60023', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: LANDING_FONT,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#fff',
              }}
            >
              Social Automation
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            size="small"
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.35)',
              fontFamily: LANDING_FONT,
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.06)' },
            }}
          >
            Sign in
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
