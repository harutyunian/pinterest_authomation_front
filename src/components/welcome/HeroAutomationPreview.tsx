import { GlassCard } from './GlassCard';
import { MaterialSymbol } from './MaterialSymbol';
import { PlatformIconRing } from './PlatformIcon';
import { PLATFORMS, QUEUE_PREVIEW_ITEMS } from './welcome.constants';

export function HeroAutomationPreview() {
  return (
    <div className="relative">
      <GlassCard className="rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-landing-primary-container/20 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="font-label-caps text-label-caps text-landing-on-surface-variant mb-1 uppercase tracking-widest">
              Automation Preview
            </p>
            <h3 className="font-headline-sm text-headline-sm">This week&apos;s queue</h3>
          </div>
        </div>
        <div className="space-y-4">
          {QUEUE_PREVIEW_ITEMS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <MaterialSymbol name="schedule" className="text-landing-on-surface-variant" />
              <div className="flex-1">
                <p className="font-body-md text-body-md">{item}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex justify-center gap-4">
          {PLATFORMS.map(({ id }) => (
            <PlatformIconRing key={id} platform={id} size="hero" />
          ))}
        </div>
      </GlassCard>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 glass-card rounded-2xl -z-10 animate-pulse" />
    </div>
  );
}
