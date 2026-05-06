import { Level } from '@/shared/types/common';
import { ModeMatch, PlayerInfo, QuestionResultDto } from '../types';
import { OptionDto } from '@/shared/types/question-option';
import { Question, QuestionDto } from '@/features/question/types';

export type GameAction =
  | { type: 'CONNECT'; payload: PlayerInfo }
  | { type: 'DISCONNECT' }
  | { type: 'ERROR'; payload: string }
  | { type: 'GAME_CREATED'; payload: { roomId: string; level: Level; modeMatch: ModeMatch } }
  | { type: 'GAME_JOINED'; payload: { roomId: string; level: Level; modeMatch: ModeMatch } }
  | { type: 'PLAYERS_UPDATED'; payload: PlayerInfo[] }
  | {
      type: 'NEW_QUESTION';
      payload: {
        question: QuestionDto;
        questionNumber: number;
        totalQuestions: number;
        timeRemaining: number;
      };
    }
  | { type: 'ANSWER_RESULT'; payload: QuestionResultDto }
  | { type: 'QUESTION_ENDED' }
  | { type: 'GAME_ENDED' }
  | { type: 'GAME_STARTED' }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'RESET' };
