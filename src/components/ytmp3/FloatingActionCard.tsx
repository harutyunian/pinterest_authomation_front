import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

type FloatingActionCardProps = {
  children: ReactNode;
  maxWidth?: number;
};

export function FloatingActionCard({ children, maxWidth = t.contentMax }: FloatingActionCardProps) {
  return (
    <Box
      sx={{
        maxWidth,
        mx: 'auto',
        mt: `${t.cardOverlap}px`,
        px: `${t.gutter}px`,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          bgcolor: t.surface,
          borderRadius: `${t.radius}px`,
          boxShadow: t.shadow,
          p: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
