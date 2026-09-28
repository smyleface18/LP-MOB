import type { Meta, StoryObj } from '@storybook/react';
import StoryReviewView from './StoryReview.view';
import { MOCK_MANIFEST, MOCK_RULES } from './Story.mocks';

const meta: Meta<typeof StoryReviewView> = {
  title: 'Screens/StoryReview',
  component: StoryReviewView,
  args: {
    manifest: MOCK_MANIFEST,
    userId: 'user-1',
    reactionOptions: MOCK_RULES.reactions,
    creating: false,
    onReact: () => {},
    onNewStory: () => {},
    onBackToMenu: () => {},
  },
  argTypes: {
    onReact: { action: 'react' },
    onNewStory: { action: 'new-story' },
    onBackToMenu: { action: 'back-to-menu' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryReviewView>;

export const Default: Story = {};

export const Winner: Story = {
  args: {
    userId: 'user-2',
  },
};

export const WithoutCharacters: Story = {
  args: {
    manifest: {
      ...MOCK_MANIFEST,
      characters: [],
      panels: MOCK_MANIFEST.panels.map((panel) => ({ ...panel, characterIds: [] })),
    },
  },
};
