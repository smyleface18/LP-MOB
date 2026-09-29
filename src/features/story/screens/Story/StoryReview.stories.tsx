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
    onBack: () => {},
  },
  argTypes: {
    onReact: { action: 'react' },
    onNewStory: { action: 'new-story' },
    onBack: { action: 'back' },
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

export const MediaFailed: Story = {
  args: {
    manifest: {
      ...MOCK_MANIFEST,
      panels: MOCK_MANIFEST.panels.map((panel) => ({
        ...panel,
        mediaStatus: 'failed' as const,
        audioUrl: null,
        imageUrl: null,
        speechMarks: null,
      })),
    },
  },
};

/** Como se ve desde "My stories": sin reacciones nuevas ni historieta nueva. */
export const FromHistory: Story = {
  args: {
    title: 'Read it again!',
    onReact: undefined,
    onNewStory: undefined,
    backLabel: 'Back to my stories',
  },
};
