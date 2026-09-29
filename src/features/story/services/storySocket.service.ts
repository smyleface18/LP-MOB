import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/shared/api/apiConfig';
import { estimateClockOffset } from '@/shared/api/clockSync';
import { useAppStore } from '@/store';
import {
  DraftInput,
  PanelReviewResult,
  ReviewManifest,
  StoryAck,
  StoryConfig,
  StoryEvents,
  StoryGameState,
  StoryLobby,
  StoryRules,
  StoryServerEvents,
} from '../types';

const CLOCK_RESYNC_INTERVAL_MS = 30_000;
/** Espera por defecto de un ack del servidor. */
const ACK_TIMEOUT_MS = 10_000;
/** La revisión con IA tiene hasta 8 s en el servidor, más la red. */
const REVIEW_ACK_TIMEOUT_MS = 20_000;

const SERVER_EVENTS: (keyof StoryServerEvents)[] = [
  'lobbyUpdated',
  'turnStarted',
  'panelReviewResult',
  'authorStatus',
  'panelDraftReviewed',
  'panelConfirmed',
  'panelReaction',
  'storyProcessing',
  'storyReviewReady',
  'panelMediaReady',
  'gameState',
  'storyError',
];

type Listener<K extends keyof StoryEvents> = (data: StoryEvents[K]) => void;

/**
 * Socket del namespace /story (modo Historieta). Es independiente del de la
 * trivia (/game): otra conexión, otras salas. Cada acción del cliente espera
 * el ack del servidor y devuelve `StoryAck` (los errores traen `code`); los
 * eventos de la sala se reenvían a los listeners registrados con `on`.
 */
export class StorySocketService {
  private socket: Socket | null = null;
  private listeners = new Map<keyof StoryEvents, Set<Listener<any>>>();
  // serverTime - Date.now() local: `turnStarted.endsAt` viene en hora del
  // servidor; con este offset el contador llega a 0 a la vez en todos.
  private clockOffsetMs = 0;
  private clockSyncTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Igual que el socket de la trivia: al cerrar sesión se corta, para que
    // otro usuario en el mismo dispositivo no juegue con la identidad anterior.
    useAppStore.subscribe((state, prev) => {
      if (prev.accessToken && !state.accessToken) this.disconnect();
    });
  }

  connect() {
    if (this.socket) {
      if (!this.socket.connected) this.socket.connect();
      return;
    }

    this.socket = io(`${API_BASE_URL}/story`, {
      transports: ['websocket'],
      timeout: 10_000,
      forceNew: true,
      // Función: cada reconexión pide el token vigente (ver socket.service.ts).
      auth: (cb) => cb({ token: useAppStore.getState().accessToken }),
    });

    this.socket.on('connect', () => {
      this.startClockSync();
      this.emit('connect', undefined);
    });
    this.socket.on('disconnect', (reason) => {
      this.stopClockSync();
      this.emit('disconnect', { reason });
    });
    this.socket.on('connect_error', (err) => this.emit('connectError', { message: err.message }));

    SERVER_EVENTS.forEach((event) => {
      this.socket?.on(event, (data: StoryServerEvents[typeof event]) => this.emit(event, data));
    });
  }

  disconnect() {
    this.stopClockSync();
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /** Hora actual estimada del servidor (epoch ms). */
  serverNow(): number {
    return Date.now() + this.clockOffsetMs;
  }

  // Acciones (cliente → servidor)

  getRules() {
    return this.request<StoryRules>('getStoryRules');
  }

  createGame() {
    return this.request<StoryLobby>('createStoryGame');
  }

  joinGame(gameId: string) {
    return this.request<StoryLobby>('joinStoryGame', { gameId });
  }

  updateConfig(config: Partial<StoryConfig>) {
    return this.request<StoryLobby>('updateConfig', config);
  }

  kickPlayer(userId: string) {
    return this.request<StoryLobby>('kickPlayer', { userId });
  }

  startStory() {
    return this.request<StoryLobby>('startStory');
  }

  submitPanelDraft(panelOrder: number, draft: DraftInput) {
    return this.request<PanelReviewResult>(
      'submitPanelDraft',
      { panelOrder, ...draft },
      REVIEW_ACK_TIMEOUT_MS,
    );
  }

  confirmPanel(panelOrder: number) {
    return this.request<null>('confirmPanel', { panelOrder });
  }

  /** `gameId` hace falta en el review: la partida ya no es la activa del usuario. */
  reactToPanel(panelOrder: number, emoji: string | null, gameId?: string) {
    return this.request<null>('reactToPanel', { panelOrder, emoji, ...(gameId ? { gameId } : {}) });
  }

  getGameState() {
    return this.request<StoryGameState>('getGameState');
  }

  getReviewManifest(gameId: string) {
    return this.request<ReviewManifest>('getReviewManifest', { gameId });
  }

  leaveGame() {
    return this.request<null>('leaveGame');
  }

  // Eventos (servidor → cliente)

  on<K extends keyof StoryEvents>(event: K, listener: Listener<K>) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)?.add(listener);
  }

  off<K extends keyof StoryEvents>(event: K, listener: Listener<K>) {
    this.listeners.get(event)?.delete(listener);
  }

  private emit<K extends keyof StoryEvents>(event: K, data: StoryEvents[K]) {
    this.listeners.get(event)?.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error(`[StorySocketService] ${event} listener failed:`, err);
      }
    });
  }

  /**
   * Emite con ack. Nunca rechaza: sin conexión o sin respuesta a tiempo
   * devuelve un `StoryAck` con `ok: false`, igual que un error del servidor.
   */
  private async request<T>(
    event: string,
    payload?: object,
    timeoutMs = ACK_TIMEOUT_MS,
  ): Promise<StoryAck<T>> {
    if (!this.socket?.connected) {
      return { ok: false, data: null, message: 'Not connected to the story server' };
    }
    try {
      const socket = this.socket.timeout(timeoutMs);
      const response = (await (payload === undefined
        ? socket.emitWithAck(event)
        : socket.emitWithAck(event, payload))) as StoryAck<T>;
      return response;
    } catch {
      return { ok: false, data: null, message: 'The server did not respond, try again' };
    }
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

  private async syncClock() {
    if (!this.socket?.connected) return;
    const offset = await estimateClockOffset(this.socket);
    if (offset !== null) this.clockOffsetMs = offset;
  }
}

export const storySocketService = new StorySocketService();
