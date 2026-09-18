import type { Meta, StoryObj } from '@storybook/react';
import { AudioView } from './AudioView.component';

const meta: Meta<typeof AudioView> = {
  title: 'Question/ContentTypes/AudioView',
  component: AudioView,
  args: {
    url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a',
  },
};

export default meta;

type Story = StoryObj<typeof AudioView>;

export const Default: Story = {};
