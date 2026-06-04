import { Card, CardContent, type CardProps } from '@mui/material';
import type { ReactNode } from 'react';

type AdminCardProps = CardProps & {
  children: ReactNode;
  padding?: number;
};

export function AdminCard({ children, padding = 3, sx, ...props }: AdminCardProps) {
  return (
    <Card sx={{ borderRadius: 2, ...sx }} {...props}>
      <CardContent sx={{ p: padding, '&:last-child': { pb: padding } }}>
        {children}
      </CardContent>
    </Card>
  );
}
