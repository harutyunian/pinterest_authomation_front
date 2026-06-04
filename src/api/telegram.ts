import apiClient from './client';
import type {
  TelegramChannelSettings,
  TelegramPublishResult,
  TelegramValidateResult,
  UpdateTelegramSettingsPayload,
} from '../types/telegram';

export async function getTelegramSettings(): Promise<TelegramChannelSettings> {
  const { data } = await apiClient.get<TelegramChannelSettings>('/telegram/settings');
  return data;
}

export async function updateTelegramSettings(
  payload: UpdateTelegramSettingsPayload,
): Promise<TelegramChannelSettings> {
  const { data } = await apiClient.patch<TelegramChannelSettings>(
    '/telegram/settings',
    payload,
  );
  return data;
}

export async function validateTelegram(): Promise<TelegramValidateResult> {
  const { data } = await apiClient.post<TelegramValidateResult>('/telegram/validate');
  return data;
}

export async function publishTelegramPost(text?: string): Promise<TelegramPublishResult> {
  const { data } = await apiClient.post<TelegramPublishResult>(
    '/telegram/posts/publish',
    text ? { text } : {},
  );
  return data;
}
