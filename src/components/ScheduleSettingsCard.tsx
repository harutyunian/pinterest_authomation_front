import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScheduleIcon from '@mui/icons-material/Schedule';
import {
  Alert,
  Autocomplete,
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
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { getSchedule, updateSchedule } from '../api/schedule';
import {
  SCHEDULE_TIMEZONES,
  detectBrowserTimezone,
} from '../constants/timezones';
import { useAuthStore } from '../stores/authStore';
import {
  computeSchedulePreview,
  formatInterval,
  timezoneLabel,
} from '../utils/schedulePreview';

const PRESET_HOURS = [1, 2, 3, 4, 5] as const;
const MAX_INTERVAL_HOURS = 5;

export function ScheduleSettingsCard() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['schedule', userId],
    queryFn: getSchedule,
    enabled: Boolean(userId),
  });

  const [intervalHours, setIntervalHours] = useState(5);
  const [timezone, setTimezone] = useState(detectBrowserTimezone());
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setIntervalHours(data.intervalHours);
      setTimezone(data.timezone);
      setEnabled(data.enabled);
    }
  }, [data]);

  const preview = useMemo(
    () => computeSchedulePreview(intervalHours),
    [intervalHours],
  );

  const mutation = useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const hasChanges =
    data &&
    (intervalHours !== data.intervalHours ||
      timezone !== data.timezone ||
      enabled !== data.enabled);

  const handleSave = () => {
    mutation.mutate({ intervalHours, timezone, enabled });
  };

  const timezoneOptions = useMemo(() => {
    const known = new Set<string>(SCHEDULE_TIMEZONES.map((t) => t.value));
    if (!known.has(timezone)) {
      return [
        { value: timezone, label: timezoneLabel(timezone) },
        ...SCHEDULE_TIMEZONES,
      ];
    }
    return [...SCHEDULE_TIMEZONES];
  }, [timezone]);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
          <ScheduleIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Pinterest post scheduling
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
          Your schedule is saved per account. Set timezone and interval (up to{' '}
          {MAX_INTERVAL_HOURS} hours). Times below are local clock hours in your
          timezone, starting at midnight.
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
            <Autocomplete
              options={timezoneOptions}
              value={
                timezoneOptions.find((o) => o.value === timezone) ?? {
                  value: timezone,
                  label: timezoneLabel(timezone),
                }
              }
              onChange={(_, option) => {
                if (option) setTimezone(option.value);
              }}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(a, b) => a.value === b.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Timezone"
                  margin="normal"
                  helperText="Example: Armenia → Asia/Yerevan"
                />
              )}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Interval: {formatInterval(intervalHours)}
            </Typography>

            <Slider
              value={intervalHours}
              onChange={(_, value) => setIntervalHours(value as number)}
              min={1}
              max={MAX_INTERVAL_HOURS}
              step={1}
              marks={PRESET_HOURS.map((h) => ({
                value: h,
                label: `${h}h`,
              }))}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}h`}
              sx={{ mt: 2, mb: 2 }}
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

            <Alert
              icon={<AccessTimeIcon fontSize="inherit" />}
              severity="info"
              sx={{ mb: 3 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {preview.postsPerDay} post{preview.postsPerDay === 1 ? '' : 's'} per day
                {enabled ? '' : ' (when enabled)'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                In <strong>{timezoneLabel(timezone)}</strong>, pins run at:{' '}
                {preview.postTimesLocal.join(', ')}.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Every {intervalHours}h from 00:00 fills a 24h day (
                {Math.round((24 / intervalHours) * 10) / 10} slots; 24÷{intervalHours}=
                {preview.postsPerDay}).
              </Typography>
            </Alert>

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
                Schedule saved for your account.
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
                Last updated:{' '}
                {new Date(data.updatedAt).toLocaleString(undefined, {
                  timeZone: timezone,
                })}{' '}
                ({timezone})
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
