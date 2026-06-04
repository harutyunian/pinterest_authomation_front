import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Typography, alpha } from '@mui/material';
import type { ReactNode } from 'react';
import { useAdminColors } from '../../theme/ThemeModeProvider';
import { AdminCard } from './AdminCard';

type KpiCardProps = {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: ReactNode;
};

export function KpiCard({ label, value, change, positive = true, icon }: KpiCardProps) {
  const adminColors = useAdminColors();

  return (
    <AdminCard padding={2.5}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        {icon && (
          <Box
            sx={{
              color: 'primary.main',
              bgcolor: alpha(adminColors.accent, 0.12),
              borderRadius: 2,
              p: 0.75,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: change ? 0.5 : 0 }}>
        {value}
      </Typography>
      {change && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TrendingUpIcon
            sx={{
              fontSize: 16,
              color: positive ? 'success.main' : 'error.main',
              transform: positive ? 'none' : 'rotate(180deg)',
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: positive ? 'success.main' : 'error.main', fontWeight: 600 }}
          >
            {change}
          </Typography>
        </Box>
      )}
    </AdminCard>
  );
}
