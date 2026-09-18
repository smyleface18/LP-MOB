import type { Meta, StoryObj } from '@storybook/react';
import { AdminDashboardView } from './AdminDashboard.view';

const meta: Meta<typeof AdminDashboardView> = {
  title: 'Screens/AdminDashboard',
  component: AdminDashboardView,
  args: {
    metrics: {
      totalQuestions: 156,
      totalCategories: 12,
      totalUsers: 2847,
      activeUsers: 1234,
      totalGames: 8921,
      questionsAnswered: 45678,
      newUsersThisWeek: 156,
      averageScore: 76,
      completionRate: 85,
      retentionRate: 72,
    },
    levelUsage: [
      { label: 'Beginners', percentage: 65, color: 'primary' },
      { label: 'Intermediate', percentage: 25, color: 'secondary' },
      { label: 'Advanced', percentage: 10, color: 'accent' },
    ],
    categoryDistribution: [
      { label: 'Vocabulary', percentage: 35 },
      { label: 'Grammar', percentage: 25 },
      { label: 'Listening', percentage: 20 },
      { label: 'Speaking', percentage: 15 },
      { label: 'Others', percentage: 5 },
    ],
    onNavigateToQuestions: () => {},
    onNavigateToCategories: () => {},
    onSignOut: () => {},
    signOutLoading: false,
  },
  argTypes: {
    onNavigateToQuestions: { action: 'navigate-to-questions' },
    onNavigateToCategories: { action: 'navigate-to-categories' },
    onSignOut: { action: 'sign-out' },
  },
};

export default meta;

type Story = StoryObj<typeof AdminDashboardView>;

export const Default: Story = {};

export const SigningOut: Story = {
  args: {
    signOutLoading: true,
  },
};

export const EmptyCategories: Story = {
  args: {
    categoryDistribution: [],
  },
};
