import { Level } from '../common';
import { Question } from '../question';

export interface CategoryQuestion {
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
