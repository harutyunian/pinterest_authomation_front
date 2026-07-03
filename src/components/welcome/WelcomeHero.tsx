import { LandingButton } from './LandingButton';
import { MaterialSymbol } from './MaterialSymbol';
import { WelcomeSection } from './WelcomeSection';

export function WelcomeHero() {
  return (
    <>
      <div className="bg-[var(--ytmp3-primary)] text-[var(--ytmp3-on-primary)] text-center pt-8 pb-20 px-gutter">
        <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md font-bold mb-3">
          Automate every channel from one dashboard
        </h1>
        <p className="font-body-lg text-body-lg max-w-xl mx-auto opacity-95">
          Schedule posts, generate AI content, and grow your presence across every major social
          network — without switching tools.
        </p>
      </div>
      <WelcomeSection className="-mt-12 relative z-10 max-w-[760px] mx-auto px-gutter">
        <div className="glass-card p-6 md:p-8 text-center">
          <p className="font-body-md text-body-md text-[var(--ytmp3-text-muted)] mb-4">
            Start automating your social channels today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <LandingButton to="/login" className="px-8 py-3 text-base">
              Get started
            </LandingButton>
            <LandingButton to="/login" variant="outline" className="px-8 py-3 text-base">
              <MaterialSymbol name="play_circle" />
              Watch demo
            </LandingButton>
          </div>
        </div>
      </WelcomeSection>
    </>
  );
}
