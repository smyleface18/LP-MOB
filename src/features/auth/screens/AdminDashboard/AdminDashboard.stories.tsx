import type { Meta, StoryObj } from '@storybook/react';
import { Level } from '@/shared/types/common';
import { AdminStats } from '@/features/stats/types';
import { AdminDashboardView } from './AdminDashboard.view';

const STATS: AdminStats = {
  users: {
    total: 124,
    players: 120,
    admins: 4,
    activeThisWeek: 38,
    activeRate: 32,
    newThisWeek: 9,
  },
  content: { questions: 156, categories: 12 },
  trivia: { games: 892, questionsAnswered: 4567, accuracy: 74, winRate: 41 },
  stories: { total: 57, published: 55, removed: 2, panels: 312 },
  levelUsage: [
    { level: Level.A1, triviaGames: 520, stories: 30, percentage: 58 },
    { level: Level.A2, triviaGames: 300, stories: 20, percentage: 34 },
    { level: Level.B1, triviaGames: 72, stories: 5, percentage: 8 },
  ],
  categoryDistribution: [
    { category: 'Vocabulary', answers: 1600, percentage: 35 },
    { category: 'Grammar', answers: 1140, percentage: 25 },
    { category: 'Listening', answers: 913, percentage: 20 },
    { category: 'Reading', answers: 914, percentage: 20 },
  ],
};

const meta: Meta<typeof AdminDashboardView> = {
  title: 'Screens/AdminDashboard',
  component: AdminDashboardView,
  args: {
    stats: STATS,
    loading: false,
    error: null,
    onRefresh: () => {},
    onNavigateToQuestions: () => {},
    onNavigateToCategories: () => {},
    onNavigateToStories: () => {},
  },
  argTypes: {
    onRefresh: { action: 'refresh' },
    onNavigateToQuestions: { action: 'navigate-to-questions' },
    onNavigateToCategories: { action: 'navigate-to-categories' },
    onNavigateToStories: { action: 'navigate-to-stories' },
  },
};

export default meta;

type Story = StoryObj<typeof AdminDashboardView>;

export const Default: Story = {};

export const Loading: Story = {
  args: { stats: null, loading: true },
};

export const LoadError: Story = {
  args: { stats: null, error: 'No se pudieron cargar las estadísticas' },
};

/** En el celular no hay secciones de administración: sin botones. */
export const Mobile: Story = {
  args: {
    onNavigateToQuestions: undefined,
    onNavigateToCategories: undefined,
    onNavigateToStories: undefined,
  },
};

export const EmptyApp: Story = {
  args: {
    stats: {
      ...STATS,
      trivia: { games: 0, questionsAnswered: 0, accuracy: 0, winRate: 0 },
      stories: { total: 0, published: 0, removed: 0, panels: 0 },
      levelUsage: [],
      categoryDistribution: [],
    },
  },
};
