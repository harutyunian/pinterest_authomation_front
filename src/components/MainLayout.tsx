import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { AppHeader } from './layout/AppHeader';
import { AppSidebar } from './layout/AppSidebar';
import { useAdminColors } from '../theme/ThemeModeProvider';

export function MainLayout() {
  const adminColors = useAdminColors();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
      <AppSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: `${adminColors.sidebarWidth}px`,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppHeader />
        <Box sx={{ flex: 1, px: { xs: 2, md: 3 }, py: 3, maxWidth: 1400 }}>
          <Outlet />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 6, display: 'block', textAlign: 'center' }}
          >
            <Link component={RouterLink} to="/privacy" underline="hover" color="inherit">
              Политика конфиденциальности
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
