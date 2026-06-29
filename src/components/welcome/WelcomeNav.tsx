import { LandingButton } from './LandingButton';
import { MaterialSymbol } from './MaterialSymbol';
import { NAV_LINKS } from './welcome.constants';
import { useScrollHeader } from './useScrollHeader';
import { Link as RouterLink } from 'react-router-dom';

export function WelcomeNav() {
  const scrolled = useScrollHeader();

  return (
    <header
      className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 transition-all duration-200 ${
        scrolled ? 'bg-landing-background/95 shadow-md' : 'bg-landing-background/80 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-2">
          <MaterialSymbol name="auto_awesome" className="text-landing-primary text-2xl" filled />
          <span className="font-display-lg text-headline-sm font-extrabold text-landing-primary">
            Social Automation
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) =>
            'to' in link ? (
              <RouterLink
                key={link.label}
                to={link.to}
                className="font-button-text text-button-text transition-colors duration-200 text-landing-on-surface-variant hover:text-landing-primary"
              >
                {link.label}
              </RouterLink>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`font-button-text text-button-text transition-colors duration-200 ${
                  link.active
                    ? 'text-landing-primary font-bold border-b-2 border-landing-primary pb-1'
                    : 'text-landing-on-surface-variant hover:text-landing-primary'
                }`}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-4">
          <LandingButton to="/tools" variant="ghost" className="hidden md:inline-flex">
            Free tools
          </LandingButton>
          <LandingButton to="/login" className="px-6 py-2">
            Get Started
          </LandingButton>
        </div>
      </div>
    </header>
  );
}
