import DashboardIcon from '@mui/icons-material/Dashboard';
import ImageIcon from '@mui/icons-material/Image';
import KeyIcon from '@mui/icons-material/Key';
import { Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
  { label: 'Gemini Keys', path: '/gemini-keys', icon: <KeyIcon sx={{ fontSize: 18 }} /> },
  {
    label: 'Generate Image',
    path: '/image-generator',
    icon: <ImageIcon sx={{ fontSize: 18 }} />,
  },
];

export function AppNav() {
  const location = useLocation();
  const navigate = useNavigate();

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
