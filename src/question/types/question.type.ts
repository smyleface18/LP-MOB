import { CategoryQuestion } from '@/shared/types/category-question';
import { CoreEntity, S3Object } from '@/shared/types/common/cores.type';
import { Game } from '@/shared/types/game';
import { QuestionOption } from '@/shared/types/question-option';

export interface Question extends CoreEntity {
  questionText: string;

  category: CategoryQuestion;

  options: QuestionOption[];

  categoryId: string;

  timeLimit: number; // debe ser en milisegundo

  media?: S3Object;

  games: Game[];
}

export interface UpdateQuestionDto extends Partial<Omit<Question, 'id' | 'games'>> {}

export interface CreateQuestionDto extends Omit<
  Question,
  'id' | 'active' | 'createdAt' | 'updatedAt' | 'games' | 'category'
> {}
