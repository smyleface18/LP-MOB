import type { Meta, StoryObj } from '@storybook/react';
import { UserDashboardView } from './UserDashboard.view';

const meta: Meta<typeof UserDashboardView> = {
  title: 'Screens/UserDashboard',
  component: UserDashboardView,
  args: {
    username: 'Fernanda',
    isConnected: true,
    stats: {
      scoreLabel: '1250 XP',
      gamesWon: 18,
      currentStreak: 5,
      categoriesCount: 3,
      accuracyPercentage: 76,
      winRatePercentage: 40,
      streakPowerPercentage: 50,
    },
    levelProgress: [
      { label: 'A1 · 34 answers', percentage: 74 },
      { label: 'A2 · 12 answers', percentage: 58 },
    ],
    stories: { played: 4, panelsWritten: 9, averagePanelScore: 96.3 },
    onOpenStories: () => {},
    onSignOut: () => {},
    signOutLoading: false,
  },
  argTypes: {
    onOpenStories: { action: 'open-stories' },
    onSignOut: { action: 'sign-out' },
  },
};

export default meta;

type Story = StoryObj<typeof UserDashboardView>;

export const Default: Story = {};

export const Disconnected: Story = {
  args: {
    isConnected: false,
  },
};

export const SigningOut: Story = {
  args: {
    signOutLoading: true,
  },
};

export const NewPlayer: Story = {
  args: {
    username: 'Nuevo Jugador',
    stats: {
      scoreLabel: '0 XP',
      gamesWon: 0,
      currentStreak: 0,
      categoriesCount: 0,
      accuracyPercentage: 0,
      winRatePercentage: 0,
      streakPowerPercentage: 0,
    },
    levelProgress: [],
    stories: { played: 0, panelsWritten: 0, averagePanelScore: 0 },
  },
};

export const StatsError: Story = {
  args: {
    statsError: 'Could not load your stats',
  },
};
