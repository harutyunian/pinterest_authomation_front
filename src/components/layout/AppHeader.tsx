import DarkModeIcon from '@mui/icons-material/DarkMode';
import HistoryIcon from '@mui/icons-material/History';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAdminColors, useThemeMode } from '../../theme/ThemeModeProvider';
import { useAuthStore } from '../../stores/authStore';
import { pageTitles } from './navConfig';

export function AppHeader() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const { mode, toggleMode } = useThemeMode();
  const adminColors = useAdminColors();
  const meta = pageTitles[location.pathname] ?? {
    title: 'Pinterest Automation',
    subtitle: undefined,
  };

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 2.5,
        px: { xs: 2, md: 3 },
        borderBottom: `1px solid ${adminColors.border}`,
        position: 'sticky',
        bgcolor: adminColors.bgPaper,
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: meta.accent ? 'primary.main' : 'text.primary',
            lineHeight: 1.2,
          }}
          noWrap
        >
          {meta.title}
        </Typography>
        {meta.subtitle && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {meta.subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <TextField
          size="small"
          placeholder="Search…"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 220,
            '& .MuiOutlinedInput-root': { borderRadius: 1 },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="disabled" />
                </InputAdornment>
              ),
            },
          }}
        />
        <IconButton
          size="small"
          aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={toggleMode}
          sx={{ color: 'text.secondary' }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton size="small" aria-label="notifications" sx={{ color: 'text.secondary' }}>
          <NotificationsNoneIcon />
        </IconButton>
        <IconButton size="small" aria-label="history" sx={{ color: 'text.secondary' }}>
          <HistoryIcon />
        </IconButton>
        {user?.role === 'admin' && (
          <Chip label="Admin" size="small" color="primary" sx={{ display: { xs: 'none', sm: 'flex' } }} />
        )}
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14, color: '#fff' }}>
          {user?.username?.[0]?.toUpperCase() ?? '?'}
        </Avatar>
      </Box>
    </Box>
  );
}
