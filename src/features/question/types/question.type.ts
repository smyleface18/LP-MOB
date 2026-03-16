import { CategoryQuestion } from '@/shared/types/category-question';
import { CoreEntity, S3Object } from '@/shared/types/common/cores.type';
import { Game } from '@/shared/types/game';
import { QuestionOption } from '@/shared/types/question-option';

export interface Question extends CoreEntity {
  questionText: string;
  category: CategoryQuestion;
  options: QuestionOption[];
  categoryId: string;
  timeLimit?: number;
  media?: S3Object;
  games: Game[];
}

export interface CreateQuestionDto {
  questionText: string;
  questionImage?: string;
  options: string[];
  correctAnswer: string;
  categoryId: string;
  active?: boolean;
  timeLimit?: number;
}

export interface UpdateQuestionDto {
  questionText?: string;
  questionImage?: string;
  options?: string[];
  correctAnswer?: string;
  categoryId?: string;
  active?: boolean;
  timeLimit?: number;
}
