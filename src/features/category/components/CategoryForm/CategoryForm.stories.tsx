import type { Meta, StoryObj } from '@storybook/react';
import CategoryForm from './CategoryForm.component';
import { Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const meta: Meta<typeof CategoryForm> = {
  title: 'Category/CategoryForm',
  component: CategoryForm,
  args: {
    values: {
      descriptionCategory: 'Everyday conversations and greetings',
      level: Level.B1,
      type: TypeQuestionCategory.SPEAKING,
    },
    onDescriptionChange: () => {},
    onLevelChange: () => {},
    onTypeChange: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof CategoryForm>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    values: { descriptionCategory: '', level: '', type: '' },
  },
};

export const WithErrors: Story = {
  args: {
    values: { descriptionCategory: 'short', level: '', type: '' },
    errors: {
      descriptionCategory: 'Min 10 characters',
      level: 'Level is required',
      type: 'Type is required',
    },
  },
};
