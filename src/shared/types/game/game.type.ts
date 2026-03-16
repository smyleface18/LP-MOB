import { Level } from '../common';
import { CoreEntity } from '../common/cores.type';
import { Question } from '@/features/question/types';
import { User } from '../user';

export interface Game extends CoreEntity {
  difficulty: Level;

  questions: Question[];

  userGames: UserGame[];
}

export interface UserGame extends CoreEntity {
  user: User;

  userId: string;

  game: Game;

  gameId: string;

  score: number;

  position: number;
}
