import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuthState } from '@/store';
import { socketService } from '../services/socket.service';
import { Question, QuestionDto } from '@/features/question/types';
import { OptionDto } from '@/shared/types/question-option';
import { MatchStatus, ModeMatch, PlayerInfo } from '../types';
import { Level } from '@/shared/types/common';

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
  players: PlayerInfo[];
  error: string | null;
  lastAnswerResult: { correct: boolean; correctAnswer: OptionDto[] } | null;
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
  players: [],
  error: null,
  lastAnswerResult: null,
};

const toSeconds = (timeLimit: number): number =>
  timeLimit > 1000 ? Math.ceil(timeLimit / 1000) : Math.max(0, Math.ceil(timeLimit));

export const useGame = () => {
  const [gameState, setGameState] = useState<Game>(INITIAL_STATE);
  const { user } = useAuthState();
  const [userId, setUserId] = useState(user?.id ?? '');
  const [isHost, setIsHost] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (user?.id) setUserId(user.id);
  }, [user?.id]);

  // ⏱️ Timer utilities - memoized to prevent recreation
  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = useCallback(
    (seconds: number) => {
      stopTimer();
      setGameState((prev) => ({ ...prev, timeRemaining: seconds }));
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            stopTimer();
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    },
    [stopTimer],
  );

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
      setGameState((prev) => ({ ...prev, roomId, error: null }));
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
        currentQuestion: null,
        timeRemaining: 0,
        score: 0,
        error: null,
      }));
      stopTimer();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to leave room';
      setGameState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, [stopTimer]);

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!gameState.currentQuestion) return;
      try {
        socketService.submitAnswer(gameState.currentQuestion.id, answer);
        stopTimer();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to submit answer';
        setGameState((prev) => ({ ...prev, error: errorMsg }));
      }
    },
    [gameState.currentQuestion, stopTimer],
  );

  const resetGame = useCallback(() => {
    setIsHost(false);
    setGameState(INITIAL_STATE);
    stopTimer();
  }, [stopTimer]);

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
      }));
      stopTimer();
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

    const handleNewQuestion = (data: {
      question: QuestionDto;
      questionNumber: number;
      totalQuestions: number;
      timeLimit: number;
    }) => {
      const timeRemaining = toSeconds(data.timeLimit);
      setGameState((prev) => ({
        ...prev,
        currentQuestion: data.question,
        questionNumber: data.questionNumber,
        totalQuestions: data.totalQuestions,
        timeRemaining,
        gameStarted: true,
        finished: false,
        error: null,
      }));
      startTimer(timeRemaining);
    };

    const handleAnswerResult = (data: { correct: boolean; correctAnswer: OptionDto[] }) => {
      setGameState((prev) => ({
        ...prev,
        lastAnswerResult: data,
      }));
      // Auto-clear after a brief delay to prevent multiple processing
      setTimeout(() => {
        setGameState((prev) => ({ ...prev, lastAnswerResult: null }));
      }, 100);
    };

    const handleQuestionEnded = () => {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: null,
        timeRemaining: 0,
      }));
      stopTimer();
    };

    const handleGameEnded = (data: { results: any[] }) => {
      setGameState((prev) => ({
        ...prev,
        gameStarted: false,
        finished: true,
        currentQuestion: null,
        timeRemaining: 0,
      }));
      stopTimer();
    };

    const handleGameStarted = () => {
      setGameState((prev) => ({ ...prev, gameStarted: true, error: null }));
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
        score: 0,
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
    };
  }, [stopTimer, startTimer]);

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
      stopTimer();
    };
  }, [createSocketHandlers, stopTimer]);

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
