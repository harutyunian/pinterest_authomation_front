import PinterestIcon from '@mui/icons-material/Pinterest';
import { Box, Typography, alpha } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAdminColors } from '../theme/ThemeModeProvider';

export function AuthLayout() {
  const adminColors = useAdminColors();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: adminColors.bgDefault,
        backgroundImage: `radial-gradient(ellipse at top, ${alpha(adminColors.accent, 0.15)} 0%, transparent 50%)`,
        px: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <PinterestIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }} color="text.primary">
          Pinterest Automation
        </Typography>
      </Box>
      <Outlet />
    </Box>
  );
}
