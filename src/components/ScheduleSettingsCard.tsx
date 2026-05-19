import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getSchedule, updateSchedule } from '../api/schedule';

const PRESET_HOURS = [1, 2, 4, 6, 8, 12, 24];

function formatInterval(hours: number): string {
  if (hours === 1) return 'every hour';
  return `every ${hours} hours`;
}

export function ScheduleSettingsCard() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['schedule'],
    queryFn: getSchedule,
  });

  const [intervalHours, setIntervalHours] = useState(8);
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setIntervalHours(data.intervalHours);
      setEnabled(data.enabled);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const hasChanges =
    data &&
    (intervalHours !== data.intervalHours || enabled !== data.enabled);

  const handleSave = () => {
    mutation.mutate({ intervalHours, enabled });
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
          <ScheduleIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Post scheduling
          </Typography>
          {data && (
            <Chip
              label={data.enabled ? 'Active' : 'Paused'}
              size="small"
              color={data.enabled ? 'success' : 'default'}
            />
          )}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Control how often pins are published automatically. Default is every 8
          hours.
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {isError && (
          <Alert severity="error">Could not load schedule settings.</Alert>
        )}

        {data && !isLoading && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Interval: {formatInterval(intervalHours)}
            </Typography>

            <Slider
              value={intervalHours}
              onChange={(_, value) => setIntervalHours(value as number)}
              min={1}
              max={48}
              step={1}
              marks={PRESET_HOURS.filter((h) => h <= 48).map((h) => ({
                value: h,
                label: `${h}h`,
              }))}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}h`}
              sx={{ mt: 2, mb: 3 }}
            />

            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PRESET_HOURS.map((hours) => (
                <Chip
                  key={hours}
                  label={`${hours}h`}
                  onClick={() => setIntervalHours(hours)}
                  color={intervalHours === hours ? 'primary' : 'default'}
                  variant={intervalHours === hours ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label="Enable automatic posting"
              sx={{ mb: 2, display: 'block' }}
            />

            {saved && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Schedule saved to database.
              </Alert>
            )}

            {mutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to save schedule. Try again.
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!hasChanges || mutation.isPending}
            >
              {mutation.isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Save schedule'
              )}
            </Button>

            {data.updatedAt && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: 'block' }}
              >
                Last updated: {new Date(data.updatedAt).toLocaleString()}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
