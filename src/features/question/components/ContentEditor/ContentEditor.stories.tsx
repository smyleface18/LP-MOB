import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ContentEditor, { ContentEditorProps } from './ContentEditor.component';
import { ContentType, MediaStatus } from '@/shared/types/common';

const meta: Meta<typeof ContentEditor> = {
  title: 'Question/ContentEditor',
  component: ContentEditor,
  args: {
    label: 'Content Type',
    value: { contentType: ContentType.TEXT },
    onChange: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof ContentEditor>;

const Interactive = (args: ContentEditorProps) => {
  const [value, setValue] = useState(args.value);
  return <ContentEditor {...args} value={value} onChange={setValue} />;
};

export const Text: Story = {
  render: Interactive,
};

export const Image: Story = {
  render: Interactive,
  args: {
    value: {
      contentType: ContentType.IMAGE,
      mediaId: 'story-media-1',
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
  },
};

export const Empty: Story = {
  render: Interactive,
  args: {
    value: { contentType: ContentType.IMAGE },
  },
};
