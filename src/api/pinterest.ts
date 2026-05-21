import apiClient from './client';
import type {
  PinterestBoard,
  PinterestBoardsResponse,
  PinterestConnectionStatus,
  PinterestOAuthUrl,
  PublishPinPayload,
  PublishPinResponse,
} from '../types/pinterest';

export async function getConnection(): Promise<PinterestConnectionStatus> {
  const { data } = await apiClient.get<PinterestConnectionStatus>(
    '/pinterest/connection',
  );
  return data;
}

export async function getOAuthUrl(): Promise<PinterestOAuthUrl> {
  const { data } = await apiClient.get<PinterestOAuthUrl>(
    '/pinterest/oauth/url',
  );
  return data;
}

export async function getBoards(): Promise<PinterestBoardsResponse> {
  const { data } = await apiClient.get<PinterestBoardsResponse>(
    '/pinterest/boards',
  );
  return data;
}

export async function createPinterestBoard(
  name = 'Home Decor Pins',
): Promise<PinterestBoard> {
  const { data } = await apiClient.post<PinterestBoard>('/pinterest/boards', {
    name,
  });
  return data;
}

export async function disconnectPinterest(): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    '/pinterest/connection',
  );
  return data;
}

export async function publishPin(
  payload: PublishPinPayload,
): Promise<PublishPinResponse> {
  const { data } = await apiClient.post<PublishPinResponse>(
    '/pinterest/pins/publish',
    payload,
  );
  return data;
}
