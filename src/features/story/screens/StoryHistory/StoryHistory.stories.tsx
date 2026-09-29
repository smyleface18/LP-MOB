import type { Meta, StoryObj } from '@storybook/react';
import StoryHistoryView from './StoryHistory.view';
import { Level } from '@/shared/types/common';
import { StoryHistoryItem } from '../../types';

const ITEMS: StoryHistoryItem[] = [
  {
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
    ],
    myPosition: 1,
    myScore: 290,
    likes: { count: 4, likedByMe: true },
  },
  {
    storyId: 'story-2',
    title: null,
    finishedAt: '2026-09-20T18:40:00.000Z',
    level: Level.B1,
    panelsCount: 4,
    excerpt: 'The pirates found a map under the sand, but it was written in a strange language.',
    coverImageUrl: null,
    players: [
      { userId: 'user-3', name: 'Lucía', avatarUrl: null },
      { userId: 'user-1', name: 'Fernanda', avatarUrl: null },
      { userId: 'user-4', name: 'Diego', avatarUrl: null },
    ],
    myPosition: 2,
    myScore: 180,
    likes: { count: 0, likedByMe: false },
  },
];

const meta: Meta<typeof StoryHistoryView> = {
  title: 'Screens/StoryHistory',
  component: StoryHistoryView,
  args: {
    items: ITEMS,
    total: 2,
    loading: false,
    loadingMore: false,
    error: null,
    onRefresh: () => {},
    onLoadMore: () => {},
    onOpen: () => {},
    onBack: () => {},
  },
  argTypes: {
    onOpen: { action: 'open' },
    onBack: { action: 'back' },
    onRefresh: { action: 'refresh' },
    onLoadMore: { action: 'load-more' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryHistoryView>;

export const WithStories: Story = {};

export const Empty: Story = {
  args: { items: [], total: 0 },
};

export const Loading: Story = {
  args: { items: [], total: 0, loading: true },
};

export const Error: Story = {
  args: { items: [], total: 0, error: 'Could not connect to the server' },
};

export const LoadingMore: Story = {
  args: { total: 25, loadingMore: true },
};
