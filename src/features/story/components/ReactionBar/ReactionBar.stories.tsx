import type { Meta, StoryObj } from '@storybook/react';
import ReactionBar from './ReactionBar.component';

const meta: Meta<typeof ReactionBar> = {
  title: 'Story/ReactionBar',
  component: ReactionBar,
  args: {
    reactions: { 'user-2': '😂', 'user-3': '😂', 'user-4': '🔥' },
    options: ['👏', '😂', '😮', '❤️', '🔥'],
    userId: 'user-1',
    onReact: () => {},
  },
  argTypes: {
    onReact: { action: 'react' },
  },
};

export default meta;

type Story = StoryObj<typeof ReactionBar>;

export const Default: Story = {};

export const WithMyReaction: Story = {
  args: {
    reactions: { 'user-1': '❤️', 'user-2': '😂' },
  },
};

export const NoReactions: Story = {
  args: {
    reactions: {},
  },
};

export const ReadOnly: Story = {
  args: {
    onReact: undefined,
  },
};
