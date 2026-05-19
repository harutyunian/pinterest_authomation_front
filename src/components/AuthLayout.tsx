import PinterestIcon from '@mui/icons-material/Pinterest';
import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff5f6 0%, #f5f5f5 50%, #ffffff 100%)',
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
