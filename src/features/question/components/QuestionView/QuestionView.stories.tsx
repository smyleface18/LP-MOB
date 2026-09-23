import type { Meta, StoryObj } from '@storybook/react';
import { QuestionView } from './QuestionView.component';
import { ContentType, Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const category = {
  id: 'category-1',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  level: Level.A2,
  descriptionCategory: 'Vocabulary',
  type: TypeQuestionCategory.VOCABULARY,
};

const meta: Meta<typeof QuestionView> = {
  title: 'Question/QuestionView',
  component: QuestionView,
  args: {
    question: {
      id: 'question-1',
      categoryId: category.id,
      category,
      timeLimit: 30,
      contentType: ContentType.TEXT,
      text: 'What is the English word for "manzana"?',
      options: [],
    },
    questionNumber: 3,
    totalQuestions: 10,
    timeRemaining: 20,
  },
};

export default meta;

type Story = StoryObj<typeof QuestionView>;

export const Default: Story = {};

export const TimeRunningOut: Story = {
  args: {
    timeRemaining: 8,
  },
};

export const WithoutTimer: Story = {
  args: {
    timeRemaining: undefined,
    questionNumber: undefined,
    totalQuestions: undefined,
  },
};
