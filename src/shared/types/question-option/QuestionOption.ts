import { CoreEntity, S3Object } from '../common/cores.type';
import { Question } from '@/features/question/types';

export interface QuestionOption extends CoreEntity {
  text?: string;

  media?: S3Object;

  isCorrect: boolean;

  question: Question;

  questionId: string;
}

export interface OptionDto {
  id: string;
  text?: string;
  media?: S3Object;
  isCorrect?: boolean;
}
