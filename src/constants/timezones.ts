export const SCHEDULE_TIMEZONES = [
  { value: 'Asia/Yerevan', label: 'Armenia — Yerevan' },
  { value: 'Europe/London', label: 'United Kingdom — London' },
  { value: 'Europe/Paris', label: 'France — Paris' },
  { value: 'Europe/Berlin', label: 'Germany — Berlin' },
  { value: 'Europe/Moscow', label: 'Russia — Moscow' },
  { value: 'Asia/Dubai', label: 'UAE — Dubai' },
  { value: 'Asia/Tbilisi', label: 'Georgia — Tbilisi' },
  { value: 'Asia/Istanbul', label: 'Turkey — Istanbul' },
  { value: 'America/New_York', label: 'US — Eastern' },
  { value: 'America/Chicago', label: 'US — Central' },
  { value: 'America/Los_Angeles', label: 'US — Pacific' },
  { value: 'UTC', label: 'UTC' },
] as const;

export function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
