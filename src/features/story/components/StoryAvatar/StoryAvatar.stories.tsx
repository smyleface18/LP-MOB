import type { Meta, StoryObj } from '@storybook/react';
import StoryAvatar from './StoryAvatar.component';

const meta: Meta<typeof StoryAvatar> = {
  title: 'Story/StoryAvatar',
  component: StoryAvatar,
  args: {
    name: 'Fernanda Gómez',
    avatarUrl: null,
    size: 44,
  },
};

export default meta;

type Story = StoryObj<typeof StoryAvatar>;

export const Initials: Story = {};

export const WithImage: Story = {
  args: {
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
  },
};

export const BrokenImage: Story = {
  args: {
    avatarUrl: 'https://example.invalid/expired-avatar.png',
  },
};

export const Small: Story = {
  args: {
    size: 28,
  },
};
