import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { ContentColumn } from './ytmp3/ContentColumn';
import { PublicPageShell } from './ytmp3/PublicPageShell';

type LegalPageLayoutProps = {
  title: string;
};

export function LegalPageLayout({ title }: LegalPageLayoutProps) {
  return (
    <PublicPageShell
      title={title}
      subtitle="Legal information"
      nav={[
        { label: 'Home', href: '/' },
        { label: 'Sign in', href: '/login' },
      ]}
    >
      <ContentColumn>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Back to home
        </Button>
        <Outlet />
      </ContentColumn>
    </PublicPageShell>
  );
}
