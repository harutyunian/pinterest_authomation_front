export interface SchedulePreview {
  postsPerDay: number;
  postTimesLocal: string[];
}

export function computeSchedulePreview(intervalHours: number): SchedulePreview {
  const postTimesLocal: string[] = [];
  for (let hour = 0; hour < 24; hour += intervalHours) {
    postTimesLocal.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return {
    postsPerDay: postTimesLocal.length,
    postTimesLocal,
  };
}

export function formatInterval(hours: number): string {
  if (hours === 1) return 'every hour';
  return `every ${hours} hours`;
}

export function timezoneLabel(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(new Date());
    const offset = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    return offset ? `${timezone} (${offset})` : timezone;
  } catch {
    return timezone;
  }
}
