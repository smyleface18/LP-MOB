import type { Meta, StoryObj } from '@storybook/react';
import PanelEditor from './PanelEditor.component';

const meta: Meta<typeof PanelEditor> = {
  title: 'Story/PanelEditor',
  component: PanelEditor,
  args: {
    text: 'Max walk into the forrest to look for his friend Luna.',
    scene: 'A dark forest at night',
    characterIds: ['ch-0-0'],
    newCharacters: [],
    cast: [
      {
        id: 'ch-0-0',
        name: 'Max',
        kind: 'robot',
        description: 'small silver robot with blue eyes',
        createdBy: 'user-1',
        introducedInPanel: 0,
      },
    ],
    limits: {
      minWords: 8,
      maxChars: 320,
      maxSceneChars: 200,
      characters: {
        maxPerPanel: 3,
        maxNewPerPanel: 2,
        maxPerStory: 6,
        fields: { name: 30, kind: 30, description: 100 },
      },
    },
    lastReview: null,
    attemptsLeft: 2,
    hasDraft: false,
    isDirty: true,
    reviewing: false,
    confirming: false,
    validationError: null,
    wordCount: 11,
    timeUp: false,
    onTextChange: () => {},
    onSceneChange: () => {},
    onToggleCharacter: () => {},
    onAddCharacter: () => {},
    onRemoveCharacter: () => {},
    onSubmit: () => {},
    onConfirm: () => {},
  },
  argTypes: {
    onSubmit: { action: 'submit' },
    onConfirm: { action: 'confirm' },
  },
};

export default meta;

type Story = StoryObj<typeof PanelEditor>;

export const Writing: Story = {};

export const TooShort: Story = {
  args: {
    text: 'Max walked.',
    wordCount: 2,
    validationError: 'Write at least 8 words.',
  },
};

export const Checking: Story = {
  args: {
    reviewing: true,
  },
};

export const WithCorrections: Story = {
  args: {
    hasDraft: true,
    isDirty: false,
    attemptsLeft: 1,
    lastReview: {
      panelOrder: 1,
      flagged: false,
      reviewAvailable: true,
      attemptsLeft: 1,
      corrections: [
        {
          original: 'walk',
          suggestion: 'walked',
          type: 'grammar',
          explanation: 'La historia está en pasado: usa "walked".',
        },
        {
          original: 'forrest',
          suggestion: 'forest',
          type: 'spelling',
          explanation: '"Forest" se escribe con una sola "r".',
        },
      ],
      characterCorrections: [],
    },
  },
};

export const Perfect: Story = {
  args: {
    hasDraft: true,
    isDirty: false,
    attemptsLeft: 1,
    lastReview: {
      panelOrder: 1,
      flagged: false,
      reviewAvailable: true,
      attemptsLeft: 1,
      corrections: [],
      characterCorrections: [],
    },
  },
};

export const NoChecksLeft: Story = {
  args: {
    hasDraft: true,
    isDirty: true,
    attemptsLeft: 0,
  },
};

export const Flagged: Story = {
  args: {
    lastReview: {
      panelOrder: 1,
      flagged: true,
      reviewAvailable: true,
      attemptsLeft: 2,
      corrections: [],
      characterCorrections: [],
      message: 'Your panel has inappropriate content. Please rewrite it.',
    },
  },
};

export const ReviewUnavailable: Story = {
  args: {
    hasDraft: true,
    isDirty: false,
    lastReview: {
      panelOrder: 1,
      flagged: false,
      reviewAvailable: false,
      attemptsLeft: 2,
      corrections: [],
      characterCorrections: [],
    },
  },
};

export const TimeUp: Story = {
  args: {
    timeUp: true,
    hasDraft: true,
  },
};
