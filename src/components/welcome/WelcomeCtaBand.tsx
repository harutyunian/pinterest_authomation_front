import { LandingButton } from './LandingButton';
import { MaterialSymbol } from './MaterialSymbol';
import { WelcomeSection } from './WelcomeSection';

export function WelcomeCtaBand() {
  return (
    <WelcomeSection className="py-stack-lg text-center">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-landing-primary-container/20 to-landing-surface-container py-20 px-8 border border-white/5">
        <div className="absolute inset-0 hero-glow opacity-30" />
        <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-6 relative z-10">
          Ready to automate?
        </h2>
        <p className="font-body-lg text-body-lg text-landing-on-surface-variant max-w-2xl mx-auto mb-10 relative z-10">
          Join over 5,000+ creators and brands who are scaling their social presence effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
          <LandingButton to="/login" className="w-full sm:w-auto px-10 py-4 text-xl hover:scale-105">
            Get started for free
          </LandingButton>
          <p className="text-landing-on-surface-variant text-sm font-label-caps uppercase">
            No credit card required
          </p>
        </div>
        <div className="absolute top-10 left-10 opacity-10 animate-bounce pointer-events-none">
          <MaterialSymbol name="rocket_launch" className="text-6xl" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 animate-pulse pointer-events-none">
          <MaterialSymbol name="auto_graph" className="text-6xl" />
        </div>
      </div>
    </WelcomeSection>
  );
}
