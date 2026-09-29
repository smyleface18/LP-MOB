import {
  AuthorStatusEvent,
  DraftInput,
  MyTurn,
  PanelConfirmedEvent,
  PanelMediaReadyEvent,
  PanelReactionEvent,
  PanelReviewResult,
  ReviewManifest,
  ScoreboardEntry,
  SharedDraftEvent,
  StoryCharacter,
  StoryGameState,
  StoryLobby,
  StoryPanelSummary,
  StoryProcessingEvent,
  StoryRules,
  StoryStatus,
  StoryTurn,
  TurnStartedEvent,
} from '../types';

/** Acción del jugador esperando el ack del servidor (para deshabilitar botones). */
export type StoryPendingAction =
  'create' | 'join' | 'config' | 'kick' | 'start' | 'submit' | 'confirm' | 'leave';

export interface StoryState {
  connected: boolean;
  rules: StoryRules | null;
  lobby: StoryLobby | null;
  /** Turno abierto; null entre `panelConfirmed` y el `turnStarted` siguiente. */
  turn: StoryTurn | null;
  storySoFar: StoryPanelSummary[];
  cast: StoryCharacter[];
  scoreboard: ScoreboardEntry[];
  /** Solo si el jugador es el autor del turno en curso. */
  myTurn: MyTurn | null;
  /** Última revisión recibida del propio borrador. */
  lastReview: PanelReviewResult | null;
  /** Último borrador revisado del autor, visto por los demás (`shareDrafts`). */
  sharedDraft: SharedDraftEvent | null;
  /** Última viñeta confirmada (para mostrar su puntaje). */
  lastConfirmed: PanelConfirmedEvent | null;
  manifest: ReviewManifest | null;
  /** Avance del audio y las imágenes mientras la partida está en PROCESSING. */
  processing: StoryProcessingEvent | null;
  pending: StoryPendingAction | null;
  error: string | null;
  /** Aviso que no es un error del jugador (ej. lo expulsaron, la partida se abandonó). */
  notice: string | null;
}

export const INITIAL_STORY_STATE: StoryState = {
  connected: false,
  rules: null,
  lobby: null,
  turn: null,
  storySoFar: [],
  cast: [],
  scoreboard: [],
  myTurn: null,
  lastReview: null,
  sharedDraft: null,
  lastConfirmed: null,
  manifest: null,
  processing: null,
  pending: null,
  error: null,
  notice: null,
};

/** Default si todavía no llegaron las reglas del servidor. */
const DEFAULT_MAX_REVIEW_ATTEMPTS = 2;

export type StoryStateAction =
  | { type: 'connected'; connected: boolean }
  | { type: 'rules'; rules: StoryRules }
  | { type: 'lobby'; lobby: StoryLobby }
  | { type: 'turnStarted'; event: TurnStartedEvent; userId: string }
  | { type: 'draftSubmitted' }
  | { type: 'draftReviewed'; result: PanelReviewResult; draft?: DraftInput }
  | { type: 'draftFailed' }
  | { type: 'authorStatus'; event: AuthorStatusEvent }
  | { type: 'sharedDraft'; event: SharedDraftEvent }
  | { type: 'panelConfirmed'; event: PanelConfirmedEvent }
  | { type: 'reaction'; event: PanelReactionEvent }
  | { type: 'manifest'; manifest: ReviewManifest }
  | { type: 'processing'; event: StoryProcessingEvent }
  | { type: 'panelMedia'; event: PanelMediaReadyEvent }
  | { type: 'gameState'; state: StoryGameState }
  | { type: 'pending'; action: StoryPendingAction | null }
  | { type: 'error'; message: string | null }
  /** El jugador cerró el mensaje en pantalla (error o aviso). */
  | { type: 'dismiss' }
  | { type: 'reset'; notice?: string };

const oneDecimal = (value: number) => Math.round(value * 10) / 10;

/** Suma el puntaje de una viñeta a su autor, como hace el servidor. */
const addPanelScore = (
  scoreboard: ScoreboardEntry[],
  lobby: StoryLobby | null,
  { authorId, score }: PanelConfirmedEvent,
): ScoreboardEntry[] => {
  const player = lobby?.players.find((p) => p.userId === authorId);
  const current = scoreboard.find((entry) => entry.userId === authorId) ?? {
    userId: authorId,
    name: player?.username ?? '',
    avatarUrl: player?.avatarUrl ?? null,
    panelsWritten: 0,
    totalScore: 0,
    averageScore: 0,
  };
  const panelsWritten = current.panelsWritten + 1;
  const totalScore = current.totalScore + score.total;
  const updated = {
    ...current,
    panelsWritten,
    totalScore,
    averageScore: oneDecimal(totalScore / panelsWritten),
  };
  return [...scoreboard.filter((entry) => entry.userId !== authorId), updated].sort(
    (a, b) =>
      Number(b.panelsWritten > 0) - Number(a.panelsWritten > 0) ||
      b.averageScore - a.averageScore ||
      b.totalScore - a.totalScore,
  );
};

const withReaction = <T extends { order: number; reactions: Record<string, string> }>(
  panels: T[],
  { order, userId, emoji }: PanelReactionEvent,
): T[] =>
  panels.map((panel) => {
    if (panel.order !== order) return panel;
    const reactions = { ...panel.reactions };
    if (emoji) reactions[userId] = emoji;
    else delete reactions[userId];
    return { ...panel, reactions };
  });

/** Estado de la partida a partir de los eventos del servidor. Función pura. */
export function storyGameReducer(state: StoryState, action: StoryStateAction): StoryState {
  switch (action.type) {
    case 'connected':
      return { ...state, connected: action.connected };

    case 'rules':
      return { ...state, rules: action.rules };

    case 'lobby': {
      const { lobby } = action;
      if (lobby.status === StoryStatus.ABANDONED) {
        return {
          ...INITIAL_STORY_STATE,
          connected: state.connected,
          rules: state.rules,
          notice: 'The story was abandoned because nobody was connected.',
        };
      }
      // El lobby de otra partida (ej. una nueva después del review) empieza de cero.
      const sameGame = state.lobby?.gameId === lobby.gameId;
      return sameGame
        ? { ...state, lobby }
        : {
            ...INITIAL_STORY_STATE,
            connected: state.connected,
            rules: state.rules,
            lobby,
          };
    }

    case 'turnStarted': {
      const { event, userId } = action;
      const isAuthor = event.authorId === userId;
      return {
        ...state,
        turn: {
          panelOrder: event.panelOrder,
          authorId: event.authorId,
          endsAt: event.endsAt,
          authorStatus: 'writing',
        },
        storySoFar: event.storySoFar,
        cast: event.cast,
        myTurn: isAuthor
          ? {
              attempts: 0,
              attemptsLeft: state.rules?.draft.maxReviewAttempts ?? DEFAULT_MAX_REVIEW_ATTEMPTS,
              reviewing: false,
              drafts: [],
            }
          : null,
        lastReview: null,
        sharedDraft: null,
      };
    }

    case 'draftSubmitted':
      return state.myTurn ? { ...state, myTurn: { ...state.myTurn, reviewing: true } } : state;

    case 'draftFailed':
      return state.myTurn ? { ...state, myTurn: { ...state.myTurn, reviewing: false } } : state;

    // Llega por el ack (con el borrador enviado) y por `panelReviewResult` (a
    // todos los dispositivos del autor, sin el borrador): los dos son idempotentes.
    case 'draftReviewed': {
      const { result, draft } = action;
      if (!state.myTurn || state.turn?.panelOrder !== result.panelOrder) {
        return { ...state, lastReview: result };
      }
      const drafts =
        draft && !result.flagged
          ? [
              ...state.myTurn.drafts,
              {
                ...draft,
                reviewAvailable: result.reviewAvailable,
                corrections: result.corrections,
                characterCorrections: result.characterCorrections,
              },
            ]
          : state.myTurn.drafts;
      const maxAttempts = state.rules?.draft.maxReviewAttempts ?? DEFAULT_MAX_REVIEW_ATTEMPTS;
      return {
        ...state,
        lastReview: result,
        myTurn: {
          ...state.myTurn,
          reviewing: false,
          attemptsLeft: result.attemptsLeft,
          attempts: maxAttempts - result.attemptsLeft,
          drafts,
        },
      };
    }

    case 'authorStatus':
      return state.turn?.panelOrder === action.event.order
        ? { ...state, turn: { ...state.turn, authorStatus: action.event.status } }
        : state;

    case 'sharedDraft':
      return state.turn?.panelOrder === action.event.order
        ? { ...state, sharedDraft: action.event }
        : state;

    case 'panelConfirmed': {
      const { event } = action;
      if (state.storySoFar.some((panel) => panel.order === event.order)) return state;
      const knownIds = new Set(state.cast.map((character) => character.id));
      return {
        ...state,
        storySoFar: [
          ...state.storySoFar,
          {
            order: event.order,
            authorId: event.authorId,
            finalText: event.finalText,
            scene: event.scene,
            characterIds: event.characterIds,
            reactions: {},
          },
        ],
        cast: [...state.cast, ...event.newCharacters.filter((c) => !knownIds.has(c.id))],
        scoreboard: addPanelScore(state.scoreboard, state.lobby, event),
        lastConfirmed: event,
        turn: state.turn?.panelOrder === event.order ? null : state.turn,
        myTurn: state.turn?.panelOrder === event.order ? null : state.myTurn,
        sharedDraft: null,
      };
    }

    case 'reaction': {
      const { event } = action;
      if (state.manifest?.gameId === event.gameId) {
        return {
          ...state,
          manifest: { ...state.manifest, panels: withReaction(state.manifest.panels, event) },
        };
      }
      if (state.lobby?.gameId !== event.gameId) return state;
      return { ...state, storySoFar: withReaction(state.storySoFar, event) };
    }

    case 'processing':
      return state.lobby?.gameId === action.event.gameId
        ? { ...state, processing: action.event }
        : state;

    // Llega en REVIEW para las viñetas que faltaban (la primera viene en el manifiesto).
    case 'panelMedia': {
      const { event } = action;
      if (state.manifest?.gameId !== event.gameId) return state;
      return {
        ...state,
        manifest: {
          ...state.manifest,
          panels: state.manifest.panels.map((panel) =>
            panel.order === event.order
              ? {
                  ...panel,
                  mediaStatus: event.mediaStatus,
                  audioUrl: event.audioUrl,
                  imageUrl: event.imageUrl,
                  speechMarks: event.speechMarks,
                }
              : panel,
          ),
        },
      };
    }

    case 'manifest':
      return {
        ...state,
        manifest: action.manifest,
        processing: null,
        turn: null,
        myTurn: null,
        sharedDraft: null,
      };

    // Reconexión: el servidor manda el estado completo para ese jugador.
    case 'gameState': {
      const { state: server } = action;
      const sameGame = state.lobby?.gameId === server.lobby.gameId;
      return {
        ...state,
        lobby: server.lobby,
        turn: server.turn,
        storySoFar: server.storySoFar,
        cast: server.cast,
        scoreboard: server.scoreboard,
        myTurn: server.myTurn,
        lastReview: sameGame ? state.lastReview : null,
        sharedDraft: sameGame ? state.sharedDraft : null,
        manifest: null,
        error: null,
        notice: null,
      };
    }

    case 'pending':
      return { ...state, pending: action.action };

    case 'error':
      return { ...state, error: action.message, notice: action.message ? null : state.notice };

    case 'dismiss':
      return { ...state, error: null, notice: null };

    case 'reset':
      return {
        ...INITIAL_STORY_STATE,
        connected: state.connected,
        rules: state.rules,
        notice: action.notice ?? null,
      };
  }
}
