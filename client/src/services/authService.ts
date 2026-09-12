import { api } from './api';
import { UserProfile } from '../types';

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export const authService = {
  async login(email: string, password?: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    if (res.token) {
      api.setToken(res.token);
    }
    return res;
  },

  async register(name: string, email: string, password?: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    if (res.token) {
      api.setToken(res.token);
    }
    return res;
  },

  async getProfile(): Promise<UserProfile> {
    const res = await api.get<{ user: UserProfile }>('/auth/me');
    return res.user;
  },

  logout() {
    api.setToken(null);
  },
};
