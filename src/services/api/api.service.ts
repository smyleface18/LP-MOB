import { ApiResponse } from '@/types/type';
import { API_BASE_URL } from './apiConfig';
import * as SecureStore from 'expo-secure-store';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    console.log('ejecutando request: ', endpoint, options);
    const url = `${this.baseURL}${endpoint}`;
    const token = await SecureStore.getItemAsync('accessToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 204) {
        return {
          ok: true,
          data: null,
          message: 'Operation successful',
        };
      }

      const responseBody = await response.json();

      console.log('API raw response:', responseBody);

      if (!response.ok) {
        console.error('API error body:', responseBody);
        return {
          ok: false,
          data: null,
          message: this.normalizeApiMessage(responseBody.message),
        };
      }

      return {
        ok: true,
        data: responseBody.data,
        message: this.normalizeApiMessage(responseBody.message),
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  private normalizeApiMessage(message: string | string[]): string {
    if (Array.isArray(message)) {
      return message.join('\n');
    }
    return message;
  }
}

export const apiService = new ApiService();
