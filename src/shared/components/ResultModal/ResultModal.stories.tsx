import type { Meta, StoryObj } from '@storybook/react';
import { ResultModal } from './ResultModal.component';

const meta: Meta<typeof ResultModal> = {
  title: 'Atoms/ResultModal',
  component: ResultModal,
  args: {
    visible: true,
    isCorrect: true,
    correctAnswer: ['Hello'],
    timeRemaining: 5000,
    onClose: () => {},
  },
  argTypes: {
    visible: {
      control: 'boolean',
    },
    isCorrect: {
      control: 'boolean',
    },
    timeRemaining: {
      control: {
        type: 'number',
        min: 0,
        step: 500,
      },
    },
    onClose: {
      action: 'closed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ResultModal>;

export const Correct: Story = {
  args: {
    visible: true,
    isCorrect: true,
    correctAnswer: ['Hello'],
  },
};

export const Incorrect: Story = {
  args: {
    visible: true,
    isCorrect: false,
    correctAnswer: ['Hello', 'Hi'],
  },
};

export const MultipleCorrectAnswers: Story = {
  args: {
    visible: true,
    isCorrect: false,
    correctAnswer: ['Hello', 'Hi', 'Good morning'],
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
};
