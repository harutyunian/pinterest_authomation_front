import DashboardIcon from '@mui/icons-material/Dashboard';
import ImageIcon from '@mui/icons-material/Image';
import KeyIcon from '@mui/icons-material/Key';
import MovieIcon from '@mui/icons-material/Movie';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PinIcon from '@mui/icons-material/PushPin';
import { Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const allTabs = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
  { label: 'Gemini Keys', path: '/gemini-keys', icon: <KeyIcon sx={{ fontSize: 18 }} />, adminOnly: true },
  {
    label: 'Pin Creator',
    path: '/pin-creator',
    icon: <PinIcon sx={{ fontSize: 18 }} />,
    adminOnly: true,
  },
  {
    label: 'Generate Image',
    path: '/image-generator',
    icon: <ImageIcon sx={{ fontSize: 18 }} />,
    adminOnly: true,
  },
  {
    label: 'AI Video Generation',
    path: '/video-generator',
    icon: <MovieIcon sx={{ fontSize: 18 }} />,
    adminOnly: true,
  },
  {
    label: 'Stored Videos',
    path: '/stored-videos',
    icon: <VideoLibraryIcon sx={{ fontSize: 18 }} />,
    adminOnly: true,
  },
] as const;

export function AppNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');
  const tabs = allTabs.filter((t) => !('adminOnly' in t && t.adminOnly) || isAdmin);

  const currentTab = tabs.findIndex((t) => t.path === location.pathname);

  return (
    <Tabs
      value={currentTab === -1 ? 0 : currentTab}
      onChange={(_, index) => navigate(tabs[index].path)}
      sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.path}
          label={tab.label}
          icon={tab.icon}
          iconPosition="start"
        />
      ))}
    </Tabs>
  );
}
