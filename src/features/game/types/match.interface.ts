import { Level, ModeMatch } from "@/shared/types/Type";
import { PlayerInfo } from "./PlayerInfo";
import { Question } from "@/features/question/types";
import { OptionDto } from "@/shared/types/question-option/QuestionOption";

export interface Match  {
  connected: boolean;
  roomId: string | null;
  level: Level | null;
  mode: ModeMatch | null;
  gameStarted: boolean;
  currentQuestion: Question | null;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  score: number;
  players: PlayerInfo[];
  error: string | null;
  lastAnswerResult: { correct: boolean; correctAnswer: OptionDto[] } | null;
}

