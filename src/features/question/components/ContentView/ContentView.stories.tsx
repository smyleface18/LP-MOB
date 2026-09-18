import type { Meta, StoryObj } from '@storybook/react';
import { ContentView } from './ContentView.component';
import { ContentType } from '@/shared/types/common';

const meta: Meta<typeof ContentView> = {
  title: 'Question/ContentView',
  component: ContentView,
};

export default meta;

type Story = StoryObj<typeof ContentView>;

export const Text: Story = {
  args: {
    content: { type: ContentType.TEXT, value: 'What is the English word for "manzana"?' },
  },
};

export const Image: Story = {
  args: {
    content: { type: ContentType.IMAGE, value: 'https://picsum.photos/seed/linguaplay/600/400' },
  },
};

export const Unsupported: Story = {
  args: {
    content: { type: 'UNKNOWN' as ContentType, value: '' },
  },
};
