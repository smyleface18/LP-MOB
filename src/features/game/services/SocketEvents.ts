import { Level } from '@/shared/types/common';
import { QuestionDto } from '@/features/question/types';
import { ApiResponse } from '@/shared/api/types';
import { PlayerInfo, ModeMatch, QuestionResultDto } from '../types';

/**
 * Eventos que emite el servidor hacia el cliente
 */
export type ServerToClientEvents = {
  connect: void;
  disconnect: { reason: string };
  error: { message: string };
  playersUpdated: { players: PlayerInfo[] };
  newQuestion: {
    question: QuestionDto;
    questionNumber: number;
    totalQuestions: number;
    timeLimit: number;
  };
  answer: QuestionResultDto;
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
  gameStarted: void;
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
  answer: (
    data: { questionId: string; answerId: string },
    cb: (res: ApiResponse<QuestionResultDto>) => void,
  ) => void;
  gameEnded: () => void;
  gameStarted: () => void;
};
