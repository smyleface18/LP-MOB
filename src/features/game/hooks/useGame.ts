import { useAuthState } from '@/store';
import { useEffect, useReducer } from 'react';
import { useGameTimer } from './useGameTimer';
import { gameReducer, INITIAL_STATE } from './game-reducer';
import { socketService } from '../services/socket.service';
import { ModeMatch } from '../types';
import { Level } from '@/shared/types/common';

export const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const { user } = useAuthState();
  const { start, stop } = useGameTimer(dispatch);

  //  SOCKET EVENTS
  useEffect(() => {
    socketService.on('connect', () =>
      dispatch({
        type: 'CONNECT',
        payload: {
          userId: user?.id || '',
          username: user?.username || 'Anonymous',
          level: user?.level || Level.A1,
          totalScore: user?.score || 0,
          matchScore: 0,
          isOwner: false,
          isConnected: true,
        },
      }),
    );

    socketService.on('disconnect', () => {
      dispatch({ type: 'DISCONNECT' });
      stop();
    });

    socketService.on('error', (e) => {
      dispatch({ type: 'ERROR', payload: e.message });
    });

    socketService.on('gameCreated', (data) => {
      dispatch({ type: 'GAME_CREATED', payload: data });
    });

    socketService.on('gameJoined', (data) => {
      dispatch({ type: 'GAME_JOINED', payload: data });
    });

    socketService.on('playersUpdated', (data) => {
      dispatch({ type: 'PLAYERS_UPDATED', payload: data.players });
    });

    socketService.on('newQuestion', (data) => {
      const seconds = data.timeLimit > 1000 ? Math.floor(data.timeLimit / 1000) : data.timeLimit;

      dispatch({
        type: 'NEW_QUESTION',
        payload: {
          question: data.question,
          questionNumber: data.questionNumber,
          totalQuestions: data.totalQuestions,
          timeRemaining: seconds,
        },
      });

      start(seconds);
    });

    socketService.on('questionEnded', () => {
      dispatch({ type: 'QUESTION_ENDED' });
      stop();
    });
    socketService.on('gameEnded', () => {
      dispatch({ type: 'GAME_ENDED' });
      stop();
    });

    socketService.on('gameStarted', () => {
      dispatch({ type: 'GAME_STARTED' });
    });

    socketService.connect();

    return () => {
      socketService.disconnect();
      stop();
    };
  }, []);

  //  ACTIONS
  const actions = {
    createGame: (level: Level, mode: ModeMatch) => socketService.createGame(level, mode),

    joinGame: (roomId: string) => socketService.joinGame(roomId),

    startGame: () => socketService.startGame(),

    leaveRoom: () => {
      socketService.leaveRoom();
      dispatch({ type: 'RESET' });
      stop();
    },

    submitAnswer: (answer: string) => {
      if (!state.currentQuestion) return;
      socketService.submitAnswer(state.currentQuestion.id, answer, (result, errorr) => {
        if (errorr) {
          dispatch({ type: 'ERROR', payload: errorr });
        } else if (result) {
          dispatch({ type: 'ANSWER_RESULT', payload: result });
        }
      });

      stop();
    },
  };

  return {
    state,
    actions,
    user,
    isConnected: state.user?.isConnected || false,
  };
};
