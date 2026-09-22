import type { Meta, StoryObj } from '@storybook/react';
import { CategoryDetailView } from './CategoryDetail.view';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';

const meta: Meta<typeof CategoryDetailView> = {
  title: 'Screens/CategoryDetail',
  component: CategoryDetailView,
  args: {
    categoryId: 'category-1',
    loading: false,
    notFound: false,
    isActive: true,
    saving: false,
    formValues: {
      descriptionCategory: 'Everyday conversations and greetings',
      level: Level.B1,
      type: TypeQuestionCategory.SPEAKING,
    },
    errors: {},
    onDescriptionChange: () => {},
    onLevelChange: () => {},
    onTypeChange: () => {},
    onToggleActive: () => {},
    onDelete: () => {},
    onCancel: () => {},
    onSave: () => {},
    onGoBack: () => {},
  },
  argTypes: {
    onDescriptionChange: { action: 'description-change' },
    onLevelChange: { action: 'level-change' },
    onTypeChange: { action: 'type-change' },
    onToggleActive: { action: 'toggle-active' },
    onDelete: { action: 'delete' },
    onCancel: { action: 'cancel' },
    onSave: { action: 'save' },
    onGoBack: { action: 'go-back' },
  },
};

export default meta;

type Story = StoryObj<typeof CategoryDetailView>;

export const Default: Story = {};

export const Inactive: Story = {
  args: { isActive: false },
};

export const Saving: Story = {
  args: { saving: true },
};

export const WithValidationErrors: Story = {
  args: {
    formValues: { descriptionCategory: '', level: '', type: '' },
    errors: {
      descriptionCategory: 'Descripción requerida',
      level: 'Nivel requerido',
      type: 'Tipo requerido',
    },
  },
};

export const LoadingState: Story = {
  args: { loading: true },
};

export const NotFound: Story = {
  args: { notFound: true },
};
