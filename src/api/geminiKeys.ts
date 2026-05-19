import apiClient from './client';
import type {
  CreateGeminiKeyPayload,
  GeminiKey,
  UpdateGeminiKeyPayload,
} from '../types/geminiKey';

export async function getGeminiKeys(): Promise<GeminiKey[]> {
  const { data } = await apiClient.get<GeminiKey[]>('/gemini-keys');
  return data;
}

export async function validateGeminiKey(apiKey: string): Promise<void> {
  await apiClient.post('/gemini-keys/validate', { apiKey });
}

export async function createGeminiKey(
  payload: CreateGeminiKeyPayload,
): Promise<GeminiKey> {
  const { data } = await apiClient.post<GeminiKey>('/gemini-keys', payload);
  return data;
}

export async function updateGeminiKey(
  id: string,
  payload: UpdateGeminiKeyPayload,
): Promise<GeminiKey> {
  const { data } = await apiClient.patch<GeminiKey>(
    `/gemini-keys/${id}`,
    payload,
  );
  return data;
}

export async function deleteGeminiKey(id: string): Promise<void> {
  await apiClient.delete(`/gemini-keys/${id}`);
}
