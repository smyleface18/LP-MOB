import { Question, QuestionDto } from '@/features/question/types';
import { Level } from '@/shared/types/common';
import { CoreEntity } from '@/shared/types/common/cores.type';
import { OptionDto } from '@/shared/types/question-option';

export enum ModeMatch {
  SINGLEPLAYER = 'SINGLEPLAYER',
  MULTIPLAYER = 'MULTIPLAYER',
}

export enum MatchStatus {
  WAITING = 'WAITING',
  QUESTION_ACTIVE = 'QUESTION_ACTIVE',
  PROCESSING = 'PROCESSING',
  BETWEEN_QUESTIONS = 'BETWEEN_QUESTIONS',
  FINISHED = 'FINISHED',
  STARTING = 'STARTING',
  PREPARING = 'PREPARING',
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
  questionEnded: () => void;
  gameEnded: (data: { results: any[] }) => void;
  playersUpdated: (data: { players: PlayerInfo[] }) => void;
  gameStarted: () => void;
  rematchStatus: (data: { accepted: number; total: number }) => void;
  rematchReady: (data: {
    roomId: string;
    level: Level;
    modeMatch: ModeMatch;
    players: PlayerInfo[];
  }) => void;
  // El gateway (game.gateway.ts handleAnswer) emite {correct, correctAnswer} plano,
  // no envuelto en un campo "result".
  answerResult: (data: AnswerResult) => void;
}

export interface GameService {
  connect(): void;
  disconnect(): void;
  createGame(level: Level, modeMatch: ModeMatch): void;
  joinGame(roomId: string): void;
  startGame(): void;
  requestRematch(): void;
  leaveRoom(): void;
  submitAnswer(questionId: string, answerId: string): void;
  isConnected(): boolean;
}

export interface Game extends CoreEntity {
  difficulty: Level;

  questions: Question[];

  userGames: UserGame[];
}

export interface UserGame extends CoreEntity {
  user: any; // User type not available in mobile app

  userId: string;

  game: Game;

  gameId: string;

  score: number;

  position: number;
}

export interface PlayerInfo {
  userId: string;
  username: string;
  level: Level;
  matchScore: number;
  totalScore: number;
  isConnected: boolean;
  isOwner: boolean;
  avatar?: string;
}

// Payload real del evento de socket 'answerResult' (game.gateway.ts handleAnswer).
export interface AnswerResult {
  correct: boolean;
  correctAnswer: OptionDto[];
}
