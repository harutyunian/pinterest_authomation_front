import { Link } from 'react-router-dom';
import { MaterialSymbol } from './MaterialSymbol';
import { WelcomeSection } from './WelcomeSection';
import { FOOTER_LINKS } from './welcome.constants';

type WelcomeFooterProps = {
  isLoading: boolean;
  isError: boolean;
  status?: string;
};

export function WelcomeFooter({ isLoading, isError, status }: WelcomeFooterProps) {
  return (
    <footer className="bg-landing-surface-container-lowest w-full py-stack-lg border-t border-white/5">
      <WelcomeSection className="flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <MaterialSymbol name="auto_awesome" className="text-landing-primary text-xl" filled />
            <span className="font-display-lg text-headline-sm font-extrabold text-landing-primary">
              Social Automation
            </span>
          </div>
          <p className="font-body-md text-body-md text-landing-on-surface-variant max-w-xs text-center md:text-left">
            The world&apos;s most intuitive social media automation engine.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {FOOTER_LINKS.map((link) =>
            'to' in link ? (
              <Link
                key={link.label}
                to={link.to}
                className="font-body-md text-body-md text-landing-on-surface-variant hover:text-landing-on-surface transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="font-body-md text-body-md text-landing-on-surface-variant hover:text-landing-on-surface transition-colors"
              >
                {link.label}
              </a>
            ),
          )}
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="font-body-md text-body-md text-landing-on-surface-variant">
            © {new Date().getFullYear()} Social Automation. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-body-md text-body-md text-landing-on-surface-variant text-sm">
              System status
            </span>
            {isLoading && (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
            )}
            {isError && (
              <span className="px-2 py-0.5 rounded text-xs bg-red-500/15 text-red-300 border border-red-500/30">
                offline
              </span>
            )}
            {!isLoading && !isError && status && (
              <span className="px-2 py-0.5 rounded text-xs bg-green-500/12 text-green-300 border border-green-500/25 font-medium">
                {status}
              </span>
            )}
          </div>
        </div>
      </WelcomeSection>
    </footer>
  );
}
