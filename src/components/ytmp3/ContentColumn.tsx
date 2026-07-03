import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { ytmp3Tokens as t } from '../../theme/ytmp3-tokens';

type ContentColumnProps = {
  children: ReactNode;
  maxWidth?: number;
};

export function ContentColumn({ children, maxWidth = t.contentMax }: ContentColumnProps) {
  return (
    <Box
      component="section"
      sx={{
        maxWidth,
        mx: 'auto',
        px: `${t.gutter}px`,
        py: 6,
        color: t.text,
        '& a': { color: t.primary },
        '& h2': { fontSize: '1.25rem', fontWeight: 700, mb: 2, color: t.text },
        '& p': { mb: 2, lineHeight: 1.6, color: t.text },
        '& ol, & ul': { pl: 3, mb: 2, color: t.text },
        '& li': { mb: 0.5 },
      }}
    >
      {children}
    </Box>
  );
}
