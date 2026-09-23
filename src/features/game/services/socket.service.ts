import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/shared/api/apiConfig';
import { useAppStore } from '@/store';
import { GameService, ModeMatch, SocketEvents } from '../types';
import { Level } from '@/shared/types/common';

const CLOCK_SYNC_SAMPLES = 5;
const CLOCK_SYNC_TIMEOUT_MS = 2_000;
const CLOCK_RESYNC_INTERVAL_MS = 30_000;

export class SocketService implements GameService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseURL = API_BASE_URL;
  // serverTime - Date.now() local. Los startsAt/endsAt de las preguntas vienen
  // en hora del servidor; con este offset todos los clientes los ubican en el
  // mismo instante real aunque sus relojes estén desfasados.
  private clockOffsetMs = 0;
  private clockSyncTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.connect();
  }

  connect() {
    if (this.socket && this.socket.connected) return;

    this.socket = io(`${this.baseURL}/game`, {
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
      // Función, no objeto: si no, el token queda "congelado" con el valor que
      // había al construir el socket (normalmente null, si esto corre antes del
      // login) y cada reconexión posterior lo reenvía sin actualizar — el socket
      // nunca vuelve a autenticarse aunque el usuario ya haya iniciado sesión.
      auth: (cb) => cb({ token: this.getAuthToken() }),
    });

    this.setupEventListeners();
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.socket?.disconnect();
    this.socket = null;
  }

  private getAuthToken(): string | null {
    // Acceder al token desde el store de Zustand
    try {
      const state = useAppStore.getState();
      return state.accessToken;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.startClockSync();
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      this.stopClockSync();
      this.emit('disconnect', { reason });
      if (reason !== 'io client disconnect') {
        this.handleReconnection();
      }
    });

    this.socket.on('connect_error', (err) => {
      this.emit('error', { message: err.message });
      this.handleReconnection();
    });

    const gameEvents: (keyof SocketEvents)[] = [
      'error',
      'newQuestion',
      'answerResult',
      'questionEnded',
      'gameEnded',
      'playersUpdated',
      'gameStarted',
      'rematchStatus',
      'rematchReady',
    ];

    gameEvents.forEach((event) => {
      this.socket?.on(event, (data: any) => {
        this.emit(event, data);
      });
    });
  }

  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', { message: 'Max reconnection attempts reached' });
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * this.reconnectAttempts, 10000);

    setTimeout(() => {
      if (!this.isConnected()) {
        this.socket?.connect();
      }
    }, delay);
  }

  /** Hora actual estimada del servidor (epoch ms). */
  serverNow(): number {
    return Date.now() + this.clockOffsetMs;
  }

  /**
   * Estima el offset con el servidor (algoritmo de Cristian, como un NTP
   * simplificado): por cada muestra, offset = serverTime - punto medio del
   * viaje. Se queda con la de menor RTT, que es la de menor error posible.
   */
  async syncClock(): Promise<void> {
    let best: { rtt: number; offset: number } | null = null;

    for (let i = 0; i < CLOCK_SYNC_SAMPLES; i++) {
      if (!this.socket?.connected) return;
      try {
        const sentAt = Date.now();
        const { serverTime } = (await this.socket
          .timeout(CLOCK_SYNC_TIMEOUT_MS)
          .emitWithAck('timeSync')) as { serverTime: number };
        const receivedAt = Date.now();
        const rtt = receivedAt - sentAt;
        const offset = serverTime - (sentAt + receivedAt) / 2;
        if (!best || rtt < best.rtt) best = { rtt, offset };
      } catch {
        // Muestra perdida (timeout): se usan las demás.
      }
    }

    if (best) this.clockOffsetMs = best.offset;
  }

  private startClockSync() {
    this.stopClockSync();
    void this.syncClock();
    // Re-sincroniza periódicamente: los relojes derivan y la red cambia.
    this.clockSyncTimer = setInterval(() => void this.syncClock(), CLOCK_RESYNC_INTERVAL_MS);
  }

  private stopClockSync() {
    if (this.clockSyncTimer) clearInterval(this.clockSyncTimer);
    this.clockSyncTimer = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  createGame(level: Level, modeMatch: ModeMatch) {
    if (!this.isConnected()) throw new Error('Socket not connected');

    this.socket?.emit('createGame', { level, modeMatch }, (response: any) => {
      if (response.ok && response.data) {
        const { roomId, level, modeMatch } = response.data;
        // Emitir evento interno para que el hook actualice el estado
        this.emit('gameCreated', {
          roomId: roomId,
          level: level,
          mode: modeMatch,
        });
      } else {
        console.error('[SocketService] ❌ createGame failed:', response);
        this.emit('error', { message: response.message || 'Failed to create game' });
      }
    });
  }

  joinGame(roomId: string) {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('joinGame', { roomId }, (response: any) => {
      if (response.ok && response.data) {
        const { roomId: returnedRoomId, level, modeMatch } = response.data;
        // Emitir evento interno para que el hook actualice el estado
        this.emit('gameJoined', {
          roomId: returnedRoomId,
          level: level,
          mode: modeMatch,
        });
      } else {
        console.error('[SocketService] ❌ joinGame failed:', response);
        this.emit('error', { message: response.message || 'Failed to join game' });
      }
    });
  }

  startGame() {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('startGame');
  }

  requestRematch() {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('requestRematch');
  }

  leaveRoom() {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('leaveRoom');
  }

  submitAnswer(questionId: string, answerId: string) {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('answer', { questionId, answerId });
  }

  on<T>(event: string, callback: (data: T) => void) {
    if (!this.eventListeners.has(event)) this.eventListeners.set(event, []);
    this.eventListeners.get(event)?.push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const listeners = this.eventListeners.get(event);
    if (!listeners) return;
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (!listeners) return;
    listeners.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error(err);
      }
    });
  }

  destroy() {
    this.stopClockSync();
    this.eventListeners.clear();
    this.disconnect();
  }
}

export const socketService = new SocketService();
