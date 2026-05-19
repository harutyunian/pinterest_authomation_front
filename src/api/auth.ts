import apiClient from './client';
import type { LoginResponse, User } from '../types/user';

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials,
  );
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}
