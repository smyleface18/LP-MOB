import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ContentEditor, { ContentEditorProps } from './ContentEditor.component';
import { ContentType } from '@/shared/types/common';

const meta: Meta<typeof ContentEditor> = {
  title: 'Question/ContentEditor',
  component: ContentEditor,
  args: {
    label: 'Question Content',
    value: { contentType: ContentType.TEXT, text: 'What is the English word for "manzana"?' },
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
    value: { contentType: ContentType.IMAGE, text: 'https://picsum.photos/seed/linguaplay/600/400' },
  },
};

export const Empty: Story = {
  render: Interactive,
  args: {
    value: { contentType: ContentType.TEXT, text: '' },
  },
};
