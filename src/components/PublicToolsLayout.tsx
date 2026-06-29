import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LoginIcon from '@mui/icons-material/Login';
import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export function PublicToolsLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
          <Typography
            component="a"
            href="/tools"
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            Free Tools
          </Typography>
          <Button component={RouterLink} to="/" color="inherit" size="small">
            Home
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            size="small"
            startIcon={<LoginIcon />}
          >
            Sign in
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <Link component={RouterLink} to="/privacy" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          {' · '}
          Need automation?{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Create an account
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
