import type { Meta, StoryObj } from '@storybook/react';
import QuestionCard from './QuestionCard.component';
import { Question } from '../../types';
import { ContentType, Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const category = {
  id: 'category-1',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  level: Level.B1,
  descriptionCategory: 'Grammar basics',
  type: TypeQuestionCategory.GRAMMAR,
};

const question: Question = {
  id: 'question-1',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  contentType: ContentType.TEXT,
  text: 'Which sentence uses the present perfect correctly?',
  category,
  categoryId: category.id,
  timeLimit: 30,
  options: [
    {
      id: 'opt-1',
      active: true,
      createdAt: new Date(),
      isCorrect: true,
      questionId: 'question-1',
      question: {} as any,
      contentType: ContentType.TEXT,
      text: 'She has visited Paris twice.',
    },
    {
      id: 'opt-2',
      active: true,
      createdAt: new Date(),
      isCorrect: false,
      questionId: 'question-1',
      question: {} as any,
      contentType: ContentType.TEXT,
      text: 'She have visited Paris twice.',
    },
  ],
};

const meta: Meta<typeof QuestionCard> = {
  title: 'Question/QuestionCard',
  component: QuestionCard,
  args: {
    question,
    onToggleActive: () => {},
    onDelete: () => {},
    onPress: () => {},
  },
  argTypes: {
    onToggleActive: { action: 'toggle-active' },
    onDelete: { action: 'delete' },
    onPress: { action: 'press' },
  },
};

export default meta;

type Story = StoryObj<typeof QuestionCard>;

export const Default: Story = {};

export const Inactive: Story = {
  args: {
    question: { ...question, active: false },
  },
};

export const WithoutCategory: Story = {
  args: {
    question: { ...question, category: undefined as any },
  },
};

export const WithoutOptions: Story = {
  args: {
    question: { ...question, options: [] },
  },
};

export const ImagePrompt: Story = {
  args: {
    question: {
      ...question,
      contentType: ContentType.IMAGE,
      text: undefined,
    },
  },
};
