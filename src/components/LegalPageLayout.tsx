import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

type LegalPageLayoutProps = {
  title: string;
};

export function LegalPageLayout({ title }: LegalPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="md">
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          На главную
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          {title}
        </Typography>
        <Outlet />
      </Container>
    </Box>
  );
}
