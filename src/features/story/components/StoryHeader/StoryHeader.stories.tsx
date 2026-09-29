import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StoryHeader, { StoryHeaderChip } from './StoryHeader.component';

const meta: Meta<typeof StoryHeader> = {
  title: 'Story/StoryHeader',
  component: StoryHeader,
  args: {
    title: '📖 Story Mode',
    onBack: () => {},
  },
  argTypes: {
    onBack: { action: 'back' },
    onExit: { action: 'exit' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryHeader>;

export const WithBack: Story = {};

export const InGame: Story = {
  args: {
    onBack: undefined,
    onExit: () => {},
    children: (
      <>
        <StoryHeaderChip label="Connected" dotColor="#2BB673" />
        <StoryHeaderChip label="car_tree_green" />
        <StoryHeaderChip label="Score: 230" />
      </>
    ),
  },
};

export const History: Story = {
  args: {
    title: '📚 My stories',
  },
};
