import type { ReactNode } from 'react';

type WelcomeSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export function WelcomeSection({ id, children, className = '' }: WelcomeSectionProps) {
  return (
    <section
      id={id}
      className={`max-w-container-max mx-auto px-gutter ${className}`.trim()}
    >
      {children}
    </section>
  );
}
