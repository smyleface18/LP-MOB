/**
 * Configuración centralizada para Socket.io
 * Facilita cambios y reutilización en distintos entornos
 */

import { API_BASE_URL } from '@/shared/api/apiConfig';

export interface SocketConnectionConfig {
  url: string;
  namespace: string;
  transports: string[];
  timeout: number;
  forceNew: boolean;
}

export interface SocketReconnectionConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export class SocketConfig {
  /**
   * Configuración de conexión Socket.io
   */
  static getConnectionConfig(token: string): SocketConnectionConfig {
    return {
      url: API_BASE_URL,
      namespace: '/game',
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
    };
  }

  /**
   * Configuración de reconexión
   */
  static getReconnectionConfig(): SocketReconnectionConfig {
    return {
      maxAttempts: 5,
      baseDelay: 1000,
      maxDelay: 10000,
    };
  }

  /**
   * Obtener auth headers para socket
   */
  static getAuthHeaders(token: string): Record<string, string> {
    return {
      token,
    };
  }
}
