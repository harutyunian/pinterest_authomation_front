import { Box, Chip, CircularProgress, Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LANDING_FONT } from './welcomeStyles';

type WelcomeFooterProps = {
  isLoading: boolean;
  isError: boolean;
  status?: string;
};

export function WelcomeFooter({ isLoading, isError, status }: WelcomeFooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 4,
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.45)', fontFamily: LANDING_FONT }}
            >
              © {new Date().getFullYear()} Social Automation
            </Typography>
            <Link
              component={RouterLink}
              to="/privacy"
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: LANDING_FONT,
                textDecoration: 'none',
                '&:hover': { color: 'rgba(255,255,255,0.85)' },
              }}
            >
              Политика конфиденциальности
            </Link>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: LANDING_FONT }}
            >
              System status
            </Typography>
            {isLoading && <CircularProgress size={14} sx={{ color: 'rgba(255,255,255,0.5)' }} />}
            {isError && (
              <Chip
                label="offline"
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(239,68,68,0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              />
            )}
            {!isLoading && !isError && status && (
              <Chip
                label={status}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(34,197,94,0.12)',
                  color: 'rgba(134,239,172,0.9)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
