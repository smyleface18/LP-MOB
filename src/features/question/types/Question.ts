import { CategoryQuestion } from '@/shared/types/category-question';
import { S3Object } from '@/shared/types/common/cores.type';
import { OptionDto } from '@/shared/types/question-option';

export interface Question {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  questionText: string;
  category: CategoryQuestion;
  options: OptionDto[];
  categoryId: string;
  timeLimit: number;
  media?: S3Object;
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
