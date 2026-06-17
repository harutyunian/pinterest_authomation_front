import apiClient from './client';
import type {
  CombinedVideoReady,
  CombineVideosPayload,
  GeneratedScene,
  GeneratedVideo,
  GenerateScenePayload,
  GenerateVideoPayload,
  RecoverPartialPayload,
  RecoverPartialResult,
  SceneBatchStatusResponse,
  SessionStatusResult,
  StartSceneBatchPayload,
  StartSceneBatchResponse,
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

export async function finalizeContinuityVideo(sessionId: string): Promise<CombinedVideoReady> {
  const { data } = await apiClient.post<CombinedVideoReady>(
    '/video-generation/finalize-continuity',
    { sessionId },
  );
  return data;
}

export async function getSessionStatus(
  sessionId: string,
): Promise<SessionStatusResult> {
  const { data } = await apiClient.get<SessionStatusResult>(
    `/video-generation/session/${encodeURIComponent(sessionId)}/status`,
  );
  return data;
}

export async function fetchSessionSceneBlob(
  sessionId: string,
  sceneIndex: number,
): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(
    `/video-generation/session/${encodeURIComponent(sessionId)}/scene/${sceneIndex}/stream`,
    { responseType: 'blob' },
  );
  return data;
}

export async function recoverPartialSession(
  payload: RecoverPartialPayload,
): Promise<RecoverPartialResult> {
  const { data } = await apiClient.post<RecoverPartialResult>(
    '/video-generation/recover-partial',
    payload,
  );
  return data;
}

export async function prefetchCharacterProfile(payload: {
  keyId: string;
  sessionId: string;
  imageBase64: string;
  imageMimeType: string;
}): Promise<{ profile: string }> {
  const { data } = await apiClient.post<{ profile: string }>(
    '/video-generation/character-profile',
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

export async function startSceneBatch(
  payload: StartSceneBatchPayload,
): Promise<StartSceneBatchResponse> {
  const { data } = await apiClient.post<StartSceneBatchResponse>(
    '/video-generation/scene-jobs',
    payload,
  );
  return data;
}

export async function getSceneBatchStatus(
  jobId: string,
): Promise<SceneBatchStatusResponse> {
  const { data } = await apiClient.get<SceneBatchStatusResponse>(
    `/video-generation/scene-jobs/${encodeURIComponent(jobId)}/status`,
  );
  return data;
}

export async function downloadSceneBatchResult(jobId: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(
    `/video-generation/scene-jobs/${encodeURIComponent(jobId)}/result`,
    { responseType: 'blob' },
  );
  return data;
}
