import { API_BASE_URL } from './apiConfig';
import * as SecureStore from 'expo-secure-store';
import { ApiResponse } from './types';

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

      const rawText = await response.text();
      const responseBody = rawText ? this.safeJsonParse(rawText) : null;

      if (responseBody) {
        console.log('API raw response:', responseBody);
      }

      if (!response.ok) {
        if (responseBody) {
          console.error('API error body:', responseBody);
        }

        return {
          ok: false,
          data: null,
          message: responseBody?.message
            ? this.normalizeApiMessage(responseBody.message)
            : response.statusText || 'Request failed',
        };
      }

      return {
        ok: true,
        data: responseBody?.data ?? null,
        message: responseBody?.message
          ? this.normalizeApiMessage(responseBody.message)
          : 'Operation successful',
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

  private safeJsonParse(rawText: string): any | null {
    try {
      return JSON.parse(rawText);
    } catch (error) {
      console.error('API response is not valid JSON:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();
