/**
 * Tipos de Socket.io - Alineados con backend
 */

import { Level } from '@/shared/types/common';
import { Question } from '@/features/question/types';
import { OptionDto } from '@/shared/types/question-option';
import { ApiResponse } from '@/shared/api/types';
import { PlayerInfo, ModeMatch } from '../types';

/**
 * Eventos que emite el servidor hacia el cliente
 */
export type ServerToClientEvents = {
  connect: void;
  disconnect: { reason: string };
  error: { message: string };
  playersUpdated: { players: PlayerInfo[] };
  newQuestion: {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    timeLimit: number;
  };
  answerResult: {
    correct: boolean;
    correctAnswer: OptionDto[];
  };
  questionEnded: void;
  gameEnded: {
    results: any[];
  };
  gameCreated: {
    roomId: string;
    level: Level;
    modeMatch: ModeMatch;
  };
  gameJoined: {
    roomId: string;
    level: Level;
    modeMatch: ModeMatch;
  };
};

/**
 * Eventos que emite el cliente hacia el servidor
 */
export type ClientToServerEvents = {
  createGame: (
    data: { level: Level; modeMatch: ModeMatch },
    cb: (res: ApiResponse<any>) => void,
  ) => void;
  joinGame: (data: { roomId: string }, cb: (res: ApiResponse<any>) => void) => void;
  startGame: () => void;
  leaveRoom: () => void;
  answer: (data: { questionId: string; answerId: string }) => void;
};
