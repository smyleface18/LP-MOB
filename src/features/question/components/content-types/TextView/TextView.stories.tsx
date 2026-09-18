import type { Meta, StoryObj } from '@storybook/react';
import { TextView } from './TextView.component';

const meta: Meta<typeof TextView> = {
  title: 'Question/ContentTypes/TextView',
  component: TextView,
  args: {
    text: 'What is the English word for "manzana"?',
  },
};

export default meta;

type Story = StoryObj<typeof TextView>;

export const Default: Story = {};

export const LongText: Story = {
  args: {
    text: 'Choose the correct option that completes the following sentence: "By the time we arrived, the movie ___ already started."',
  },
};
