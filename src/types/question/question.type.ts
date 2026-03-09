import { CategoryQuestion } from '../category-question';
import { CoreEntity, S3Object } from '../common/cores.type';
import { Game } from '../game';
import { QuestionOption } from '../question-option';

export interface Question extends CoreEntity {
  questionText: string;

  category: CategoryQuestion;

  options: QuestionOption[];

  categoryId: string;

  timeLimit: number; // debe ser en milisegundo

  media?: S3Object;

  games: Game[];
}
