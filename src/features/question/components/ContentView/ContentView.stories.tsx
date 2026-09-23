import type { Meta, StoryObj } from '@storybook/react';
import { ContentView } from './ContentView.component';
import { ContentType, MediaStatus } from '@/shared/types/common';

const meta: Meta<typeof ContentView> = {
  title: 'Question/ContentView',
  component: ContentView,
};

export default meta;

type Story = StoryObj<typeof ContentView>;

export const Text: Story = {
  args: {
    contentType: ContentType.TEXT,
    text: 'What is the English word for "manzana"?',
  },
};

export const Image: Story = {
  args: {
    contentType: ContentType.IMAGE,
    media: {
      id: 'story-media-1',
      active: true,
      createdAt: new Date(),
      key: 'story/preview.jpg',
      bucketName: 'story',
      contentType: ContentType.IMAGE,
      status: MediaStatus.CONFIRMED,
      url: 'https://picsum.photos/seed/linguaplay/600/400',
    },
  },
};

export const Unsupported: Story = {
  args: {
    contentType: 'UNKNOWN' as ContentType,
  },
};
