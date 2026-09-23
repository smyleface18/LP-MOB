import { CategoryQuestion } from '@/shared/types/category-question';
import { ContentType } from '@/shared/types/common';
import { MediaAsset } from '@/shared/types/common/cores.type';
import { OptionDto, QuestionOption } from '@/shared/types/question-option';

/**
 * Refleja la entidad `Question` del backend (apps/LP-API/src/db/entities/question.entity.ts).
 * `options` solo viene poblado cuando el endpoint carga esa relación
 * (question.service findAll/findOne y getRandomQuestions la incluyen).
 * `text` solo aplica cuando contentType es TEXT; `media` solo cuando no lo es
 * (lo garantiza un CHECK constraint en la base de datos).
 */
export interface Question {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  contentType: ContentType;
  text?: string;
  media?: MediaAsset;
  moreInfo?: string;
  category: CategoryQuestion;
  options: QuestionOption[];
  categoryId: string;
  timeLimit: number;
}

export interface QuestionDto {
  id: string;
  contentType: ContentType;
  text?: string;
  media?: MediaAsset;
  category: CategoryQuestion;
  options: OptionDto[];
  categoryId: string;
  timeLimit: number;
}

/**
 * Coincide con CreateQuestionDto del backend: OmitType(Question, ['id','active',
 * 'createdAt','updatedAt','options','games','category','media']). Las opciones NO se
 * crean aquí — son un recurso aparte (ver services/question-options.service.ts),
 * y el ValidationPipe del backend (forbidNonWhitelisted) rechaza cualquier campo
 * fuera de esta forma.
 */
export interface CreateQuestionDto {
  contentType: ContentType;
  text?: string;
  mediaId?: string;
  moreInfo?: string;
  categoryId: string;
  timeLimit?: number;
}
