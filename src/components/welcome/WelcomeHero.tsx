import { LandingButton } from './LandingButton';
import { MaterialSymbol } from './MaterialSymbol';
import { WelcomeSection } from './WelcomeSection';
import { HeroAutomationPreview } from './HeroAutomationPreview';

export function WelcomeHero() {
  return (
    <WelcomeSection className="relative py-stack-lg md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="absolute inset-0 hero-glow -z-10" />
      <div className="space-y-stack-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <MaterialSymbol name="auto_awesome" className="text-landing-primary text-sm" filled />
          <span className="font-label-caps text-label-caps text-landing-on-surface-variant uppercase">
            Social media automation platform
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tight">
          Automate every channel from{' '}
          <span className="text-landing-primary-container">one dashboard</span>
        </h1>
        <p className="font-body-lg text-body-lg text-landing-on-surface-variant max-w-xl">
          Schedule posts, generate AI content, and grow your presence across every major social
          network — without switching tools.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <LandingButton to="/login" className="px-8 py-4 text-lg">
            Get started
          </LandingButton>
          <LandingButton to="/login" variant="outline" className="px-8 py-4 text-lg">
            <MaterialSymbol name="play_circle" />
            Watch demo
          </LandingButton>
        </div>
      </div>
      <HeroAutomationPreview />
    </WelcomeSection>
  );
}
