import type { Meta, StoryObj } from '@storybook/react';
import StoryHistoryCard from './StoryHistoryCard.component';
import { Level } from '@/shared/types/common';

const meta: Meta<typeof StoryHistoryCard> = {
  title: 'Story/StoryHistoryCard',
  component: StoryHistoryCard,
  args: {
    item: {
      storyId: 'story-1',
      title: 'The Missing Key',
      finishedAt: '2026-09-27T22:15:00.000Z',
      level: Level.A2,
      panelsCount: 6,
      excerpt: 'Max the little robot woke up alone in an old workshop full of dusty tools.',
      coverImageUrl: 'https://picsum.photos/seed/linguaplay-robot/1024/768',
      players: [
        { userId: 'user-1', name: 'Fernanda', avatarUrl: null },
        { userId: 'user-2', name: 'Carlos', avatarUrl: 'https://i.pravatar.cc/150?img=12' },
        { userId: 'user-3', name: 'Lucía', avatarUrl: null },
      ],
      myPosition: 1,
      myScore: 290,
      likes: { count: 4, likedByMe: true },
    },
    onPress: () => {},
  },
  argTypes: {
    onPress: { action: 'press' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryHistoryCard>;

export const Winner: Story = {};

export const WithoutCover: Story = {
  args: {
    item: { ...meta.args!.item!, coverImageUrl: null, myPosition: 3, myScore: 120 },
  },
};

export const ManyPlayers: Story = {
  args: {
    item: {
      ...meta.args!.item!,
      players: ['Ana', 'Beto', 'Caro', 'Dani', 'Eli', 'Fer'].map((name, index) => ({
        userId: `user-${index}`,
        name,
        avatarUrl: null,
      })),
      myPosition: 5,
    },
  },
};
