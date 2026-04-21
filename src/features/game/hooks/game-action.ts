import { Level } from '@/shared/types/common';
import { ModeMatch, PlayerInfo } from '../types';
import { OptionDto } from '@/shared/types/question-option';
import { Question } from '@/features/question/types';

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
        question: Question;
        questionNumber: number;
        totalQuestions: number;
        timeRemaining: number;
      };
    }
  | { type: 'ANSWER_RESULT'; payload: { correct: boolean; correctAnswer: OptionDto[] } }
  | { type: 'QUESTION_ENDED' }
  | { type: 'GAME_ENDED' }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'RESET' };
