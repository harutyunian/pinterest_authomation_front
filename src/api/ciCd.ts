import apiClient from './client';

export async function fetchCiCdStatus(): Promise<string> {
  const { data } = await apiClient.get('/ci-cd', { responseType: 'text' });
  return String(data).trim();
}
