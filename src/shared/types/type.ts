import { Question } from './question';

export interface SocketEvents {
  // Emit events (cliente -> servidor)
  joinGame: (data: { userId: string }) => void;
  startGame: () => void;
  stopGame: () => void;
  answer: (data: { questionId: string; userId: string; answer: string }) => void;

  // Listen events (servidor -> cliente)
  connect: () => void;
  disconnect: () => void;
  newQuestion: (data: {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    timeLimit: number;
  }) => void;
  answerResult: (data: { correct: boolean; correctAnswer: string; questionId: string }) => void;
  gameEnded: (data: { totalQuestions: number }) => void;
  gameStopped: () => void;
}

export interface GameService {
  connect(): void;
  disconnect(): void;
  joinGame(userId: string): void;
  startGame(): void;
  stopGame(): void;
  submitAnswer(questionId: string, answer: string, userId: string): void;
  isConnected(): boolean;
}
