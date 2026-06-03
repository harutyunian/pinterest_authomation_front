import { useQuery } from '@tanstack/react-query';
import { fetchCiCdStatus } from '../api/ciCd';
import { WelcomeCtaBand } from '../components/welcome/WelcomeCtaBand';
import { WelcomeFeatureSection } from '../components/welcome/WelcomeFeatureSection';
import { WelcomeFooter } from '../components/welcome/WelcomeFooter';
import { WelcomeHero } from '../components/welcome/WelcomeHero';
import { WelcomeNav } from '../components/welcome/WelcomeNav';
import { WelcomePlatformGrid } from '../components/welcome/WelcomePlatformGrid';
import { WelcomePricingSection } from '../components/welcome/WelcomePricingSection';
import '../components/welcome/welcome.styles.css';

export function WelcomePage() {
  const ciCdQuery = useQuery({
    queryKey: ['ci-cd-status'],
    queryFn: fetchCiCdStatus,
    retry: 1,
    staleTime: 60_000,
  });

  return (
    <div className="landing-page dark overflow-x-hidden">
      <WelcomeNav />
      <main className="pt-24">
        <WelcomeHero />
        <WelcomePlatformGrid />
        <WelcomeFeatureSection />
        <WelcomePricingSection />
        <WelcomeCtaBand />
      </main>
      <WelcomeFooter
        isLoading={ciCdQuery.isLoading}
        isError={ciCdQuery.isError}
        status={ciCdQuery.isSuccess ? ciCdQuery.data : undefined}
      />
    </div>
  );
}
