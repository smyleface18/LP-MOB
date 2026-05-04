import { CategoryQuestion } from '@/shared/types/category-question';
import { ContentObject, S3Object } from '@/shared/types/common/cores.type';
import { OptionDto, QuestionOption } from '@/shared/types/question-option';

export interface Question {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  questionText: string;
  category: CategoryQuestion;
  options: QuestionOption[];
  categoryId: string;
  timeLimit: number;
  media?: S3Object;
}

export interface QuestionDto {
  id: string;
  content: ContentObject;
  category: CategoryQuestion;
  options: OptionDto[];
  categoryId: string;
  timeLimit: number;
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
