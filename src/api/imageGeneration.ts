import apiClient from './client';
import type {
  GenerateImagePayload,
  GeneratedImage,
  ImageModelsResponse,
} from '../types/imageGeneration';

export async function getImageModels(
  keyId: string,
): Promise<ImageModelsResponse> {
  const { data } = await apiClient.get<ImageModelsResponse>(
    '/image-generation/models',
    { params: { keyId } },
  );
  return data;
}

export async function generateImage(
  payload: GenerateImagePayload,
): Promise<GeneratedImage> {
  const { data } = await apiClient.post<GeneratedImage>(
    '/image-generation/generate',
    payload,
  );
  return data;
}
