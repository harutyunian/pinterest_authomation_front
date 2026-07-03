import { LandingButton } from './LandingButton';
import { WelcomeSection } from './WelcomeSection';

export function WelcomeCtaBand() {
  return (
    <WelcomeSection className="py-stack-lg text-center">
      <div className="rounded-lg bg-[var(--ytmp3-primary)] text-[var(--ytmp3-on-primary)] py-16 px-8">
        <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-6">
          Ready to automate?
        </h2>
        <p className="font-body-lg text-body-lg max-w-2xl mx-auto mb-10 opacity-95">
          Join creators and brands who are scaling their social presence effortlessly.
        </p>
        <LandingButton to="/login" className="w-full sm:w-auto px-10 py-4 text-lg">
          Get started for free
        </LandingButton>
        <p className="text-white/80 text-sm mt-4 uppercase tracking-wide">
          No credit card required
        </p>
      </div>
    </WelcomeSection>
  );
}
