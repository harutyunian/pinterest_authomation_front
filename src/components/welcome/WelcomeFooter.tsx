import { Link } from 'react-router-dom';
import { WelcomeSection } from './WelcomeSection';
import { FOOTER_LINKS } from './welcome.constants';

type WelcomeFooterProps = {
  isLoading: boolean;
  isError: boolean;
  status?: string;
};

export function WelcomeFooter({ isLoading, isError, status }: WelcomeFooterProps) {
  return (
    <footer className="bg-[var(--ytmp3-surface)] w-full py-stack-lg border-t border-[var(--ytmp3-border-light)]">
      <WelcomeSection className="flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-bold italic text-[var(--ytmp3-primary)] text-xl">
            Social Automation
          </span>
          <p className="font-body-md text-body-md text-[var(--ytmp3-text-muted)] max-w-xs text-center md:text-left">
            The world&apos;s most intuitive social media automation engine.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {FOOTER_LINKS.map((link) =>
            'to' in link ? (
              <Link
                key={link.label}
                to={link.to}
                className="font-body-md text-body-md text-[var(--ytmp3-text-muted)] hover:text-[var(--ytmp3-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="font-body-md text-body-md text-[var(--ytmp3-text-muted)] hover:text-[var(--ytmp3-primary)] transition-colors"
              >
                {link.label}
              </a>
            ),
          )}
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="font-body-md text-body-md text-[var(--ytmp3-text-muted)]">
            © {new Date().getFullYear()} Social Automation. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-body-md text-body-md text-[var(--ytmp3-text-muted)] text-sm">
              System status
            </span>
            {isLoading && (
              <span className="inline-block w-3.5 h-3.5 border-2 border-gray-300 border-t-[var(--ytmp3-primary)] rounded-full animate-spin" />
            )}
            {isError && (
              <span className="px-2 py-0.5 rounded text-xs bg-red-50 text-red-600 border border-red-200">
                offline
              </span>
            )}
            {!isLoading && !isError && status && (
              <span className="px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200 font-medium">
                {status}
              </span>
            )}
          </div>
        </div>
      </WelcomeSection>
    </footer>
  );
}
