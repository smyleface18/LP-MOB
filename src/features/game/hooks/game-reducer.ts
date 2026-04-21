import { Match } from '../types';
import { GameAction } from './game-action';
import { Level } from '@/shared/types/common';

export const INITIAL_STATE: Match = {
  roomId: null,
  level: null,
  modeMatch: null,
  status: null,
  gameStarted: false,
  currentQuestion: null,
  questionNumber: 0,
  totalQuestions: 0,
  timeRemaining: 0,
  players: [],
  error: null,
  lastAnswerResult: null,
  user: {
    userId: '',
    username: 'Anonymous',
    level: Level.A1,
    totalScore: 0,
    matchScore: 0,
    isOwner: false,
    isConnected: true,
  },
};

export function gameReducer(state: Match, action: GameAction): Match {
  switch (action.type) {
    case 'CONNECT':
      return { ...state, user: action.payload, error: null };

    case 'DISCONNECT':
      return {
        ...state,
        user: {
          ...state.user,
          isConnected: false,
        },
        roomId: null,
        players: [],
        gameStarted: false,
        currentQuestion: null,
        timeRemaining: 0,
      };

    case 'ERROR':
      return { ...state, error: action.payload };

    case 'GAME_CREATED':
      return {
        ...state,
        user: {
          ...state.user,
          isOwner: true,
        },
        ...action.payload,
        gameStarted: false,
        error: null,
      };

    case 'GAME_JOINED':
      return {
        ...state,
        roomId: action.payload.roomId,
        level: action.payload.level,
        modeMatch: action.payload.modeMatch,
        gameStarted: false,
        error: null,
      };

    case 'PLAYERS_UPDATED':
      return { ...state, players: action.payload };

    case 'NEW_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload.question,
        questionNumber: action.payload.questionNumber,
        totalQuestions: action.payload.totalQuestions,
        timeRemaining: action.payload.timeRemaining,
        gameStarted: true,
      };

    case 'SET_TIME':
      return { ...state, timeRemaining: action.payload };

    case 'ANSWER_RESULT':
      return {
        ...state,
        lastAnswerResult: action.payload,
        user: {
          ...state.user,
          matchScore: action.payload.correct ? state.user.matchScore + 100 : state.user.matchScore,
        },
      };

    case 'QUESTION_ENDED':
      return { ...state, currentQuestion: null, timeRemaining: 0 };

    case 'GAME_ENDED':
      return { ...state, gameStarted: false, currentQuestion: null, timeRemaining: 0 };

    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}
