import { Box, Button } from '@mui/material';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

type FormatOption<T extends string> = { value: T; label: string };

type FormatToggleProps<T extends string> = {
  value: T;
  options: FormatOption<T>[];
  onChange: (value: T) => void;
};

export function FormatToggle<T extends string>({ value, options, onChange }: FormatToggleProps<T>) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            sx={{
              borderRadius: `${t.radius}px`,
              minWidth: 72,
              fontWeight: 600,
              bgcolor: active ? t.primary : t.surface,
              color: active ? t.onPrimary : t.primary,
              border: `1px solid ${active ? t.primary : t.border}`,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: active ? t.primaryHover : t.surface,
                boxShadow: 'none',
              },
            }}
          >
            {opt.label}
          </Button>
        );
      })}
    </Box>
  );
}
