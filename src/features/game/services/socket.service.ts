import { io, Socket } from 'socket.io-client';
import { Level } from '@/shared/types/common';
import { GameService, ModeMatch, PlayerInfo } from '../types';
import { ApiResponse } from '@/shared/api/types';
import { useAppStore } from '@/store';
import { EventEmitter } from './EventEmitter';
import { ReconnectionManager } from './ReconnectionManager';
import { SocketConfig } from './SocketConfig';
import { ServerToClientEvents, ClientToServerEvents } from './SocketEvents';

// ==============================
// SERVICE SOCKET
// ==============================

/**
 * Servicio principal de Socket
 * Responsabilidades:
 * - Gestionar conexión Socket.io
 * - Emitir y escuchar eventos
 * - Exponer métodos de acciones del juego
 */
export class SocketService extends EventEmitter<ServerToClientEvents> implements GameService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private reconnectionManager: ReconnectionManager;

  constructor() {
    super();
    this.reconnectionManager = new ReconnectionManager(SocketConfig.getReconnectionConfig());
  }

  // ==============================
  // CONNECTION MANAGEMENT
  // ==============================

  /**
   * Establecer conexión con Socket.io
   */
  connect(): void {
    if (this.socket?.connected) return;

    const accessToken = useAppStore.getState().accessToken || '';

    const config = SocketConfig.getConnectionConfig(accessToken);
    const auth = SocketConfig.getAuthHeaders(accessToken);

    this.socket = io(`${config.url}${config.namespace}`, {
      transports: config.transports as any,
      timeout: config.timeout,
      forceNew: config.forceNew,
      auth,
    });

    this.setupEventListeners();
  }

  /**
   * Desconectar del socket
   */
  disconnect(): void {
    this.reconnectionManager.reset();
    this.socket?.disconnect();
    this.socket = null;
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ==============================
  // SOCKET EVENTS SETUP
  // ==============================

  /**
   * Configurar listeners de eventos del socket
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Eventos de conexión
    this.socket.on('connect', () => this.handleConnect());
    this.socket.on('disconnect', (reason) => this.handleDisconnect(reason));
    this.socket.on('connect_error', (err) => this.handleConnectError(err));

    // Eventos de juego
    this.registerGameEventListener('newQuestion');
    this.registerGameEventListener('answerResult');
    this.registerGameEventListener('questionEnded');
    this.registerGameEventListener('gameEnded');
    this.registerGameEventListener('playersUpdated');
    this.registerGameEventListener('error');
  }

  /**
   * Registrar listener genérico para eventos de juego
   */
  private registerGameEventListener<K extends keyof ServerToClientEvents>(event: K): void {
    (this.socket as any).on(event, (data: ServerToClientEvents[K]) => {
      this.emit(event, data);
    });
  }

  /**
   * Manejar evento de conexión exitosa
   */
  private handleConnect(): void {
    this.reconnectionManager.reset();
    this.emit('connect', undefined);
  }

  /**
   * Manejar evento de desconexión
   */
  private handleDisconnect(reason: string): void {
    this.emit('disconnect', { reason });

    // No reintentar si fue una desconexión intencional
    if (reason !== 'io client disconnect') {
      this.attemptReconnection();
    }
  }

  /**
   * Manejar error de conexión
   */
  private handleConnectError(err: Error): void {
    this.emit('error', { message: err.message });
    this.attemptReconnection();
  }

  /**
   * Intentar reconectar con exponential backoff
   */
  private attemptReconnection(): void {
    if (this.reconnectionManager.hasReachedMaxAttempts()) {
      this.emit('error', {
        message: 'Max reconnection attempts reached',
      });
      return;
    }

    this.reconnectionManager.scheduleReconnection(
      () => {
        if (!this.isConnected()) {
          this.socket?.connect();
        }
      },
      () => this.isConnected(),
    );
  }

  // ==============================
  // 🎮 GAME ACTIONS
  // ==============================

  /**
   * Crear una nueva partida
   */
  createGame(level: Level, modeMatch: ModeMatch): void {
    this.ensureConnected();

    this.socket!.emit('createGame', { level, modeMatch }, (response) => {
      this.handleGameActionResponse(response, 'gameCreated', response.data);
    });
  }

  /**
   * Unirse a una partida existente
   */
  joinGame(roomId: string): void {
    this.ensureConnected();

    this.socket!.emit('joinGame', { roomId }, (response) => {
      this.handleGameActionResponse(response, 'gameJoined', response.data);
    });
  }

  /**
   * Iniciar la partida
   */
  startGame(): void {
    this.ensureConnected();
    this.socket!.emit('startGame');
  }

  /**
   * Salir de la sala
   */
  leaveRoom(): void {
    this.ensureConnected();
    this.socket!.emit('leaveRoom');
  }

  /**
   * Enviar respuesta a una pregunta
   */
  submitAnswer(questionId: string, answerId: string): void {
    this.ensureConnected();
    this.socket!.emit('answer', { questionId, answerId });
  }

  // ==============================
  // 🛠️ UTILITIES
  // ==============================

  /**
   * Verificar que el socket está conectado
   */
  private ensureConnected(): void {
    if (!this.isConnected()) {
      throw new Error('Socket not connected');
    }
  }

  /**
   * Manejar respuesta de acciones del juego
   */
  private handleGameActionResponse<K extends keyof ServerToClientEvents>(
    response: ApiResponse<any>,
    event: K,
    data: any,
  ): void {
    if (response.ok && data) {
      this.emit(event, data as ServerToClientEvents[K]);
    } else {
      this.emit('error', {
        message: response.message?.toLocaleString() ?? 'Failed to complete game action',
      });
    }
  }

  // ==============================
  // 🧹 CLEANUP
  // ==============================

  /**
   * Limpiar recursos
   */
  destroy(): void {
    this.reconnectionManager.destroy();
    this.disconnect();
    super.destroy();
  }
}

export const socketService = new SocketService();
