import apiClient from './client';
import type {
  GenerateIdeasPayload,
  GeneratePinPayload,
  GeneratedPin,
  IdeasResponse,
} from '../types/pinterestContent';

export async function generateIdeas(
  payload: GenerateIdeasPayload,
): Promise<IdeasResponse> {
  const { data } = await apiClient.post<IdeasResponse>(
    '/pinterest-content/ideas',
    payload,
  );
  return data;
}

export async function generatePin(
  payload: GeneratePinPayload,
): Promise<GeneratedPin> {
  const { data } = await apiClient.post<GeneratedPin>(
    '/pinterest-content/generate',
    payload,
  );
  return data;
}
