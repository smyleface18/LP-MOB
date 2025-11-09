// types.ts
export enum LevelCategoryQuestion {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum TypeQuestionCategory {
  LISTENING = 'LISTENING',
  GRAMMAR = 'GRAMMAR',
  READING = 'READING',
  VOCABULARY = 'VOCABULARY',
  WRITING = 'WRITING',
  SPEAKING = 'SPEAKING',
}


export interface CoreEntity {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CategoryQuestion extends CoreEntity {
  level: LevelCategoryQuestion;
  descriptionCategory: string;
  questions: Question[];
  type: TypeQuestionCategory;
}

export interface Question extends CoreEntity {
  questionText?: string;
  questionImage?: string;
  options: string[];
  correctAnswer: string;
  category: CategoryQuestion;
  categoryId: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}