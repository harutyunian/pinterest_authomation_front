import apiClient from './client';
import type {
  CombinedVideoReady,
  CombineVideosPayload,
  GeneratedScene,
  GeneratedVideo,
  GenerateScenePayload,
  GenerateVideoPayload,
  StoredVideoItem,
  VideoModelsResponse,
} from '../types/videoGeneration';

export async function getVideoModels(
  keyId: string,
): Promise<VideoModelsResponse> {
  const { data } = await apiClient.get<VideoModelsResponse>(
    '/video-generation/models',
    { params: { keyId } },
  );
  return data;
}

export async function generateVideo(
  payload: GenerateVideoPayload,
): Promise<GeneratedVideo> {
  const { data } = await apiClient.post<GeneratedVideo>(
    '/video-generation/generate',
    payload,
  );
  return data;
}

export async function generateScene(
  payload: GenerateScenePayload,
): Promise<GeneratedScene> {
  const { data } = await apiClient.post<GeneratedScene>(
    '/video-generation/generate-scene',
    payload,
  );
  return data;
}

export async function combineVideos(
  payload: CombineVideosPayload,
): Promise<CombinedVideoReady> {
  const { data } = await apiClient.post<CombinedVideoReady>(
    '/video-generation/combine',
    payload,
  );
  return data;
}

export async function downloadCombinedVideo(sessionId: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(
    `/video-generation/session/${encodeURIComponent(sessionId)}/download`,
    { responseType: 'blob' },
  );
  return data;
}

export async function getStoredVideos(): Promise<StoredVideoItem[]> {
  const { data } = await apiClient.get<{ videos: StoredVideoItem[] }>(
    '/video-generation/stored',
  );
  return data.videos;
}

export async function fetchStoredVideoBlob(id: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(
    `/video-generation/stored/${encodeURIComponent(id)}/stream`,
    { responseType: 'blob' },
  );
  return data;
}

export async function deleteStoredVideo(id: string): Promise<void> {
  await apiClient.delete(
    `/video-generation/stored/${encodeURIComponent(id)}`,
  );
}
