import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services/socket.service';
import { GameQuestion, GameState } from '../types/type';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    connected: false,
    gameStarted: false,
    currentQuestion: null,
    questionNumber: 0,
    totalQuestions: 0,
    timeRemaining: 0,
    score: 0,
    userId: `user_${Math.random().toString(36).substr(2, 9)}`,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Conexión
  useEffect(() => {
    const handleConnect = () => setGameState(prev => ({ ...prev, connected: true }));
    const handleDisconnect = () => {
      setGameState(prev => ({ ...prev, connected: false }));
      stopTimer();
    };

    const handleError = (data: { error: string }) => console.error('Socket error:', data.error);

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('error', handleError);

    // Conectar después de registrar listeners
    socketService.connect();

    // Si ya estaba conectado
    if (socketService.isConnected()) handleConnect();

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('error', handleError);
      stopTimer();
    };
  }, []);

  // Eventos del juego
  useEffect(() => {
    const handleNewQuestion = (data: {
      question: GameQuestion;
      questionNumber: number;
      totalQuestions: number;
      timeLimit: number;
    }) => {
      const timeRemaining = Math.floor(data.timeLimit / 1000);
      setGameState(prev => ({
        ...prev,
        currentQuestion: data.question,
        questionNumber: data.questionNumber,
        totalQuestions: data.totalQuestions,
        timeRemaining,
        gameStarted: true,
      }));
      startTimer(timeRemaining);
    };

    const handleAnswerResult = (data: { correct: boolean; correctAnswer: string; questionId: string }) => {
      if (data.correct) setGameState(prev => ({ ...prev, score: prev.score + 1 }));
    };

    const handleGameEnded = () => stopGameState();
    const handleGameStopped = () => stopGameState();

    const stopGameState = () => {
      setGameState(prev => ({
        ...prev,
        gameStarted: false,
        currentQuestion: null,
        timeRemaining: 0,
      }));
      stopTimer();
    };

    socketService.on('newQuestion', handleNewQuestion);
    socketService.on('answerResult', handleAnswerResult);
    socketService.on('gameEnded', handleGameEnded);
    socketService.on('gameStopped', handleGameStopped);

    return () => {
      socketService.off('newQuestion', handleNewQuestion);
      socketService.off('answerResult', handleAnswerResult);
      socketService.off('gameEnded', handleGameEnded);
      socketService.off('gameStopped', handleGameStopped);
    };
  }, []);

  // Timer
  const startTimer = useCallback((seconds: number) => {
    stopTimer();
    setGameState(prev => ({ ...prev, timeRemaining: seconds }));
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          stopTimer();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // Acciones
  const joinGame = useCallback(() => {
    try {
      socketService.joinGame(gameState.userId);
      setGameState(prev => ({ ...prev, gameStarted: true }));
    } catch (err) { console.error(err); }
  }, [gameState.userId]);

  const startGame = useCallback(() => {
    try { socketService.startGame(); } catch (err) { console.error(err); }
  }, []);

  const stopGame = useCallback(() => {
    try { socketService.stopGame(); } catch (err) { console.error(err); }
  }, []);

  const submitAnswer = useCallback((answer: string) => {
    if (!gameState.currentQuestion) return;
    try {
      socketService.submitAnswer(gameState.currentQuestion.id, answer);
      stopTimer();
    } catch (err) { console.error(err); }
  }, [gameState.currentQuestion, stopTimer]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: null,
      questionNumber: 0,
      totalQuestions: 0,
      timeRemaining: 0,
      score: 0,
      gameStarted: false,
    }));
    stopTimer();
  }, [stopTimer]);

  return {
    ...gameState,
    joinGame,
    startGame,
    stopGame,
    submitAnswer,
    resetGame,
    isConnected: gameState.connected,
  };
};
