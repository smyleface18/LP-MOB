import { ContentType } from '../common';
import { CoreEntity, MediaAsset } from '../common/cores.type';
import { Question } from '@/features/question/types';

export interface QuestionOption extends CoreEntity {
  contentType: ContentType;
  text?: string;
  media?: MediaAsset;

  isCorrect: boolean;

  question: Question;

  questionId: string;
}

export interface OptionDto {
  id: string;
  contentType: ContentType;
  text?: string;
  media?: MediaAsset;
}

/**
 * Coincide con CreateQuestionOptionDto del backend: OmitType(QuestionOption,
 * ['id','createdAt','updatedAt','active','question','media']).
 */
export interface CreateQuestionOptionDto {
  contentType: ContentType;
  text?: string | null;
  mediaId?: string | null;
  isCorrect: boolean;
  questionId: string;
}

export interface UpdateQuestionOptionDto extends Partial<CreateQuestionOptionDto> {}
