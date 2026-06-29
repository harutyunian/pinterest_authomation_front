import publicApiClient from './publicClient';
import type {
  GeneratedImage,
  ImageModelsResponse,
} from '../types/imageGeneration';

export interface PublicGenerateImagePayload {
  apiKey: string;
  model: string;
  prompt: string;
}

export async function getPublicImageModels(
  apiKey: string,
): Promise<ImageModelsResponse> {
  const { data } = await publicApiClient.post<ImageModelsResponse>(
    '/public-tools/image-generation/models',
    { apiKey },
  );
  return data;
}

export async function generatePublicImage(
  payload: PublicGenerateImagePayload,
): Promise<GeneratedImage> {
  const { data } = await publicApiClient.post<GeneratedImage>(
    '/public-tools/image-generation/generate',
    payload,
  );
  return data;
}
