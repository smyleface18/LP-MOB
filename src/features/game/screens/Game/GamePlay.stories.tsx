import type { Meta, StoryObj } from '@storybook/react';
import GamePlay from './GamePlay.view';
import { QuestionDto } from '@/features/question/types';
import { ContentType, Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const baseCategory = {
  id: 'category-1',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  level: Level.A2,
  descriptionCategory: 'Vocabulary',
  type: TypeQuestionCategory.VOCABULARY,
};

const question: QuestionDto = {
  id: 'question-1',
  categoryId: baseCategory.id,
  category: baseCategory,
  timeLimit: 30,
  content: { type: ContentType.TEXT, value: 'What is the English word for "manzana"?' },
  options: [
    { id: 'opt-1', content: { type: ContentType.TEXT, value: 'Apple' } },
    { id: 'opt-2', content: { type: ContentType.TEXT, value: 'Orange' } },
    { id: 'opt-3', content: { type: ContentType.TEXT, value: 'Banana' } },
    { id: 'opt-4', content: { type: ContentType.TEXT, value: 'Grape' } },
  ],
};

const meta: Meta<typeof GamePlay> = {
  title: 'Screens/GamePlay',
  component: GamePlay,
  args: {
    currentQuestion: question,
    questionNumber: 3,
    totalQuestions: 10,
    timeRemaining: 20,
    score: 240,
    onOptionPress: () => {},
    onModalClose: () => {},
    showResult: false,
    isCorrect: false,
    correctAnswer: ['Apple'],
    selectedOption: null,
  },
  argTypes: {
    onOptionPress: { action: 'option-pressed' },
    onModalClose: { action: 'modal-closed' },
  },
};

export default meta;

type Story = StoryObj<typeof GamePlay>;

export const Default: Story = {};

export const TimeRunningOut: Story = {
  args: {
    timeRemaining: 8,
  },
};

export const CorrectAnswerSelected: Story = {
  args: {
    selectedOption: 'opt-1',
    isCorrect: true,
    showResult: true,
  },
};

export const IncorrectAnswerSelected: Story = {
  args: {
    selectedOption: 'opt-2',
    isCorrect: false,
    showResult: true,
  },
};

export const LoadingNextQuestion: Story = {
  args: {
    currentQuestion: null,
  },
};
