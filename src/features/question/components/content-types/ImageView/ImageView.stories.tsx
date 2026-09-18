import type { Meta, StoryObj } from '@storybook/react';
import { ImageView } from './ImageView.component';

const meta: Meta<typeof ImageView> = {
  title: 'Question/ContentTypes/ImageView',
  component: ImageView,
  args: {
    url: 'https://picsum.photos/seed/linguaplay/600/400',
  },
};

export default meta;

type Story = StoryObj<typeof ImageView>;

export const Default: Story = {};
