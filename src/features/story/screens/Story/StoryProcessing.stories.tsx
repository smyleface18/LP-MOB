import type { Meta, StoryObj } from '@storybook/react';
import StoryProcessingView from './StoryProcessing.view';

const meta: Meta<typeof StoryProcessingView> = {
  title: 'Screens/StoryProcessing',
  component: StoryProcessingView,
  args: {
    processing: { gameId: 'car_tree_green', panelsTotal: 6, panelsDone: 2 },
  },
};

export default meta;

type Story = StoryObj<typeof StoryProcessingView>;

export const InProgress: Story = {};

export const Starting: Story = {
  args: { processing: null },
};

export const AlmostDone: Story = {
  args: { processing: { gameId: 'car_tree_green', panelsTotal: 6, panelsDone: 5 } },
};
