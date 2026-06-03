import axios, { type AxiosError } from 'axios';
import apiClient from './client';
import type {
  GenerationStatusResponse,
  StartGenerationPayload,
  StartGenerationResponse,
  UploadImageResponse,
  UploadVideoResponse,
} from '../types/characterReplacement';
import type { VideoModelsResponse } from '../types/videoGeneration';

const VEO_API_BASE = '/veo/character-replacement';

function mapAxiosError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string | string[]; error?: string }>;
    const message = axiosError.response?.data?.message;
    if (typeof message === 'string') {
      return new Error(message);
    }
    if (Array.isArray(message)) {
      return new Error(message.join(', '));
    }
    if (axiosError.response?.data?.error) {
      return new Error(axiosError.response.data.error);
    }
    if (axiosError.message) {
      return new Error(axiosError.message);
    }
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallback);
}

export async function getCharacterReplacementModels(
  keyId: string,
): Promise<VideoModelsResponse> {
  try {
    const { data } = await apiClient.get<VideoModelsResponse>(
      `${VEO_API_BASE}/models`,
      { params: { keyId } },
    );
    return data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to load Veo models.');
  }
}

export async function uploadVideo(file: File): Promise<UploadVideoResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await apiClient.post<UploadVideoResponse>(
      `${VEO_API_BASE}/upload/video`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data;
  } catch (error) {
    throw mapAxiosError(error, 'Video upload failed.');
  }
}

export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await apiClient.post<UploadImageResponse>(
      `${VEO_API_BASE}/upload/image`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data;
  } catch (error) {
    throw mapAxiosError(error, 'Image upload failed.');
  }
}

export async function startGeneration(
  payload: StartGenerationPayload,
): Promise<StartGenerationResponse> {
  try {
    const { data } = await apiClient.post<StartGenerationResponse>(
      `${VEO_API_BASE}/generate`,
      payload,
    );
    return data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to start generation.');
  }
}

export async function getGenerationStatus(
  jobId: string,
): Promise<GenerationStatusResponse> {
  try {
    const { data } = await apiClient.get<GenerationStatusResponse>(
      `${VEO_API_BASE}/generate/${encodeURIComponent(jobId)}/status`,
    );
    return data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to fetch generation status.');
  }
}

export async function downloadResult(jobId: string): Promise<Blob> {
  try {
    const { data } = await apiClient.get<Blob>(
      `${VEO_API_BASE}/generate/${encodeURIComponent(jobId)}/download`,
      { responseType: 'blob' },
    );
    return data;
  } catch (error) {
    throw mapAxiosError(error, 'Failed to download generated video.');
  }
}
