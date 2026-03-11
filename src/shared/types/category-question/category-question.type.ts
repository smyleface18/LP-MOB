import { Level } from '../common';
import { CoreEntity } from '../common/cores.type';
import { Question } from '../question';

export interface CategoryQuestion extends CoreEntity {
  id: string;
  level: Level;
  descriptionCategory: string;
  type: TypeQuestionCategory;
  questions?: Question[];
}

export enum TypeQuestionCategory {
  LISTENING = 'LISTENING',
  GRAMMAR = 'GRAMMAR',
  READING = 'READING',
  VOCABULARY = 'VOCABULARY',
  WRITING = 'WRITING',
  SPEAKING = 'SPEAKING',
}

export interface CreateCategoryQuestionDto extends Omit<
  CategoryQuestion,
  'id' | 'active' | 'createdAt' | 'updatedAt' | 'questions'
> {}
