import {
  Alert,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import type { GenerationStatus } from '../../types/characterReplacement';
import { formatEstimatedTime } from '../../utils/characterReplacement/formatters';

interface GenerationProgressPanelProps {
  status: GenerationStatus;
  progress: number;
  progressMessage: string;
  estimatedSecondsRemaining: number | null;
}

export function GenerationProgressPanel({
  status,
  progress,
  progressMessage,
  estimatedSecondsRemaining,
}: GenerationProgressPanelProps) {
  const isActive =
    status === 'uploading' ||
    status === 'generating' ||
    status === 'processing';

  if (!isActive && status !== 'completed') {
    return null;
  }

  if (status === 'completed') {
    return (
      <Alert severity="success" sx={{ mb: 3 }}>
        Generation complete. Your replacement video is ready in the gallery below.
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography color="text.secondary">
            {progressMessage || 'Working with Google Veo…'}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {progress}% complete
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatEstimatedTime(estimatedSecondsRemaining)}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            }}
          >
            <Skeleton variant="rounded" height={64} />
            <Skeleton variant="rounded" height={64} />
            <Skeleton variant="rounded" height={64} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
