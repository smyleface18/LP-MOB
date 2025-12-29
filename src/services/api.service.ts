import { ResponseApi } from "../types/type";
import { API_BASE_URL } from "./apiConfig";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ResponseApi<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const responseBody = await response.json();

      if (!response.ok) {
        console.error("API error body:", responseBody);
        return {
          ok: false,
          data: null,
          message: responseBody.message,
        };
      }

      return {
        ok: true,
        data: responseBody,
        message: responseBody.message,
      };
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ResponseApi<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<ResponseApi<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<ResponseApi<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ResponseApi<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiService = new ApiService();
