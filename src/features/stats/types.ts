import { Level } from '@/shared/types/common';

/** `GET /stats/me` (mismo formato que la API; porcentajes enteros 0–100). */
export interface PlayerStats {
  score: number;
  level: Level;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  winRate: number;
  trivia: {
    questionsAnswered: number;
    correctAnswers: number;
    accuracy: number;
    categoriesPracticed: number;
  };
  levels: { level: Level; answered: number; accuracy: number }[];
  stories: {
    played: number;
    panelsWritten: number;
    totalScore: number;
    averagePanelScore: number;
  };
}

/** `GET /admin/stats`. */
export interface AdminStats {
  users: {
    total: number;
    players: number;
    admins: number;
    activeThisWeek: number;
    activeRate: number;
    newThisWeek: number;
  };
  content: { questions: number; categories: number };
  trivia: { games: number; questionsAnswered: number; accuracy: number; winRate: number };
  stories: { total: number; published: number; removed: number; panels: number };
  levelUsage: { level: Level; triviaGames: number; stories: number; percentage: number }[];
  categoryDistribution: { category: string; answers: number; percentage: number }[];
}
