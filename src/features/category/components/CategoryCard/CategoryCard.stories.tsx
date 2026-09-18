import type { Meta, StoryObj } from '@storybook/react';
import CategoryCard from './CategoryCard.component';
import { CategoryQuestion } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const category: CategoryQuestion = {
  id: 'category-1',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  level: Level.B1,
  descriptionCategory: 'Everyday conversations and greetings',
  type: TypeQuestionCategory.SPEAKING,
  questions: [{} as any, {} as any, {} as any],
};

const meta: Meta<typeof CategoryCard> = {
  title: 'Category/CategoryCard',
  component: CategoryCard,
  args: {
    category,
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

type Story = StoryObj<typeof CategoryCard>;

export const Default: Story = {};

export const Inactive: Story = {
  args: {
    category: { ...category, active: false },
  },
};

export const NoQuestionsYet: Story = {
  args: {
    category: { ...category, questions: [] },
  },
};
