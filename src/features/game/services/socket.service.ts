import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/shared/api/apiConfig';
import { useAppStore } from '@/store';
import { GameService, Level, ModeMatch, SocketEvents } from '@/shared/types/Type';

export class SocketService implements GameService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseURL = API_BASE_URL;

  constructor() {
    this.connect();
  }

  connect() {
    if (this.socket && this.socket.connected) return;

    this.socket = io(`${this.baseURL}/game`, {
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
      auth: {
        token: this.getAuthToken(), // Necesitas implementar esto
      },
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
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
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

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  createGame(level: Level, modeMatch: ModeMatch) {

    if (!this.isConnected()) throw new Error('Socket not connected');

    this.socket?.emit('createGame', { level, modeMatch }, (response: any) => {
              console.log(`[SocketService] 🎮 Creating game with level: ${level}, mode: ${modeMatch}`);
      console.log('[SocketService] 🎮 createGame response:', response);
      if (response.ok && response.data) {
        const { roomId, level, modeMatch } = response.data;
        console.log('[SocketService] ✅ Emitting gameCreated with:', { roomId, level, modeMatch });
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
      console.log('[SocketService] 👥 joinGame response:', response);
      if (response.ok && response.data) {
        const { roomId: returnedRoomId, level, modeMatch } = response.data;
        console.log('[SocketService] ✅ Emitting gameJoined with:', { returnedRoomId, level, modeMatch });
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
    this.eventListeners.clear();
    this.disconnect();
  }
}

export const socketService = new SocketService();
