import type { Meta, StoryObj } from '@storybook/react';
import StoryTurnView from './StoryTurn.view';
import { MOCK_CAST, MOCK_LOBBY, MOCK_RULES, MOCK_STORY_SO_FAR } from './Story.mocks';

const noop = () => {};

const EDITOR = {
  text: 'Max and Luna walk to the forrest to find the missing key.',
  scene: 'A dark forest at night',
  characterIds: ['ch-0-0', 'ch-1-0'],
  newCharacters: [],
  cast: MOCK_CAST,
  limits: {
    minWords: MOCK_RULES.draft.minWords,
    maxChars: MOCK_RULES.draft.maxChars,
    maxSceneChars: MOCK_RULES.draft.maxSceneChars,
    characters: {
      maxPerPanel: MOCK_RULES.characters.maxPerPanel,
      maxNewPerPanel: MOCK_RULES.characters.maxNewPerPanel,
      maxPerStory: MOCK_RULES.characters.maxPerStory,
      fields: MOCK_RULES.characters.limits,
    },
  },
  onTextChange: noop,
  onSceneChange: noop,
  onToggleCharacter: noop,
  onAddCharacter: noop,
  onRemoveCharacter: noop,
  lastReview: null,
  attemptsLeft: 2,
  hasDraft: false,
  isDirty: true,
  reviewing: false,
  confirming: false,
  validationError: null,
  wordCount: 11,
  timeUp: false,
  onSubmit: noop,
  onConfirm: noop,
};

const meta: Meta<typeof StoryTurnView> = {
  title: 'Screens/StoryTurn',
  component: StoryTurnView,
  args: {
    turn: { panelOrder: 2, authorId: 'user-1', endsAt: 0, authorStatus: 'writing' },
    panelsCount: 6,
    turnDurationSec: 90,
    timeLeft: 64,
    isAuthor: true,
    author: MOCK_LOBBY.players[0],
    players: MOCK_LOBBY.players,
    storySoFar: MOCK_STORY_SO_FAR,
    cast: MOCK_CAST,
    userId: 'user-1',
    reactionOptions: MOCK_RULES.reactions,
    onReact: noop,
    sharedDraft: null,
    shareDrafts: true,
    lastConfirmed: null,
    editor: EDITOR,
  },
  argTypes: {
    onReact: { action: 'react' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryTurnView>;

export const MyTurn: Story = {};

export const MyTurnWithCorrections: Story = {
  args: {
    editor: {
      ...EDITOR,
      hasDraft: true,
      isDirty: false,
      attemptsLeft: 1,
      lastReview: {
        panelOrder: 2,
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
  },
};

export const WatchingAuthor: Story = {
  args: {
    turn: { panelOrder: 2, authorId: 'user-2', endsAt: 0, authorStatus: 'reviewing' },
    isAuthor: false,
    author: MOCK_LOBBY.players[1],
    editor: null,
  },
};

export const WatchingSharedDraft: Story = {
  args: {
    turn: { panelOrder: 2, authorId: 'user-2', endsAt: 0, authorStatus: 'correcting' },
    isAuthor: false,
    author: MOCK_LOBBY.players[1],
    editor: null,
    timeLeft: 12,
    sharedDraft: {
      order: 2,
      authorId: 'user-2',
      text: 'Max and Luna walk to the forrest to find the missing key.',
      scene: 'A dark forest at night',
      characterIds: ['ch-0-0', 'ch-1-0'],
      newCharacters: [{ name: 'Owl', kind: 'bird', description: 'old grey owl with glasses' }],
      reviewAvailable: true,
      corrections: [
        {
          original: 'walk',
          suggestion: 'walked',
          type: 'grammar',
          explanation: 'La historia está en pasado: usa "walked".',
        },
      ],
      characterCorrections: [],
    },
  },
};

export const PanelJustConfirmed: Story = {
  args: {
    turn: null,
    editor: null,
    lastConfirmed: {
      order: 1,
      authorId: 'user-2',
      finalText: MOCK_STORY_SO_FAR[1].finalText,
      scene: MOCK_STORY_SO_FAR[1].scene,
      characterIds: MOCK_STORY_SO_FAR[1].characterIds,
      newCharacters: [],
      score: {
        accuracy: 100,
        firstTryBonus: 50,
        selfCorrectionBonus: 0,
        timeoutPenalty: false,
        total: 150,
      },
      confirmedBy: 'player',
    },
  },
};

export const FirstPanel: Story = {
  args: {
    turn: { panelOrder: 0, authorId: 'user-1', endsAt: 0, authorStatus: 'writing' },
    storySoFar: [],
    cast: [],
    editor: { ...EDITOR, text: '', scene: '', characterIds: [], cast: [], wordCount: 0 },
  },
};
