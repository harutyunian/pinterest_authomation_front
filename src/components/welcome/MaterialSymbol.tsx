type MaterialSymbolProps = {
  name: string;
  filled?: boolean;
  className?: string;
};

export function MaterialSymbol({ name, filled = false, className = '' }: MaterialSymbolProps) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'filled' : ''} ${className}`.trim()}
      aria-hidden
    >
      {name}
    </span>
  );
}
