import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type LandingButtonProps = {
  variant?: 'primary' | 'outline' | 'ghost';
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function LandingButton({
  variant = 'primary',
  to,
  href,
  children,
  className = '',
  onClick,
}: LandingButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-button-text text-button-text transition-all active:scale-95';

  const variants = {
    primary: 'bg-[var(--ytmp3-cta)] text-[var(--ytmp3-on-primary)] hover:bg-[var(--ytmp3-cta-hover)]',
    outline:
      'border border-[var(--ytmp3-primary)] bg-transparent text-[var(--ytmp3-primary)] hover:bg-[var(--ytmp3-primary)]/5',
    ghost: 'text-[var(--ytmp3-text-muted)] hover:text-[var(--ytmp3-primary)]',
  };

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
