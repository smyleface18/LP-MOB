import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Image } from 'react-native';
import { useAuthState } from '@/store';
import { socketService } from '../services/socket.service';
import { QuestionDto } from '@/features/question/types';
import {
  MatchStatus,
  ModeMatch,
  PlayerInfo,
  AnswerResult,
  NewQuestionEvent,
  GameStateSnapshot,
} from '../types';
import { ContentType, Level } from '@/shared/types/common';

interface Game {
  connected: boolean;
  roomId: string | null;
  level: Level | null;
  mode: ModeMatch | null;
  gameStarted: boolean;
  finished: boolean;
  currentQuestion: QuestionDto | null;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  /** Segundos hasta que se muestre la próxima pregunta (0 si no hay una en camino). */
  nextQuestionIn: number;
  players: PlayerInfo[];
  error: string | null;
  lastAnswerResult: AnswerResult | null;
  /** Opción ya elegida en la pregunta actual (al reconectarse tras responder). */
  answeredOptionId: string | null;
}

const INITIAL_STATE: Game = {
  connected: false,
  roomId: null,
  level: null,
  mode: null,
  gameStarted: false,
  finished: false,
  currentQuestion: null,
  questionNumber: 0,
  totalQuestions: 0,
  timeRemaining: 0,
  nextQuestionIn: 0,
  players: [],
  error: null,
  lastAnswerResult: null,
  answeredOptionId: null,
};

// Cada cuánto se recalcula el contador. No acumula error: cada tick parte de
// los instantes absolutos (startsAt/endsAt), no de restar 1 al valor anterior.
const TICK_MS = 200;

const secondsUntil = (target: number, now: number) => Math.max(0, Math.ceil((target - now) / 1000));

// Precarga la imagen durante la antelación, para que aparezca junto con la
// pregunta en startsAt. Audio/video los carga su propio reproductor al montarse.
const prefetchMedia = (question: QuestionDto) => {
  const url = question.media?.url;
  if (url && question.contentType === ContentType.IMAGE) {
    Image.prefetch(url).catch(() => undefined);
  }
};

export const useGame = () => {
  const [gameState, setGameState] = useState<Game>(INITIAL_STATE);
  const { user } = useAuthState();
  const [userId, setUserId] = useState(user?.id ?? '');
  const [isHost, setIsHost] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitializedRef = useRef(false);
  // Línea de tiempo recibida del servidor (hora del servidor, epoch ms).
  const scheduledQuestionRef = useRef<NewQuestionEvent | null>(null);
  const nextQuestionAtRef = useRef<number | null>(null);

  // Los handlers del socket se registran una sola vez: leen el userId de acá.
  const userIdRef = useRef(userId);

  useEffect(() => {
    if (user?.id) setUserId(user.id);
  }, [user?.id]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // ⏱️ Timeline: la pregunta se muestra en startsAt y el contador llega a 0 en
  // endsAt, medidos con el reloj sincronizado con el servidor. Así todos los
  // jugadores la ven y la cierran a la vez, sin importar cuándo les llegó.
  const tick = useCallback(() => {
    const now = socketService.serverNow();
    const scheduled = scheduledQuestionRef.current;
    const revealed = scheduled !== null && now >= scheduled.startsAt;

    const currentQuestion = revealed ? scheduled.question : null;
    const timeRemaining = revealed ? secondsUntil(scheduled.endsAt, now) : 0;
    const nextAt = scheduled && !revealed ? scheduled.startsAt : nextQuestionAtRef.current;
    const nextQuestionIn = !revealed && nextAt !== null ? secondsUntil(nextAt, now) : 0;

    setGameState((prev) => {
      if (
        prev.currentQuestion === currentQuestion &&
        prev.timeRemaining === timeRemaining &&
        prev.nextQuestionIn === nextQuestionIn
      ) {
        return prev;
      }
      return {
        ...prev,
        currentQuestion,
        timeRemaining,
        nextQuestionIn,
        questionNumber: revealed ? scheduled.questionNumber : prev.questionNumber,
        totalQuestions: scheduled?.totalQuestions ?? prev.totalQuestions,
      };
    });
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    if (!timerRef.current) timerRef.current = setInterval(tick, TICK_MS);
    tick();
  }, [tick]);

  const clearTimeline = useCallback(() => {
    stopTimer();
    scheduledQuestionRef.current = null;
    nextQuestionAtRef.current = null;
  }, [stopTimer]);

  // 🎮 Game actions - memoized
  const createGame = useCallback((level: Level, mode: ModeMatch) => {
    try {
      setIsHost(true);
      socketService.createGame(level, mode);
      setGameState((prev) => ({ ...prev, level, mode, error: null }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create game';
      setGameState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, []);

  const joinGame = useCallback((roomId: string) => {
    try {
      setIsHost(false);
      socketService.joinGame(roomId);
      // roomId se fija al confirmar el servidor (gameJoined): si la sala no
      // existe o ya empezó, no hay que mostrar un lobby falso.
      setGameState((prev) => ({ ...prev, error: null }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to join game';
      setGameState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, []);

  const startGame = useCallback(() => {
    try {
      socketService.startGame();
      setGameState((prev) => ({ ...prev, error: null }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start game';
      setGameState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, []);

  const leaveRoom = useCallback(() => {
    try {
      socketService.leaveRoom();
      setIsHost(false);
      setGameState((prev) => ({
        ...prev,
        roomId: null,
        players: [],
        gameStarted: false,
        finished: false,
        currentQuestion: null,
        timeRemaining: 0,
        nextQuestionIn: 0,
        error: null,
      }));
      clearTimeline();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to leave room';
      setGameState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, [clearTimeline]);

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!gameState.currentQuestion) return;
      try {
        socketService.submitAnswer(gameState.currentQuestion.id, answer);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to submit answer';
        setGameState((prev) => ({ ...prev, error: errorMsg }));
      }
    },
    [gameState.currentQuestion],
  );

  const resetGame = useCallback(() => {
    setIsHost(false);
    setGameState(INITIAL_STATE);
    clearTimeline();
  }, [clearTimeline]);

  const playAgain = useCallback(() => {
    if (!gameState.level || !gameState.mode) return;

    setIsHost(true);
    setGameState((prev) => ({
      ...INITIAL_STATE,
      connected: prev.connected,
      level: prev.level,
      mode: prev.mode,
    }));
    socketService.createGame(gameState.level, gameState.mode);
  }, [gameState.level, gameState.mode]);

  const requestRematch = useCallback(() => {
    try {
      socketService.requestRematch();
      setGameState((prev) => ({ ...prev, error: 'Waiting for the other players...' }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to request rematch';
      setGameState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, []);

  // 🔌 Socket event handlers - create once and reuse
  const createSocketHandlers = useCallback(() => {
    const handleConnect = () => {
      setGameState((prev) => ({ ...prev, connected: true, error: null }));
    };

    const handleDisconnect = () => {
      setIsHost(false);
      setGameState((prev) => ({
        ...prev,
        connected: false,
        roomId: null,
        players: [],
        gameStarted: false,
        finished: false,
        currentQuestion: null,
        timeRemaining: 0,
        nextQuestionIn: 0,
      }));
      clearTimeline();
    };

    const handleError = (data: { message: string }) => {
      setGameState((prev) => ({ ...prev, error: data.message }));
    };

    const handleGameCreated = (data: { roomId: string; level: Level; mode: ModeMatch }) => {
      setGameState((prev) => ({
        ...prev,
        roomId: data.roomId,
        level: data.level,
        mode: data.mode,
        gameStarted: false,
        finished: false,
        error: null,
      }));
    };

    const handleGameJoined = (data: { roomId: string; level: Level; mode: ModeMatch }) => {
      setGameState((prev) => ({
        ...prev,
        roomId: data.roomId,
        level: data.level,
        mode: data.mode,
        gameStarted: false,
        error: null,
      }));
    };

    const handlePlayersUpdated = (data: { players: PlayerInfo[] }) => {
      setGameState((prev) => ({
        ...prev,
        players: data.players,
      }));
    };

    const handleNewQuestion = (data: NewQuestionEvent) => {
      // Llega antes de startsAt (antelación del servidor): se guarda y el tick
      // la muestra en el instante acordado. Mientras, se precarga la imagen.
      scheduledQuestionRef.current = data;
      nextQuestionAtRef.current = null;
      prefetchMedia(data.question);
      setGameState((prev) => ({
        ...prev,
        gameStarted: true,
        finished: false,
        answeredOptionId: null,
        error: null,
      }));
      startTimer();
    };

    // Reconexión: el servidor manda el estado completo de la partida en curso.
    const handleGameState = (snapshot: GameStateSnapshot) => {
      const inProgress =
        snapshot.status !== MatchStatus.WAITING && snapshot.status !== MatchStatus.FINISHED;

      scheduledQuestionRef.current =
        snapshot.question && snapshot.startsAt !== null && snapshot.endsAt !== null
          ? {
              question: snapshot.question,
              questionNumber: snapshot.questionNumber,
              totalQuestions: snapshot.totalQuestions,
              timeLimit: snapshot.question.timeLimit,
              startsAt: snapshot.startsAt,
              endsAt: snapshot.endsAt,
            }
          : null;
      nextQuestionAtRef.current = snapshot.nextQuestionAt;
      if (snapshot.question) prefetchMedia(snapshot.question);

      setIsHost(snapshot.players.some((p) => p.userId === userIdRef.current && p.isOwner));
      setGameState((prev) => ({
        ...prev,
        roomId: snapshot.roomId,
        level: snapshot.level,
        mode: snapshot.modeMatch,
        players: snapshot.players,
        questionNumber: snapshot.questionNumber,
        totalQuestions: snapshot.totalQuestions,
        gameStarted: inProgress,
        finished: snapshot.status === MatchStatus.FINISHED,
        answeredOptionId: snapshot.answeredOptionId,
        error: null,
      }));

      if (inProgress) startTimer();
      else clearTimeline();
    };

    const handleAnswerResult = (data: AnswerResult) => {
      setGameState((prev) => ({
        ...prev,
        lastAnswerResult: data,
      }));
      // Auto-clear after a brief delay to prevent multiple processing
      setTimeout(() => {
        setGameState((prev) => ({ ...prev, lastAnswerResult: null }));
      }, 100);
    };

    const handleQuestionEnded = (data: { nextQuestionAt: number | null }) => {
      scheduledQuestionRef.current = null;
      nextQuestionAtRef.current = data?.nextQuestionAt ?? null;
      startTimer();
    };

    const handleGameEnded = (data: { results: any[] }) => {
      clearTimeline();
      setGameState((prev) => ({
        ...prev,
        gameStarted: false,
        finished: true,
        currentQuestion: null,
        timeRemaining: 0,
        nextQuestionIn: 0,
      }));
    };

    const handleGameStarted = (data: { firstQuestionAt: number }) => {
      nextQuestionAtRef.current = data?.firstQuestionAt ?? null;
      setGameState((prev) => ({ ...prev, gameStarted: true, error: null }));
      startTimer();
    };

    const handleRematchStatus = (data: { accepted: number; total: number }) => {
      setGameState((prev) => ({
        ...prev,
        error: `Rematch: ${data.accepted}/${data.total} players ready`,
      }));
    };

    const handleRematchReady = (data: {
      roomId: string;
      level: Level;
      modeMatch: ModeMatch;
      players: PlayerInfo[];
    }) => {
      setGameState((prev) => ({
        ...prev,
        roomId: data.roomId,
        level: data.level,
        mode: data.modeMatch,
        players: data.players,
        gameStarted: false,
        finished: false,
        currentQuestion: null,
        questionNumber: 0,
        totalQuestions: 0,
        timeRemaining: 0,
        nextQuestionIn: 0,
        lastAnswerResult: null,
        error: null,
      }));
    };

    return {
      handleConnect,
      handleDisconnect,
      handleError,
      handleGameCreated,
      handleGameJoined,
      handlePlayersUpdated,
      handleNewQuestion,
      handleAnswerResult,
      handleQuestionEnded,
      handleGameEnded,
      handleGameStarted,
      handleRematchStatus,
      handleRematchReady,
      handleGameState,
    };
  }, [clearTimeline, startTimer]);

  // Initialize socket connection and event listeners ONCE
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const handlers = createSocketHandlers();

    // Register all event listeners
    socketService.on('connect', handlers.handleConnect);
    socketService.on('disconnect', handlers.handleDisconnect);
    socketService.on('error', handlers.handleError);
    socketService.on('gameCreated', handlers.handleGameCreated);
    socketService.on('gameJoined', handlers.handleGameJoined);
    socketService.on('playersUpdated', handlers.handlePlayersUpdated);
    socketService.on('newQuestion', handlers.handleNewQuestion);
    socketService.on('answerResult', handlers.handleAnswerResult);
    socketService.on('questionEnded', handlers.handleQuestionEnded);
    socketService.on('gameEnded', handlers.handleGameEnded);
    socketService.on('gameStarted', handlers.handleGameStarted);
    socketService.on('rematchStatus', handlers.handleRematchStatus);
    socketService.on('rematchReady', handlers.handleRematchReady);
    socketService.on('gameState', handlers.handleGameState);

    // Connect to socket
    socketService.connect();

    // Handle already connected state
    if (socketService.isConnected()) {
      handlers.handleConnect();
    }

    // Cleanup on unmount
    return () => {
      socketService.off('connect', handlers.handleConnect);
      socketService.off('disconnect', handlers.handleDisconnect);
      socketService.off('error', handlers.handleError);
      socketService.off('gameCreated', handlers.handleGameCreated);
      socketService.off('gameJoined', handlers.handleGameJoined);
      socketService.off('playersUpdated', handlers.handlePlayersUpdated);
      socketService.off('newQuestion', handlers.handleNewQuestion);
      socketService.off('answerResult', handlers.handleAnswerResult);
      socketService.off('questionEnded', handlers.handleQuestionEnded);
      socketService.off('gameEnded', handlers.handleGameEnded);
      socketService.off('gameStarted', handlers.handleGameStarted);
      socketService.off('rematchStatus', handlers.handleRematchStatus);
      socketService.off('rematchReady', handlers.handleRematchReady);
      socketService.off('gameState', handlers.handleGameState);
      clearTimeline();
    };
  }, [createSocketHandlers, clearTimeline]);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(() => {
    const state = {
      ...gameState,
      modeMatch: gameState.mode,
      status: gameState.finished
        ? MatchStatus.FINISHED
        : gameState.gameStarted
          ? MatchStatus.STARTING
          : gameState.roomId
            ? MatchStatus.WAITING
            : null,
      user: {
        userId,
        username: 'Anonymous',
        level: gameState.level ?? Level.A1,
        totalScore: 0,
        matchScore: gameState.players.find((p) => p.userId === userId)?.matchScore ?? 0,
        isOwner: isHost,
        isConnected: gameState.connected,
      } satisfies PlayerInfo,
    };

    const actions = {
      createGame,
      joinGame,
      startGame,
      leaveRoom,
      submitAnswer,
      resetGame,
      playAgain,
      requestRematch,
    };

    return {
      state,
      actions,
      ...gameState,
      userId,
      createGame,
      joinGame,
      startGame,
      leaveRoom,
      submitAnswer,
      resetGame,
      playAgain,
      requestRematch,
      isConnected: gameState.connected,
    };
  }, [
    gameState,
    userId,
    isHost,
    createGame,
    joinGame,
    startGame,
    leaveRoom,
    submitAnswer,
    resetGame,
    playAgain,
    requestRematch,
  ]);
};
