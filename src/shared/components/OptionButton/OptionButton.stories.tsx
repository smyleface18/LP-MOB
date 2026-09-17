import type { Meta, StoryObj } from '@storybook/react';
import { OptionButton } from './OptionButton.component';

const meta: Meta<typeof OptionButton> = {
  title: 'Atoms/OptionButton',
  component: OptionButton,
  args: {
    option: 'The correct answer',
    variant: 'default',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'correct', 'incorrect'],
    },
    disabled: {
      control: 'boolean',
    },
    onPress: {
      action: 'pressed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof OptionButton>;

export const Default: Story = {
  args: {
    option: 'The correct answer',
    variant: 'default',
  },
};

export const Correct: Story = {
  args: {
    option: 'Correct answer',
    variant: 'correct',
  },
};

export const Incorrect: Story = {
  args: {
    option: 'Incorrect answer',
    variant: 'incorrect',
  },
};

export const Disabled: Story = {
  args: {
    option: 'Disabled option',
    variant: 'default',
    disabled: true,
  },
};
