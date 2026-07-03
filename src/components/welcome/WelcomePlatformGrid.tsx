import { GlassCard } from './GlassCard';
import { PlatformIcon } from './PlatformIcon';
import { WelcomeSection } from './WelcomeSection';
import { PLATFORMS, STAT_PILLS } from './welcome.constants';

export function WelcomePlatformGrid() {
  return (
    <WelcomeSection className="py-stack-lg text-center">
      <h2 className="font-headline-sm text-headline-sm mb-stack-md text-[var(--ytmp3-text-muted)] uppercase tracking-widest">
        Supported platforms
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-stack-sm">
        {PLATFORMS.map(({ id, name, iconBgClass, iconColorClass }) => (
          <GlassCard
            key={id}
            className="rounded-lg p-6 group hover:border-[var(--ytmp3-primary)] transition-all cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-full ${iconBgClass} flex items-center justify-center ${iconColorClass} mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <PlatformIcon platform={id} />
            </div>
            <p className="font-button-text text-button-text text-[var(--ytmp3-text)]">{name}</p>
          </GlassCard>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        {STAT_PILLS.map((label) => (
          <span
            key={label}
            className="px-4 py-1.5 rounded-lg bg-[var(--ytmp3-surface)] border border-[var(--ytmp3-border-light)] text-[var(--ytmp3-text-muted)] text-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </WelcomeSection>
  );
}
