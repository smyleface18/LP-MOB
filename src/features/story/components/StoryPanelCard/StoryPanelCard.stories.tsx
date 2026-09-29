import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StoryPanelCard from './StoryPanelCard.component';
import CorrectionList from '../CorrectionList';

const meta: Meta<typeof StoryPanelCard> = {
  title: 'Story/StoryPanelCard',
  component: StoryPanelCard,
  args: {
    order: 0,
    authorName: 'Fernanda',
    scene: 'A dark forest at night',
    text: 'Max the little robot walked into the forest, looking for his lost friend.',
    characterNames: ['Max', 'Luna'],
    reactions: { 'user-2': '😂', 'user-3': '🔥' },
    reactionOptions: ['👏', '😂', '😮', '❤️', '🔥'],
    userId: 'user-1',
    onReact: () => {},
  },
  argTypes: {
    onReact: { action: 'react' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryPanelCard>;

export const Default: Story = {};

export const WithScore: Story = {
  args: {
    score: 150,
  },
};

export const SharedDraft: Story = {
  args: {
    variant: 'draft',
    text: 'Max walk into the forrest.',
    reactions: undefined,
    children: (
      <CorrectionList
        corrections={[
          {
            original: 'walk',
            suggestion: 'walked',
            type: 'grammar',
            explanation: 'La historia está en pasado: usa "walked".',
          },
        ]}
      />
    ),
  },
};

export const WithImage: Story = {
  args: {
    imageUrl: 'https://picsum.photos/seed/linguaplay-robot/1024/768',
    score: 150,
  },
};

export const WithoutCharacters: Story = {
  args: {
    characterNames: [],
    scene: 'An empty beach at sunrise',
    text: 'The waves were quiet and the sky was turning orange over the sea.',
  },
};
