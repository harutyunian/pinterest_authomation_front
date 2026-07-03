import { Link } from 'react-router-dom';
import { LandingButton } from './LandingButton';
import { NAV_LINKS } from './welcome.constants';

export function WelcomeNav() {
  return (
    <header className="bg-[var(--ytmp3-primary)] text-[var(--ytmp3-on-primary)] w-full">
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-16">
        <Link
          to="/"
          className="font-bold italic text-[var(--ytmp3-on-primary)] text-xl no-underline"
        >
          Social Automation
        </Link>
        <nav className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) =>
            'to' in link ? (
              <Link
                key={link.label}
                to={link.to}
                className="font-button-text text-button-text text-[var(--ytmp3-on-primary)] hover:underline no-underline"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="font-button-text text-button-text text-[var(--ytmp3-on-primary)] hover:underline no-underline"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-4">
          <LandingButton href="/tools" variant="ghost" className="hidden md:inline-flex !text-white/90">
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
