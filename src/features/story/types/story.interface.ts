import { ApiResponse } from '@/shared/api/types';
import { Level } from '@/shared/types/common';

/**
 * Espejo del contrato del namespace /story del backend
 * (LP-API: src/modules/story-game/README.md). Los instantes (`endsAt`) están
 * en hora del servidor: ver storySocketService.serverNow().
 */

/** Solo el servidor cambia el estado. */
export enum StoryStatus {
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  PROCESSING = 'PROCESSING',
  REVIEW = 'REVIEW',
  FINISHED = 'FINISHED',
  ABANDONED = 'ABANDONED',
}

export type StoryTurnDurationSec = 60 | 90 | 120 | 180;
export type AuthorStatus = 'writing' | 'reviewing' | 'correcting';
export type PanelConfirmedBy = 'player' | 'timeout';
export type CorrectionType = 'grammar' | 'spelling' | 'vocabulary' | 'punctuation';
export type PanelMediaStatus = 'none' | 'pending' | 'ready' | 'failed';

export interface StoryConfig {
  panelsCount: number;
  turnDurationSec: StoryTurnDurationSec;
  level: Level;
  language: string;
  /** Los demás ven cada borrador revisado del autor mientras la viñeta está abierta. */
  shareDrafts: boolean;
}

export interface StoryLobbyPlayer {
  userId: string;
  username: string;
  /** URL firmada; null si no tiene avatar. */
  avatarUrl: string | null;
  connected: boolean;
  /** Salió después del lobby: sigue en la lista porque el orden define los turnos. */
  left: boolean;
}

/** Payload de `lobbyUpdated` (y ack de create/join/updateConfig/kick/start). */
export interface StoryLobby {
  gameId: string;
  status: StoryStatus;
  hostId: string;
  config: StoryConfig;
  players: StoryLobbyPlayer[];
}

/** Ficha corta de un personaje, en inglés. */
export interface CharacterSheet {
  name: string;
  /** "dog", "girl", "robot"... */
  kind: string;
  /** Aspecto en una línea: "small brown dog with a red collar". */
  description: string;
}

export interface StoryCharacter extends CharacterSheet {
  id: string;
  createdBy: string;
  introducedInPanel: number;
}

export interface Correction {
  /** Fragmento exacto del texto del jugador. */
  original: string;
  suggestion: string;
  type: CorrectionType;
  /** En español, adecuada al nivel. */
  explanation: string;
}

export interface CharacterCorrection {
  /** Índice en `newCharacters` del borrador. */
  characterIndex: number;
  field: keyof CharacterSheet;
  original: string;
  suggestion: string;
  explanation: string;
}

export interface PanelScore {
  accuracy: number;
  firstTryBonus: number;
  selfCorrectionBonus: number;
  timeoutPenalty: boolean;
  total: number;
}

/** userId → emoji. */
export type PanelReactions = Record<string, string>;

/** Viñeta confirmada, tal como la ven todos durante la partida. */
export interface StoryPanelSummary {
  order: number;
  authorId: string;
  finalText: string;
  scene: string;
  characterIds: string[];
  reactions: PanelReactions;
}

export interface ScoreboardEntry {
  userId: string;
  name: string;
  avatarUrl: string | null;
  panelsWritten: number;
  totalScore: number;
  /** totalScore / panelsWritten, con un decimal. */
  averageScore: number;
}

/** Lo que el autor envía en `submitPanelDraft` (sin `panelOrder`). */
export interface DraftInput {
  text: string;
  scene: string;
  characterIds: string[];
  newCharacters: CharacterSheet[];
}

/** Borrador propio con su revisión (nunca trae el texto corregido). */
export interface OwnDraft extends DraftInput {
  /** false si la IA no estaba disponible. */
  reviewAvailable: boolean;
  corrections: Correction[];
  characterCorrections: CharacterCorrection[];
}

/** Payload de `panelReviewResult` y ack de `submitPanelDraft`. */
export interface PanelReviewResult {
  panelOrder: number;
  /** Contenido inapropiado: se rechazó sin consumir intento. */
  flagged: boolean;
  reviewAvailable: boolean;
  corrections: Correction[];
  characterCorrections: CharacterCorrection[];
  attemptsLeft: number;
  message?: string;
}

export interface StoryTurn {
  panelOrder: number;
  authorId: string;
  endsAt: number;
  authorStatus: AuthorStatus;
}

export interface MyTurn {
  attempts: number;
  attemptsLeft: number;
  reviewing: boolean;
  drafts: OwnDraft[];
}

/** Ack de `getGameState` y evento `gameState` al reconectarse. */
export interface StoryGameState {
  lobby: StoryLobby;
  turn: StoryTurn | null;
  storySoFar: StoryPanelSummary[];
  cast: StoryCharacter[];
  scoreboard: ScoreboardEntry[];
  /** Solo para el autor del turno en curso. */
  myTurn: MyTurn | null;
}

export interface TurnStartedEvent {
  panelOrder: number;
  authorId: string;
  endsAt: number;
  storySoFar: StoryPanelSummary[];
  cast: StoryCharacter[];
}

export interface AuthorStatusEvent {
  order: number;
  status: AuthorStatus;
}

/** Borrador revisado del autor, tal como lo ven los demás (`shareDrafts`). */
export interface SharedDraftEvent extends DraftInput {
  order: number;
  authorId: string;
  reviewAvailable: boolean;
  corrections: Correction[];
  characterCorrections: CharacterCorrection[];
}

export interface PanelConfirmedEvent {
  order: number;
  authorId: string;
  finalText: string;
  scene: string;
  characterIds: string[];
  /** Personajes que entraron al elenco con esta viñeta. */
  newCharacters: StoryCharacter[];
  score: PanelScore;
  confirmedBy: PanelConfirmedBy;
}

export interface PanelReactionEvent {
  gameId: string;
  order: number;
  userId: string;
  /** null = el jugador quitó su reacción. */
  emoji: string | null;
}

export interface SpeechMark {
  time: number;
  start: number;
  end: number;
  value: string;
}

export interface ReviewPanel {
  order: number;
  author: { id: string; name: string };
  /** Último texto del jugador; vacío si el turno venció sin borradores. */
  originalText: string;
  /** Texto corregido (el que se narra). */
  finalText: string;
  scene: string;
  characterIds: string[];
  corrections: Correction[];
  score: PanelScore;
  reactions: PanelReactions;
  /** mp3 narrado (URL firmada); null mientras se genera o si falló. */
  audioUrl: string | null;
  /** Una marca por palabra de `finalText`: ms desde el inicio y offsets en caracteres. */
  speechMarks: SpeechMark[] | null;
  imageUrl: string | null;
  /** none = venció sin texto; pending = generándose (llega por `panelMediaReady`). */
  mediaStatus: PanelMediaStatus;
}

/** Payload de `storyReviewReady`, ack de `getReviewManifest` y `GET /story/history/:storyId`. */
export interface ReviewManifest {
  /** Id en el historial (Postgres). */
  storyId: string;
  gameId: string;
  /** Título que puso la IA; null si no hubo. */
  title: string | null;
  characters: StoryCharacter[];
  ranking: ScoreboardEntry[];
  panels: ReviewPanel[];
}

/** "Me gusta" de una historieta completa. */
export interface StoryLikes {
  count: number;
  /** El usuario ya le dio like. */
  likedByMe: boolean;
}

/**
 * Historieta guardada (`GET /story/history/:storyId` y `GET /story/catalog/:storyId`):
 * el manifiesto del review, sus likes y las reacciones que se pueden usar.
 */
export interface StoredStoryManifest extends ReviewManifest {
  likes: StoryLikes;
  reactionOptions: string[];
}

/** `storyProcessing`: avance de la generación de audio e imágenes en PROCESSING. */
export interface StoryProcessingEvent {
  gameId: string;
  /** Viñetas con media a generar (sin las que vencieron sin texto). */
  panelsTotal: number;
  panelsDone: number;
}

/** `panelMediaReady`: una viñeta terminó su media (URLs firmadas). */
export interface PanelMediaReadyEvent {
  gameId: string;
  order: number;
  mediaStatus: PanelMediaStatus;
  audioUrl: string | null;
  imageUrl: string | null;
  speechMarks: SpeechMark[] | null;
}

/** De dónde sale una lista de historietas: las propias o el catálogo de todos. */
export type StoryListSource = 'history' | 'catalog';

/** Filtros del catálogo (el historial propio no los usa). */
export interface StoryCatalogFilters {
  /** Busca en el título, los nombres de los jugadores y el texto de las viñetas. */
  search?: string;
  /** Uno o más niveles; vacío = todos. */
  levels?: Level[];
}

/** Una historieta del historial (`GET /story/history`) o del catálogo (`GET /story/catalog`). */
export interface StoryHistoryItem {
  storyId: string;
  /** Título que puso la IA; null en historietas sin título. */
  title: string | null;
  /** ISO 8601. */
  finishedAt: string;
  level: Level;
  panelsCount: number;
  /** Texto de la primera viñeta. */
  excerpt: string;
  coverImageUrl: string | null;
  /** Por puesto en el ranking. */
  players: { userId: string; name: string; avatarUrl: string | null }[];
  myPosition: number | null;
  myScore: number;
  likes: StoryLikes;
}

export interface StoryHistoryPage {
  items: StoryHistoryItem[];
  page: number;
  limit: number;
  total: number;
}

/** Ack de `getStoryRules`: rangos y límites para armar los formularios. */
export interface StoryRules {
  players: { min: number; max: number };
  config: {
    panelsCount: { min: number; max: number };
    turnDurationsSec: StoryTurnDurationSec[];
    levels: Level[];
    languages: string[];
    defaults: StoryConfig;
  };
  draft: {
    minWords: number;
    maxChars: number;
    maxSceneChars: number;
    maxReviewAttempts: number;
    maxDraftsPerTurn: number;
  };
  characters: {
    maxPerStory: number;
    maxPerPanel: number;
    maxNewPerPanel: number;
    limits: Record<keyof CharacterSheet, number>;
  };
  reactions: string[];
}

export type StoryErrorCode =
  | 'VALIDATION_ERROR'
  | 'USER_NOT_FOUND'
  | 'GAME_NOT_FOUND'
  | 'NOT_IN_GAME'
  | 'ALREADY_IN_GAME'
  | 'NOT_A_PLAYER'
  | 'NOT_HOST'
  | 'INVALID_STATE'
  | 'GAME_FULL'
  | 'NOT_ENOUGH_PLAYERS'
  | 'NOT_ENOUGH_PANELS'
  | 'CANNOT_KICK_SELF'
  | 'KICKED'
  | 'NOT_YOUR_TURN'
  | 'TURN_CLOSED'
  | 'TURN_EXPIRED'
  | 'REVIEW_IN_PROGRESS'
  | 'NO_ATTEMPTS_LEFT'
  | 'DRAFT_LIMIT_REACHED'
  | 'NO_DRAFT'
  | 'INVALID_DRAFT'
  | 'UNKNOWN_CHARACTER'
  | 'TOO_MANY_CHARACTERS'
  | 'DUPLICATE_CHARACTER_NAME'
  | 'PANEL_NOT_CONFIRMED';

/** Ack de cualquier evento de /story: los errores traen `code` y `status`. */
export interface StoryAck<T> extends ApiResponse<T> {
  code?: StoryErrorCode;
  status?: number;
}

/** Evento `storyError` (errores sin ack, ej. `KICKED`). */
export interface StoryErrorEvent {
  ok: false;
  status: number;
  message: string | string[];
  code?: StoryErrorCode;
}

/** Eventos servidor → cliente. */
export interface StoryServerEvents {
  lobbyUpdated: StoryLobby;
  turnStarted: TurnStartedEvent;
  panelReviewResult: PanelReviewResult;
  authorStatus: AuthorStatusEvent;
  panelDraftReviewed: SharedDraftEvent;
  panelConfirmed: PanelConfirmedEvent;
  panelReaction: PanelReactionEvent;
  storyProcessing: StoryProcessingEvent;
  storyReviewReady: ReviewManifest;
  panelMediaReady: PanelMediaReadyEvent;
  gameState: StoryGameState;
  storyError: StoryErrorEvent;
}

/** Eventos del propio servicio (no del servidor). */
export interface StoryConnectionEvents {
  connect: undefined;
  disconnect: { reason: string };
  connectError: { message: string };
}

export type StoryEvents = StoryServerEvents & StoryConnectionEvents;
