import apiClient from './client';
import type {
  PostScheduleSettings,
  UpdateSchedulePayload,
} from '../types/schedule';

export async function getSchedule(): Promise<PostScheduleSettings> {
  const { data } = await apiClient.get<PostScheduleSettings>('/schedule');
  return data;
}

export async function updateSchedule(
  payload: UpdateSchedulePayload,
): Promise<PostScheduleSettings> {
  const { data } = await apiClient.patch<PostScheduleSettings>(
    '/schedule',
    payload,
  );
  return data;
}
