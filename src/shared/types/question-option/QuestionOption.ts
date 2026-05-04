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
