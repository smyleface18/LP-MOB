import type { Meta, StoryObj } from '@storybook/react';
import CategoryItem from './CategoryItem.component';

const meta: Meta<typeof CategoryItem> = {
  title: 'Category/CategoryItem',
  component: CategoryItem,
  args: {
    color: '#DC2626',
    text: 'Vocabulary (35%)',
  },
};

export default meta;

type Story = StoryObj<typeof CategoryItem>;

export const Default: Story = {};
