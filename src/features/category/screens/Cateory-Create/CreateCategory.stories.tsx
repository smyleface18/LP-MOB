import type { Meta, StoryObj } from '@storybook/react';
import { CreateCategoryView } from './CreateCategory.view';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';

const meta: Meta<typeof CreateCategoryView> = {
  title: 'Screens/CreateCategory',
  component: CreateCategoryView,
  args: {
    description: '',
    level: '',
    type: '',
    errors: {},
    submitting: false,
    onDescriptionChange: () => {},
    onLevelChange: () => {},
    onTypeChange: () => {},
    onSubmit: () => {},
    onClear: () => {},
    onCancel: () => {},
  },
  argTypes: {
    onDescriptionChange: { action: 'description-change' },
    onLevelChange: { action: 'level-change' },
    onTypeChange: { action: 'type-change' },
    onSubmit: { action: 'submit' },
    onClear: { action: 'clear' },
    onCancel: { action: 'cancel' },
  },
};

export default meta;

type Story = StoryObj<typeof CreateCategoryView>;

export const Empty: Story = {};

export const Filled: Story = {
  args: {
    description: 'Modismos coloquiales del día a día en reuniones corporativas',
    level: Level.B1,
    type: TypeQuestionCategory.VOCABULARY,
  },
};

export const Submitting: Story = {
  args: {
    description: 'Modismos coloquiales del día a día en reuniones corporativas',
    level: Level.B1,
    type: TypeQuestionCategory.VOCABULARY,
    submitting: true,
  },
};

export const WithValidationErrors: Story = {
  args: {
    description: 'Muy corta',
    errors: {
      descriptionCategory: 'Mínimo 10 caracteres',
      level: 'Selecciona un nivel CEFR',
      type: 'Selecciona un tipo de pregunta',
    },
  },
};
