import type { Meta, StoryObj } from '@storybook/react';
import StoryPlayerCard from './StoryPlayerCard.component';

const meta: Meta<typeof StoryPlayerCard> = {
  title: 'Story/StoryPlayerCard',
  component: StoryPlayerCard,
  args: {
    player: {
      userId: 'user-1',
      username: 'Fernanda',
      avatarUrl: null,
      connected: true,
      left: false,
    },
    isHost: false,
    isYou: false,
    turnPosition: 1,
  },
  argTypes: {
    onKick: { action: 'kick' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryPlayerCard>;

export const Default: Story = {};

export const HostAndYou: Story = {
  args: {
    isHost: true,
    isYou: true,
  },
};

export const Kickable: Story = {
  args: {
    onKick: () => {},
  },
};

export const Disconnected: Story = {
  args: {
    player: {
      userId: 'user-2',
      username: 'Carlos',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      connected: false,
      left: false,
    },
    turnPosition: 2,
  },
};

export const LeftTheStory: Story = {
  args: {
    player: {
      userId: 'user-3',
      username: 'Lucía',
      avatarUrl: null,
      connected: false,
      left: true,
    },
    turnPosition: 3,
  },
};
