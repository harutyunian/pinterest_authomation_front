import { GlassCard } from './GlassCard';
import { MaterialSymbol } from './MaterialSymbol';
import { PlatformIcon } from './PlatformIcon';
import { WelcomeSection } from './WelcomeSection';
import { FEATURES } from './welcome.constants';

export function WelcomeFeatureSection() {
  return (
    <WelcomeSection id="features" className="py-stack-lg">
      <div className="text-center mb-16">
        <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md text-[var(--ytmp3-text)]">
          Why Social Automation
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
        {FEATURES.map((feature) => (
          <GlassCard
            key={feature.title}
            className={`p-8 rounded-lg group hover:shadow-lg transition-all ${feature.cardClass}`}
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${feature.iconBgClass}`}
            >
              {feature.icon.type === 'material' ? (
                <MaterialSymbol name={feature.icon.name} filled />
              ) : (
                <PlatformIcon platform={feature.icon.platformId} />
              )}
            </div>
            <h3 className="font-headline-sm text-headline-sm mb-4 text-[var(--ytmp3-text)]">
              {feature.title}
            </h3>
            <p className="font-body-md text-body-md text-[var(--ytmp3-text-muted)]">
              {feature.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </WelcomeSection>
  );
}
