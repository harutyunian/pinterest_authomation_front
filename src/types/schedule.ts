export interface PostScheduleSettings {
  id: string;
  intervalHours: number;
  timezone: string;
  enabled: boolean;
  updatedAt: string;
  postsPerDay: number;
  postTimesLocal: string[];
}

export interface UpdateSchedulePayload {
  intervalHours?: number;
  timezone?: string;
  enabled?: boolean;
}
