import apiClient from './client';
import type { LinkPageTheme, LinkPlatform, LinkProfile } from '../types/linkPages';

export async function getMyLinkPage(): Promise<LinkProfile> {
  const { data } = await apiClient.get<LinkProfile>('/link-pages/me');
  return data;
}

export async function updateMyLinkPage(payload: {
  slug?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  theme?: LinkPageTheme;
  published?: boolean;
}): Promise<LinkProfile> {
  const { data } = await apiClient.patch<LinkProfile>('/link-pages/me', payload);
  return data;
}

export async function createLinkItem(payload: {
  title: string;
  url: string;
  platform?: LinkPlatform;
  isActive?: boolean;
}): Promise<LinkProfile> {
  const { data } = await apiClient.post<LinkProfile>('/link-pages/me/links', payload);
  return data;
}

export async function updateLinkItem(
  id: string,
  payload: {
    title?: string;
    url?: string;
    platform?: LinkPlatform;
    isActive?: boolean;
  },
): Promise<LinkProfile> {
  const { data } = await apiClient.patch<LinkProfile>(`/link-pages/me/links/${id}`, payload);
  return data;
}

export async function deleteLinkItem(id: string): Promise<LinkProfile> {
  const { data } = await apiClient.delete<LinkProfile>(`/link-pages/me/links/${id}`);
  return data;
}

export async function reorderLinkItems(orderedIds: string[]): Promise<LinkProfile> {
  const { data } = await apiClient.put<LinkProfile>('/link-pages/me/links/reorder', {
    orderedIds,
  });
  return data;
}
