import type { Meta, StoryObj } from '@storybook/react';
import PlayerCard from './PlayerCard.component';
import { Level } from '@/shared/types/common';

const meta: Meta<typeof PlayerCard> = {
  title: 'Game/PlayerCard',
  component: PlayerCard,
  args: {
    player: {
      userId: 'user-1',
      username: 'Fernanda',
      level: Level.B1,
      matchScore: 320,
      totalScore: 1450,
      isConnected: true,
      isOwner: false,
    },
    isHost: false,
  },
};

export default meta;

type Story = StoryObj<typeof PlayerCard>;

export const Default: Story = {};

export const Host: Story = {
  args: {
    isHost: true,
  },
};

export const Disconnected: Story = {
  args: {
    player: {
      userId: 'user-2',
      username: 'Carlos',
      level: Level.A2,
      matchScore: 0,
      totalScore: 320,
      isConnected: false,
      isOwner: false,
    },
  },
};
