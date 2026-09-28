import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useAuthState } from '@/store';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { storySocketService } from '../services/storySocket.service';
import {
  AuthorStatusEvent,
  DraftInput,
  PanelConfirmedEvent,
  PanelReactionEvent,
  PanelReviewResult,
  ReviewManifest,
  SharedDraftEvent,
  StoryAck,
  StoryConfig,
  StoryErrorEvent,
  StoryGameState,
  StoryLobby,
  StoryStatus,
  TurnStartedEvent,
} from '../types';
import { INITIAL_STORY_STATE, storyGameReducer, StoryPendingAction } from './storyGame.reducer';

/** Cada cuánto se recalcula el contador del turno (parte siempre de `endsAt`). */
const TICK_MS = 250;

const secondsUntil = (target: number, now: number) => Math.max(0, Math.ceil((target - now) / 1000));

/** Estados en los que el jugador está dentro de una partida en curso. */
const ACTIVE_STATUSES: StoryStatus[] = [StoryStatus.LOBBY, StoryStatus.PLAYING];

export const useStoryGame = () => {
  const [state, dispatch] = useReducer(storyGameReducer, INITIAL_STORY_STATE);
  const { user } = useAuthState();
  const userId = user?.id ?? '';
  const [timeLeft, setTimeLeft] = useState(0);

  // Los handlers del socket se registran una sola vez: leen de acá.
  const userIdRef = useRef(userId);
  const lobbyRef = useRef(state.lobby);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    lobbyRef.current = state.lobby;
  }, [state.lobby]);

  /** Corre una acción con ack: marca `pending`, y un error queda en `state.error`. */
  const run = useCallback(
    async <T>(
      action: StoryPendingAction | null,
      request: () => Promise<StoryAck<T>>,
      fallback: string,
    ): Promise<StoryAck<T>> => {
      dispatch({ type: 'error', message: null });
      if (action) dispatch({ type: 'pending', action });
      const response = await request();
      if (action) dispatch({ type: 'pending', action: null });
      if (!response.ok) {
        dispatch({ type: 'error', message: getErrorMessage(response.message, fallback) });
      }
      return response;
    },
    [],
  );

  const loadManifest = useCallback(async (gameId: string) => {
    const response = await storySocketService.getReviewManifest(gameId);
    if (response.ok && response.data) dispatch({ type: 'manifest', manifest: response.data });
  }, []);

  // 🔌 Socket: listeners una sola vez por montaje.
  useEffect(() => {
    const onConnect = async () => {
      dispatch({ type: 'connected', connected: true });
      const rules = await storySocketService.getRules();
      if (rules.ok && rules.data) dispatch({ type: 'rules', rules: rules.data });

      // Si el servidor tenía una partida activa ya mandó `gameState`. Si la
      // teníamos en pantalla y el servidor ya no la conoce (terminó o se
      // abandonó mientras estábamos desconectados), se vuelve al menú.
      const lobby = lobbyRef.current;
      if (lobby && ACTIVE_STATUSES.includes(lobby.status)) {
        const current = await storySocketService.getGameState();
        if (!current.ok && current.code === 'NOT_IN_GAME') {
          dispatch({ type: 'reset', notice: 'That story is no longer available.' });
        }
      }
    };
    const onDisconnect = () => dispatch({ type: 'connected', connected: false });
    const onConnectError = ({ message }: { message: string }) =>
      dispatch({ type: 'error', message });
    const onLobby = (lobby: StoryLobby) => dispatch({ type: 'lobby', lobby });
    const onTurnStarted = (event: TurnStartedEvent) =>
      dispatch({ type: 'turnStarted', event, userId: userIdRef.current });
    const onReviewResult = (result: PanelReviewResult) =>
      dispatch({ type: 'draftReviewed', result });
    const onAuthorStatus = (event: AuthorStatusEvent) => dispatch({ type: 'authorStatus', event });
    const onSharedDraft = (event: SharedDraftEvent) => dispatch({ type: 'sharedDraft', event });
    const onPanelConfirmed = (event: PanelConfirmedEvent) =>
      dispatch({ type: 'panelConfirmed', event });
    const onReaction = (event: PanelReactionEvent) => dispatch({ type: 'reaction', event });
    const onManifest = (manifest: ReviewManifest) => dispatch({ type: 'manifest', manifest });
    const onGameState = (gameState: StoryGameState) =>
      dispatch({ type: 'gameState', state: gameState });
    const onStoryError = (error: StoryErrorEvent) => {
      if (error.code === 'KICKED') {
        dispatch({ type: 'reset', notice: 'The host removed you from the story.' });
        return;
      }
      dispatch({ type: 'error', message: getErrorMessage(error.message, 'Something went wrong') });
    };

    storySocketService.on('connect', onConnect);
    storySocketService.on('disconnect', onDisconnect);
    storySocketService.on('connectError', onConnectError);
    storySocketService.on('lobbyUpdated', onLobby);
    storySocketService.on('turnStarted', onTurnStarted);
    storySocketService.on('panelReviewResult', onReviewResult);
    storySocketService.on('authorStatus', onAuthorStatus);
    storySocketService.on('panelDraftReviewed', onSharedDraft);
    storySocketService.on('panelConfirmed', onPanelConfirmed);
    storySocketService.on('panelReaction', onReaction);
    storySocketService.on('storyReviewReady', onManifest);
    storySocketService.on('gameState', onGameState);
    storySocketService.on('storyError', onStoryError);

    storySocketService.connect();
    if (storySocketService.isConnected()) void onConnect();

    return () => {
      storySocketService.off('connect', onConnect);
      storySocketService.off('disconnect', onDisconnect);
      storySocketService.off('connectError', onConnectError);
      storySocketService.off('lobbyUpdated', onLobby);
      storySocketService.off('turnStarted', onTurnStarted);
      storySocketService.off('panelReviewResult', onReviewResult);
      storySocketService.off('authorStatus', onAuthorStatus);
      storySocketService.off('panelDraftReviewed', onSharedDraft);
      storySocketService.off('panelConfirmed', onPanelConfirmed);
      storySocketService.off('panelReaction', onReaction);
      storySocketService.off('storyReviewReady', onManifest);
      storySocketService.off('gameState', onGameState);
      storySocketService.off('storyError', onStoryError);
    };
  }, []);

  // Si la partida llegó a REVIEW/FINISHED sin el manifiesto (ej. el
  // `storyReviewReady` se perdió en una reconexión), se pide.
  const lobbyGameId = state.lobby?.gameId;
  const lobbyStatus = state.lobby?.status;
  const hasManifest = state.manifest !== null;
  useEffect(() => {
    if (!lobbyGameId || hasManifest || !state.connected) return;
    if (lobbyStatus === StoryStatus.REVIEW || lobbyStatus === StoryStatus.FINISHED) {
      void loadManifest(lobbyGameId);
    }
  }, [lobbyGameId, lobbyStatus, hasManifest, state.connected, loadManifest]);

  // ⏱️ Contador del turno: llega a 0 en `endsAt`, medido con el reloj
  // sincronizado con el servidor, igual para todos los jugadores.
  const endsAt = state.turn?.endsAt ?? null;
  useEffect(() => {
    if (endsAt === null) {
      setTimeLeft(0);
      return;
    }
    const tick = () => setTimeLeft(secondsUntil(endsAt, storySocketService.serverNow()));
    tick();
    const timer = setInterval(tick, TICK_MS);
    return () => clearInterval(timer);
  }, [endsAt]);

  // 🎮 Acciones

  const createGame = useCallback(async () => {
    const response = await run(
      'create',
      () => storySocketService.createGame(),
      'Could not create the story',
    );
    if (response.ok && response.data) dispatch({ type: 'lobby', lobby: response.data });
  }, [run]);

  const joinGame = useCallback(
    async (gameId: string) => {
      const response = await run(
        'join',
        () => storySocketService.joinGame(gameId),
        'Could not join the story',
      );
      if (response.ok && response.data) dispatch({ type: 'lobby', lobby: response.data });
    },
    [run],
  );

  const updateConfig = useCallback(
    (config: Partial<StoryConfig>) =>
      run('config', () => storySocketService.updateConfig(config), 'Could not update the settings'),
    [run],
  );

  const kickPlayer = useCallback(
    (targetId: string) =>
      run('kick', () => storySocketService.kickPlayer(targetId), 'Could not remove the player'),
    [run],
  );

  const startStory = useCallback(
    () => run('start', () => storySocketService.startStory(), 'Could not start the story'),
    [run],
  );

  const turnOrder = state.turn?.panelOrder ?? null;

  /** Envía el borrador a revisión. Devuelve el resultado (o null si falló). */
  const submitDraft = useCallback(
    async (draft: DraftInput): Promise<PanelReviewResult | null> => {
      if (turnOrder === null) return null;
      dispatch({ type: 'draftSubmitted' });
      const response = await run(
        'submit',
        () => storySocketService.submitPanelDraft(turnOrder, draft),
        'Could not review your panel',
      );
      if (!response.ok || !response.data) {
        dispatch({ type: 'draftFailed' });
        return null;
      }
      dispatch({ type: 'draftReviewed', result: response.data, draft });
      return response.data;
    },
    [run, turnOrder],
  );

  const confirmPanel = useCallback(async () => {
    if (turnOrder === null) return;
    await run(
      'confirm',
      () => storySocketService.confirmPanel(turnOrder),
      'Could not confirm your panel',
    );
  }, [run, turnOrder]);

  /** Reacciona a una viñeta confirmada; tocar la misma reacción la quita. */
  const reactToPanel = useCallback(
    async (panelOrder: number, emoji: string) => {
      const gameId = state.manifest?.gameId ?? state.lobby?.gameId;
      const panels = state.manifest?.panels ?? state.storySoFar;
      const mine = panels.find((panel) => panel.order === panelOrder)?.reactions[userId];
      await run(
        null,
        () => storySocketService.reactToPanel(panelOrder, mine === emoji ? null : emoji, gameId),
        'Could not save your reaction',
      );
    },
    [run, state.manifest, state.lobby?.gameId, state.storySoFar, userId],
  );

  const leaveGame = useCallback(async () => {
    const response = await run(
      'leave',
      () => storySocketService.leaveGame(),
      'Could not leave the story',
    );
    // Si el servidor ya no nos tiene en la partida, igual se vuelve al menú.
    if (response.ok || response.code === 'NOT_IN_GAME') dispatch({ type: 'reset' });
  }, [run]);

  /** Vuelve al menú después del review (la partida ya no es la activa). */
  const backToMenu = useCallback(() => dispatch({ type: 'reset' }), []);

  const dismissMessage = useCallback(() => dispatch({ type: 'dismiss' }), []);

  return useMemo(() => {
    const isHost = state.lobby?.hostId === userId;
    const isAuthor = state.turn?.authorId === userId;
    const author = state.lobby?.players.find((p) => p.userId === state.turn?.authorId) ?? null;
    return {
      state: { ...state, userId, isHost, isAuthor, author, timeLeft },
      actions: {
        createGame,
        joinGame,
        updateConfig,
        kickPlayer,
        startStory,
        submitDraft,
        confirmPanel,
        reactToPanel,
        leaveGame,
        backToMenu,
        dismissMessage,
      },
    };
  }, [
    state,
    userId,
    timeLeft,
    createGame,
    joinGame,
    updateConfig,
    kickPlayer,
    startStory,
    submitDraft,
    confirmPanel,
    reactToPanel,
    leaveGame,
    backToMenu,
    dismissMessage,
  ]);
};

export type StoryGameHook = ReturnType<typeof useStoryGame>;
