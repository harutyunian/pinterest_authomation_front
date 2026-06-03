import { GlassCard } from './GlassCard';
import { LandingButton } from './LandingButton';
import { MaterialSymbol } from './MaterialSymbol';
import { WelcomeSection } from './WelcomeSection';
import { PRICING_PLANS } from './welcome.constants';

export function WelcomePricingSection() {
  return (
    <WelcomeSection id="pricing" className="py-stack-lg">
      <div className="text-center mb-16">
        <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md mb-4">
          Simple, transparent pricing
        </h2>
        <p className="font-body-lg text-body-lg text-landing-on-surface-variant max-w-xl mx-auto">
          Choose the plan that fits your workflow. Upgrade or downgrade anytime.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md items-stretch">
        {PRICING_PLANS.map((plan) => (
          <GlassCard
            key={plan.name}
            className={`relative flex flex-col p-8 rounded-3xl transition-all hover:bg-white/[0.08] ${
              plan.highlighted
                ? 'border-landing-primary/40 ring-1 ring-landing-primary/30 scale-[1.02]'
                : ''
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-landing-primary-container text-landing-on-primary-container text-xs font-label-caps uppercase tracking-wide">
                Most popular
              </span>
            )}
            <div className="mb-6">
              <h3 className="font-headline-sm text-headline-sm mb-2">{plan.name}</h3>
              <p className="font-body-md text-body-md text-landing-on-surface-variant mb-4">
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display-lg text-display-lg-mobile md:text-headline-md">
                  ${plan.price}
                </span>
                <span className="font-body-md text-body-md text-landing-on-surface-variant">
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
                    className="text-landing-primary-container text-lg shrink-0 mt-0.5"
                  />
                  <span className="text-landing-on-surface-variant">{feature}</span>
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
