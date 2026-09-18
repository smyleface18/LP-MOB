import type { Meta, StoryObj } from '@storybook/react';
import QuestionForm from './QuestionForm.component';
import { ContentType, Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const categories = [
  {
    id: 'cat-1',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: Level.A1,
    descriptionCategory: 'Basic Vocabulary',
    type: TypeQuestionCategory.VOCABULARY,
  },
  {
    id: 'cat-2',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: Level.B1,
    descriptionCategory: 'Grammar Basics',
    type: TypeQuestionCategory.GRAMMAR,
  },
];

const meta: Meta<typeof QuestionForm> = {
  title: 'Question/QuestionForm',
  component: QuestionForm,
  args: {
    values: {
      content: { type: ContentType.TEXT, value: 'What is the English word for "manzana"?' },
      moreInfo: '',
      timeLimit: 15,
      categoryId: 'cat-1',
      options: [
        { id: 'opt-1', content: { type: ContentType.TEXT, value: 'Apple' }, isCorrect: true },
        { id: 'opt-2', content: { type: ContentType.TEXT, value: 'Orange' }, isCorrect: false },
      ],
    },
    categories,
    selectedLevel: 'all',
    selectedType: 'all',
    onLevelFilterChange: () => {},
    onTypeFilterChange: () => {},
    onContentChange: () => {},
    onMoreInfoChange: () => {},
    onTimeLimitChange: () => {},
    onCategoryChange: () => {},
    onOptionContentChange: () => {},
    onAddOption: () => {},
    onRemoveOption: () => {},
    onSetCorrectOption: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof QuestionForm>;

export const Default: Story = {};

export const NoCorrectAnswerYet: Story = {
  args: {
    values: {
      content: { type: ContentType.TEXT, value: '' },
      moreInfo: '',
      timeLimit: 5,
      categoryId: '',
      options: [
        { content: { type: ContentType.TEXT, value: '' }, isCorrect: false },
        { content: { type: ContentType.TEXT, value: '' }, isCorrect: false },
      ],
    },
  },
};

export const ImageQuestion: Story = {
  args: {
    values: {
      content: { type: ContentType.IMAGE, value: 'https://picsum.photos/seed/linguaplay/600/400' },
      moreInfo: 'Look closely at the picture.',
      timeLimit: 20,
      categoryId: 'cat-1',
      options: [
        { id: 'opt-1', content: { type: ContentType.TEXT, value: 'Apple' }, isCorrect: true },
        { id: 'opt-2', content: { type: ContentType.TEXT, value: 'Orange' }, isCorrect: false },
      ],
    },
  },
};

export const NoMatchingCategories: Story = {
  args: {
    selectedLevel: Level.C2,
  },
};
