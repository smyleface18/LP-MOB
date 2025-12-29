// types.ts
export enum LevelCategoryQuestion {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
}

export enum TypeQuestionCategory {
  LISTENING = "LISTENING",
  GRAMMAR = "GRAMMAR",
  READING = "READING",
  VOCABULARY = "VOCABULARY",
  WRITING = "WRITING",
  SPEAKING = "SPEAKING",
}

export interface CoreEntity {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CategoryQuestion extends CoreEntity {
  level: LevelCategoryQuestion;
  descriptionCategory: string;
  questions: Question[];
  type: TypeQuestionCategory;
}

export interface Question extends CoreEntity {
  questionText?: string;
  questionImage?: string;
  options: string[];
  correctAnswer: string;
  category: CategoryQuestion;
  categoryId: string;
}

export interface GameQuestion {
  questionText?: string;
  questionImage?: string;
  options: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// types/game.types.ts
export interface GameQuestion extends Question {
  // Hereda de Question pero podemos extender si es necesario
}

export interface GameState {
  connected: boolean;
  gameStarted: boolean;
  currentQuestion: GameQuestion | null;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  score: number;
  userId: string;
}

export interface SocketEvents {
  // Emit events (cliente -> servidor)
  joinGame: (data: { userId: string }) => void;
  startGame: () => void;
  stopGame: () => void;
  answer: (data: {
    questionId: string;
    userId: string;
    answer: string;
  }) => void;

  // Listen events (servidor -> cliente)
  connect: () => void;
  disconnect: () => void;
  newQuestion: (data: {
    question: GameQuestion;
    questionNumber: number;
    totalQuestions: number;
    timeLimit: number;
  }) => void;
  answerResult: (data: {
    correct: boolean;
    correctAnswer: string;
    questionId: string;
  }) => void;
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

export interface SignUpDto {
  email: string;
  username: string;
  password: string;
}

export interface ResponseApi<T> {
  ok: boolean;
  message: string;
  data: T | null;
}

export interface Authenticated {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}
