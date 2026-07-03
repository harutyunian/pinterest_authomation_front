import { GlassCard } from './GlassCard';
import { LandingButton } from './LandingButton';
import { MaterialSymbol } from './MaterialSymbol';
import { WelcomeSection } from './WelcomeSection';
import { PRICING_PLANS } from './welcome.constants';

export function WelcomePricingSection() {
  return (
    <WelcomeSection id="pricing" className="py-stack-lg">
      <div className="text-center mb-16">
        <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-4 text-[var(--ytmp3-text)]">
          Simple, transparent pricing
        </h2>
        <p className="font-body-lg text-body-lg text-[var(--ytmp3-text-muted)] max-w-xl mx-auto">
          Choose the plan that fits your workflow. Upgrade or downgrade anytime.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md items-stretch">
        {PRICING_PLANS.map((plan) => (
          <GlassCard
            key={plan.name}
            className={`relative flex flex-col p-8 rounded-lg transition-all hover:shadow-lg ${
              plan.highlighted
                ? 'border-[var(--ytmp3-primary)] ring-1 ring-[var(--ytmp3-primary)]/30 scale-[1.02]'
                : ''
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-[var(--ytmp3-primary)] text-[var(--ytmp3-on-primary)] text-xs font-semibold uppercase tracking-wide">
                Most popular
              </span>
            )}
            <div className="mb-6">
              <h3 className="font-headline-sm text-headline-sm mb-2 text-[var(--ytmp3-text)]">
                {plan.name}
              </h3>
              <p className="font-body-md text-body-md text-[var(--ytmp3-text-muted)] mb-4">
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display-lg text-display-lg-mobile md:text-headline-md text-[var(--ytmp3-text)]">
                  ${plan.price}
                </span>
                <span className="font-body-md text-body-md text-[var(--ytmp3-text-muted)]">
                  /{plan.period}
                </span>
              </div>
            </div>
            <ul className="flex-1 space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 font-body-md text-body-md">
                  <MaterialSymbol
                    name="check_circle"
                    filled
                    className="text-[var(--ytmp3-primary)] text-lg shrink-0 mt-0.5"
                  />
                  <span className="text-[var(--ytmp3-text-muted)]">{feature}</span>
                </li>
              ))}
            </ul>
            <LandingButton
              to="/login"
              variant={plan.highlighted ? 'primary' : 'outline'}
              className="w-full py-3"
            >
              Get started
            </LandingButton>
          </GlassCard>
        ))}
      </div>
    </WelcomeSection>
  );
}
