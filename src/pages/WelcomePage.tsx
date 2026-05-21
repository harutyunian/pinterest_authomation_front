import { Box, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchCiCdStatus } from '../api/ciCd';
import { WelcomeCtaBand } from '../components/welcome/WelcomeCtaBand';
import { WelcomeFeatureSection } from '../components/welcome/WelcomeFeatureSection';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { WelcomeHero } from '../components/welcome/WelcomeHero';
import { WelcomeNav } from '../components/welcome/WelcomeNav';
import { WelcomePlatformGrid } from '../components/welcome/WelcomePlatformGrid';
import { LANDING_FONT } from '../components/welcome/welcomeStyles';

export function WelcomePage() {
  const ciCdQuery = useQuery({
    queryKey: ['ci-cd-status'],
    queryFn: fetchCiCdStatus,
    retry: 1,
    staleTime: 60_000,
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        fontFamily: LANDING_FONT,
        background: 'linear-gradient(160deg, #0b0d12 0%, #1a1a2e 35%, #1e1b4b 70%, #0f3460 100%)',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)
          `,
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230,0,35,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: -100,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: '30%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <WelcomeNav />
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <WelcomeHero />
          <WelcomePlatformGrid />
          <WelcomeFeatureSection />
          <WelcomeCtaBand />
        </Container>
        <WelcomeFooter
          isLoading={ciCdQuery.isLoading}
          isError={ciCdQuery.isError}
          status={ciCdQuery.isSuccess ? ciCdQuery.data : undefined}
        />
      </Box>
    </Box>
  );
}
