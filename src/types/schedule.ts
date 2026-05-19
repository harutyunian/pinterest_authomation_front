export interface PostScheduleSettings {
  id: string;
  intervalHours: number;
  enabled: boolean;
  updatedAt: string;
}

export interface UpdateSchedulePayload {
  intervalHours?: number;
  enabled?: boolean;
}
