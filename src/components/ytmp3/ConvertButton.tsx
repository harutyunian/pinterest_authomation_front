import { Button, type ButtonProps } from '@mui/material';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

export function ConvertButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        borderRadius: `${t.radius}px`,
        bgcolor: t.cta,
        color: t.onPrimary,
        fontWeight: 600,
        px: 3,
        py: 1.25,
        boxShadow: 'none',
        '&:hover': { bgcolor: t.ctaHover, boxShadow: 'none' },
        ...sx,
      }}
    />
  );
}
