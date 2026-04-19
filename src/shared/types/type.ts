import { Question } from '@/features/question/types';
import { Level } from './common/enum.type';
import { OptionDto } from './question-option';
import { PlayerInfo } from '@/features/game/types/PlayerInfo';


export { Level };

export enum ModeMatch {
  SINGLEPLAYER = 'SINGLEPLAYER',
  MULTIPLAYER = 'MULTIPLAYER',
}

export interface SocketEvents {
  // Emit events (cliente -> servidor)
  createGame: (data: { level: Level; modeMatch: ModeMatch }) => void;
  joinGame: (data: { roomId: string }) => void;
  answer: (data: { questionId: string; answerId: string }) => void;
  startGame: () => void;
  leaveRoom: () => void;

  // Listen events (servidor -> cliente)
  connect: () => void;
  disconnect: (data: { reason: string }) => void;
  error: (data: { message: string }) => void;
  newQuestion: (data: {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    timeLimit: number;
  }) => void;
  answerResult: (data: { correct: boolean; correctAnswer: OptionDto[] }) => void;
  questionEnded: () => void;
  gameEnded: (data: { results: any[] }) => void;
  playersUpdated: (data: { players: PlayerInfo[] }) => void;
}

export interface GameService {
  connect(): void;
  disconnect(): void;
  createGame(level: Level, modeMatch: ModeMatch): void;
  joinGame(roomId: string): void;
  startGame(): void;
  leaveRoom(): void;
  submitAnswer(questionId: string, answerId: string): void;
  isConnected(): boolean;
}
