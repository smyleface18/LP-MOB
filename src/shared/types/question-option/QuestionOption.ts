import { ContentObject, CoreEntity, S3Object } from '../common/cores.type';
import { Question } from '@/features/question/types';

export interface QuestionOption extends CoreEntity {
  content: ContentObject;

  isCorrect: boolean;

  question: Question;

  questionId: string;
}

export interface OptionDto {
  id: string;
  content: ContentObject;
}

/**
 * Coincide con CreateQuestionOptionDto del backend: OmitType(QuestionOption,
 * ['id','createdAt','updatedAt','active','question']).
 */
export interface CreateQuestionOptionDto {
  content: ContentObject;
  isCorrect: boolean;
  questionId: string;
}

export interface UpdateQuestionOptionDto extends Partial<CreateQuestionOptionDto> {}
