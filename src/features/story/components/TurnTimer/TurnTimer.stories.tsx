import type { Meta, StoryObj } from '@storybook/react';
import TurnTimer from './TurnTimer.component';

const meta: Meta<typeof TurnTimer> = {
  title: 'Story/TurnTimer',
  component: TurnTimer,
  args: {
    secondsLeft: 72,
    totalSeconds: 90,
  },
};

export default meta;

type Story = StoryObj<typeof TurnTimer>;

export const Default: Story = {};

export const RunningOut: Story = {
  args: {
    secondsLeft: 9,
  },
};

export const TimeUp: Story = {
  args: {
    secondsLeft: 0,
  },
};
