import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PinterestIcon from '@mui/icons-material/Pinterest';
import {
  Box,
  Button,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminColors } from '../../theme/ThemeModeProvider';
import { useAuthStore } from '../../stores/authStore';
import { bottomNavItems, isNavItemActive, mainNavItems, type NavItem } from './navConfig';

export function AppSidebar() {
  const adminColors = useAdminColors();
  const activeSx = useMemo(
    () => ({
      bgcolor: alpha(adminColors.accent, 0.12),
      color: 'primary.main',
      borderLeft: `3px solid ${adminColors.accent}`,
      '& .MuiListItemIcon-root': { color: 'primary.main' },
    }),
    [adminColors.accent],
  );

  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');
  const [studioOpen, setStudioOpen] = useState(true);

  const navItems = mainNavItems.filter((item) => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    queryClient.removeQueries();
    logout();
    navigate('/login');
  };

  const renderNavItem = (item: NavItem) => {
    const active = isNavItemActive(item, location.pathname);
    const hasChildren = Boolean(item.children?.length);

    if (hasChildren) {
      return (
        <Box key={item.id}>
          <ListItemButton
            onClick={() => {
              setStudioOpen((o) => !o);
              if (item.path) navigate(item.path);
            }}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              borderLeft: '3px solid transparent',
              ...(active ? activeSx : {}),
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: active ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: { sx: { fontWeight: active ? 600 : 500, fontSize: 14 } },
              }}
            />
          </ListItemButton>
          <Collapse in={studioOpen} timeout="auto" unmountOnExit>
            <List dense disablePadding sx={{ pl: 2, pr: 1 }}>
              {item.children!.map((child) => {
                const childActive = location.pathname === child.path;
                return (
                  <ListItemButton
                    key={child.path}
                    component={RouterLink}
                    to={child.path}
                    sx={{
                      borderRadius: 2,
                      py: 0.75,
                      mb: 0.25,
                      borderLeft: '3px solid transparent',
                      ...(childActive ? activeSx : {}),
                    }}
                  >
                    <ListItemText
                      primary={child.label}
                      slotProps={{
                        primary: { sx: { fontSize: 13, fontWeight: childActive ? 600 : 400 } },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItemButton
        key={item.id}
        component={RouterLink}
        to={item.path!}
        sx={{
          mx: 1,
          mb: 0.5,
          borderRadius: 2,
          borderLeft: '3px solid transparent',
          ...(active ? activeSx : {}),
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: active ? 'primary.main' : 'text.secondary' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          slotProps={{
            primary: { sx: { fontWeight: active ? 600 : 500, fontSize: 14 } },
          }}
        />
      </ListItemButton>
    );
  };

  return (
    <Box
      component="aside"
      sx={{
        width: adminColors.sidebarWidth,
        flexShrink: 0,
        bgcolor: adminColors.bgPaper,
        borderRight: `1px solid ${adminColors.border}`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <PinterestIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Pinterest
            <br />
            Automation
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          AI-powered social publishing
        </Typography>
      </Box>

      {isAdmin && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/pin-creator')}
            sx={{ py: 1.25 }}
          >
            New Campaign
          </Button>
        </Box>
      )}

      <List component="nav" disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map(renderNavItem)}
      </List>

      <Divider sx={{ borderColor: adminColors.border }} />

      <List disablePadding sx={{ py: 1 }}>
        {bottomNavItems.map((item) => (
          <ListItemButton
            key={item.id}
            component="a"
            href={item.href}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { sx: { fontSize: 14 } } }}
            />
          </ListItemButton>
        ))}
        <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
            <LogoutIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            slotProps={{ primary: { sx: { fontSize: 14 } } }}
          />
        </ListItemButton>
      </List>
    </Box>
  );
}
