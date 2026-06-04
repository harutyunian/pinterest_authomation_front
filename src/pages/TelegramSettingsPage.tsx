import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import TelegramIcon from '@mui/icons-material/Telegram';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  getTelegramSettings,
  publishTelegramPost,
  updateTelegramSettings,
  validateTelegram,
} from '../api/telegram';
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
import { AdminCard } from '../components/layout/AdminCard';

const PRESET_HOURS = [1, 2, 3, 4, 5] as const;
const MAX_INTERVAL_HOURS = 5;

export function TelegramSettingsPage() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['telegram-settings', userId],
    queryFn: getTelegramSettings,
    enabled: Boolean(userId),
  });

  const [botToken, setBotToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [placeholderMessage, setPlaceholderMessage] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [intervalHours, setIntervalHours] = useState(5);
  const [timezone, setTimezone] = useState(detectBrowserTimezone());
  const [saved, setSaved] = useState(false);
  const [validateResult, setValidateResult] = useState<{
    botUsername: string | null;
    channelTitle: string | null;
  } | null>(null);

  useEffect(() => {
    if (data) {
      setBotToken('');
      setChannelId(data.channelId);
      setPlaceholderMessage(data.placeholderMessage);
      setEnabled(data.enabled);
      setScheduleEnabled(data.scheduleEnabled);
      setIntervalHours(data.intervalHours);
      setTimezone(data.timezone);
    }
  }, [data]);

  const preview = useMemo(
    () => computeSchedulePreview(intervalHours),
    [intervalHours],
  );

  const saveMutation = useMutation({
    mutationFn: updateTelegramSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-settings', userId] });
      setBotToken('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const validateMutation = useMutation({
    mutationFn: validateTelegram,
    onSuccess: (result) => {
      setValidateResult({
        botUsername: result.bot.username,
        channelTitle: result.channel.title ?? result.channel.username,
      });
    },
    onError: () => setValidateResult(null),
  });

  const publishMutation = useMutation({
    mutationFn: () => publishTelegramPost(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-settings', userId] });
    },
  });

  const hasChanges =
    data &&
    (botToken !== '' ||
      channelId !== data.channelId ||
      placeholderMessage !== data.placeholderMessage ||
      enabled !== data.enabled ||
      scheduleEnabled !== data.scheduleEnabled ||
      intervalHours !== data.intervalHours ||
      timezone !== data.timezone);

  const handleSave = () => {
    const payload: Parameters<typeof updateTelegramSettings>[0] = {
      channelId,
      enabled,
      scheduleEnabled,
      intervalHours,
      timezone,
      placeholderMessage,
    };
    if (botToken.trim()) {
      payload.botToken = botToken.trim();
    }
    saveMutation.mutate(payload);
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

  const canValidateOrPublish = data?.hasBotToken && channelId.trim() !== '';

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Could not load Telegram settings.</Alert>;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <Stack spacing={3}>
          <AdminCard>
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
              <TelegramIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Bot connection
              </Typography>
              {data && (
                <Chip
                  label={data.enabled ? 'Active' : 'Paused'}
                  size="small"
                  color={data.enabled ? 'success' : 'default'}
                />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add your bot token from @BotFather and channel ID. The bot must be an
              administrator with permission to post messages.
            </Typography>

            {data && (
              <>
                <TextField
                  fullWidth
                  label="Bot token"
                  type="password"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder={
                    data.hasBotToken
                      ? `Saved (${data.maskedBotToken}) — leave empty to keep`
                      : 'Paste token from @BotFather'
                  }
                  margin="normal"
                  autoComplete="off"
                />
                <TextField
                  fullWidth
                  label="Channel ID"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="@mychannel or -1001234567890"
                  margin="normal"
                  helperText="Public @username or numeric supergroup/channel id"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable bot"
                  sx={{ mt: 1, display: 'block' }}
                />
              </>
            )}
          </AdminCard>

          <AdminCard>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Messaging
            </Typography>
            {data && (
              <TextField
                fullWidth
                label="Placeholder message"
                value={placeholderMessage}
                onChange={(e) => setPlaceholderMessage(e.target.value)}
                multiline
                minRows={3}
                helperText="Used for scheduled posts and manual publish when no custom text is set"
              />
            )}
          </AdminCard>

          <AdminCard>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Posting schedule
            </Typography>
            {data && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={scheduleEnabled}
                      onChange={(e) => setScheduleEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable automatic posting"
                  sx={{ mb: 2, display: 'block' }}
                />
                <Autocomplete
                  onMouseDown={(event) => event.preventDefault()}
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
                      helperText="Used for schedule preview"
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
              </>
            )}
          </AdminCard>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Stack spacing={3}>
          {data && (
            <AdminCard>
              <Alert
                icon={<AccessTimeIcon fontSize="inherit" />}
                severity="info"
                sx={{ mb: 0 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {preview.postsPerDay} post{preview.postsPerDay === 1 ? '' : 's'} per day
                  {scheduleEnabled && enabled ? '' : ' (when schedule is enabled)'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  In <strong>{timezoneLabel(timezone)}</strong>, posts run every{' '}
                  {intervalHours}h after the last post.
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Preview slots: {preview.postTimesLocal.join(', ')}.
                </Typography>
              </Alert>
            </AdminCard>
          )}

          <AdminCard>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Actions
            </Typography>

            {validateResult && (
              <Alert severity="success" icon={<VerifiedIcon />} sx={{ mb: 2 }}>
                Connected: bot @{validateResult.botUsername ?? '—'} → channel{' '}
                {validateResult.channelTitle ?? channelId}
              </Alert>
            )}
            {saved && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Telegram settings saved.
              </Alert>
            )}
            {saveMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to save settings. Try again.
              </Alert>
            )}
            {validateMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Connection check failed. Verify token, channel ID, and bot admin rights.
              </Alert>
            )}
            {publishMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to publish. Save settings and check bot permissions.
              </Alert>
            )}
            {publishMutation.isSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Posted to channel (message id: {publishMutation.data.messageId}).
              </Alert>
            )}

            <Stack spacing={1.5}>
              <Button
                type="button"
                variant="contained"
                fullWidth
                onClick={handleSave}
                disabled={!hasChanges || saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Save settings'
                )}
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                startIcon={<VerifiedIcon />}
                onClick={() => validateMutation.mutate()}
                disabled={!canValidateOrPublish || validateMutation.isPending}
              >
                {validateMutation.isPending ? (
                  <CircularProgress size={22} />
                ) : (
                  'Test connection'
                )}
              </Button>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                startIcon={<SendIcon />}
                onClick={() => publishMutation.mutate()}
                disabled={!canValidateOrPublish || publishMutation.isPending}
              >
                {publishMutation.isPending ? (
                  <CircularProgress size={22} />
                ) : (
                  'Publish now'
                )}
              </Button>
            </Stack>

            {data?.lastPostedAt && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Last post:{' '}
                {new Date(data.lastPostedAt).toLocaleString(undefined, {
                  timeZone: timezone,
                })}
              </Typography>
            )}
          </AdminCard>
        </Stack>
      </Grid>
    </Grid>
  );
}
