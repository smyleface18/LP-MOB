import { io, Socket } from 'socket.io-client';
import { GameService, SocketEvents } from '../types/type';

export class SocketService implements GameService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseURL = 'ws://192.168.0.15:3000'; // Cambiar según tu entorno

  constructor() {
    // NO inicializamos automáticamente
  }

  connect() {
    if (this.socket && this.socket.connected) return;

    this.socket = io(`${this.baseURL}/game`, {
      transports: ['websocket'],
      timeout: 10000,
      forceNew: true,
    });

    this.setupEventListeners();
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts; // prevenir reconexión
    this.socket?.disconnect();
    this.socket = null;
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
      this.emit('error', { error: err.message });
      this.handleReconnection();
    });

    const gameEvents: (keyof SocketEvents)[] = [
      'newQuestion',
      'answerResult',
      'gameEnded',
      'gameStopped',
    ];

    gameEvents.forEach(event => {
      this.socket?.on(event, (data: any) => {
        this.emit(event, data);
      });
    });
  }

  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', { error: 'Max reconnection attempts reached' });
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

  joinGame(userId: string) {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('joinGame', { userId });
  }

  startGame() {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('startGame');
  }

  stopGame() {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('stopGame');
  }

  submitAnswer(questionId: string, answer: string, userId: string) {
    if (!this.isConnected()) throw new Error('Socket not connected');
    this.socket?.emit('answer', { questionId, answer, userId });
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
    listeners.forEach(cb => {
      try { cb(data); } catch (err) { console.error(err); }
    });
  }

  destroy() {
    this.eventListeners.clear();
    this.disconnect();
  }
}

export const socketService = new SocketService();
