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
      averageScore: 76,
      winRatePercentage: 40,
      streakPowerPercentage: 50,
    },
    levelProgress: [
      { label: 'Beginner', percentage: 65 },
      { label: 'Intermediate', percentage: 25 },
      { label: 'Advanced', percentage: 10 },
    ],
    onHowToPlay: () => {},
    onSignOut: () => {},
    signOutLoading: false,
  },
  argTypes: {
    onHowToPlay: { action: 'how-to-play' },
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
      averageScore: 0,
      winRatePercentage: 0,
      streakPowerPercentage: 0,
    },
  },
};
