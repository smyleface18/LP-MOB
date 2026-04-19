import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { socketService } from '../services/socket.service';
import { Question } from '@/features/question/types';
import { Level, ModeMatch } from '@/shared/types/Type';
import { OptionDto } from '@/shared/types/question-option';
import { useAuthState } from '@/store';
import { Match, PlayerInfo } from '../types';



const INITIAL_STATE: Match = {
  connected: false,
  roomId: null,
  level: null,
  mode: null,
  gameStarted: false,
  currentQuestion: null,
  questionNumber: 0,
  totalQuestions: 0,
  timeRemaining: 0,
  score: 0,
  players: [],
  error: null,
  lastAnswerResult: null,
};

export const useGame = () => {
  const [gameState, setGameState] = useState<Match>(INITIAL_STATE);
  const { user } = useAuthState();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  // ⏱️ Timer utilities - memoized to prevent recreation
  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = useCallback((seconds: number) => {
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
  }, [stopTimer]);

  // 🎮 Game actions - memoized
  const createGame = useCallback((level: Level, mode: ModeMatch) => {
    try {
      socketService.createGame(level, mode);
      setGameState((prev) => ({ ...prev, level, mode, error: null }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create game';
      setGameState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, []);

  const joinGame = useCallback((roomId: string) => {
    try {
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
    setGameState(INITIAL_STATE);
    stopTimer();
  }, [stopTimer]);

  // 🔌 Socket event handlers - create once and reuse
  const createSocketHandlers = useCallback(() => {
    const handleConnect = () => {
      setGameState((prev) => ({ ...prev, connected: true, error: null }));
    };

    const handleDisconnect = () => {
      setGameState((prev) => ({
        ...prev,
        connected: false,
        roomId: null,
        players: [],
        gameStarted: false,
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
      question: Question;
      questionNumber: number;
      totalQuestions: number;
      timeLimit: number;
    }) => {
      const timeRemaining = Math.floor(data.timeLimit / 1000);
      setGameState((prev) => ({
        ...prev,
        currentQuestion: data.question,
        questionNumber: data.questionNumber,
        totalQuestions: data.totalQuestions,
        timeRemaining,
        gameStarted: true,
        error: null,
      }));
      startTimer(timeRemaining);
    };

    const handleAnswerResult = (data: { correct: boolean; correctAnswer: OptionDto[] }) => {
      setGameState((prev) => ({
        ...prev,
        lastAnswerResult: data,
        score: data.correct ? prev.score + 1 : prev.score,
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
        currentQuestion: null,
        timeRemaining: 0,
      }));
      stopTimer();
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
      stopTimer();
    };
  }, [createSocketHandlers, stopTimer]);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      ...gameState,
      user,
      createGame,
      joinGame,
      startGame,
      leaveRoom,
      submitAnswer,
      resetGame,
      isConnected: gameState.connected,
    }),
    [gameState, user, createGame, joinGame, startGame, leaveRoom, submitAnswer, resetGame],
  );
};
