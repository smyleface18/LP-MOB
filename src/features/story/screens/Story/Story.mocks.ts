import { Level } from '@/shared/types/common';
import {
  ReviewManifest,
  SpeechMark,
  StoryCharacter,
  StoryLobby,
  StoryPanelSummary,
  StoryRules,
  StoryStatus,
} from '../../types';

/** Datos de ejemplo para las stories de las vistas del modo Historieta. */

/** Speech marks como las de Polly: una por palabra, cada 350 ms. */
export const speechMarksFor = (text: string): SpeechMark[] => {
  const marks: SpeechMark[] = [];
  const words = /[A-Za-z']+/g;
  let match: RegExpExecArray | null;
  while ((match = words.exec(text))) {
    marks.push({
      time: marks.length * 350,
      start: match.index,
      end: match.index + match[0].length,
      value: match[0],
    });
  }
  return marks;
};

export const MOCK_RULES: StoryRules = {
  players: { min: 1, max: 6 },
  config: {
    panelsCount: { min: 4, max: 10 },
    turnDurationsSec: [60, 90, 120, 180],
    levels: [Level.A1, Level.A2, Level.B1, Level.B2],
    languages: ['en-US'],
    defaults: {
      panelsCount: 6,
      turnDurationSec: 90,
      level: Level.A2,
      language: 'en-US',
      shareDrafts: true,
    },
  },
  draft: {
    minWords: 8,
    maxChars: 320,
    maxSceneChars: 200,
    maxReviewAttempts: 2,
    maxDraftsPerTurn: 5,
  },
  characters: {
    maxPerStory: 6,
    maxPerPanel: 3,
    maxNewPerPanel: 2,
    limits: { name: 30, kind: 30, description: 100 },
  },
  reactions: ['👏', '😂', '😮', '❤️', '🔥'],
};

export const MOCK_LOBBY: StoryLobby = {
  gameId: 'car_tree_green',
  status: StoryStatus.LOBBY,
  hostId: 'user-1',
  config: MOCK_RULES.config.defaults,
  players: [
    { userId: 'user-1', username: 'Fernanda', avatarUrl: null, connected: true, left: false },
    {
      userId: 'user-2',
      username: 'Carlos',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      connected: true,
      left: false,
    },
    { userId: 'user-3', username: 'Lucía', avatarUrl: null, connected: false, left: false },
  ],
};

export const MOCK_CAST: StoryCharacter[] = [
  {
    id: 'ch-0-0',
    name: 'Max',
    kind: 'robot',
    description: 'small silver robot with blue eyes',
    createdBy: 'user-1',
    introducedInPanel: 0,
  },
  {
    id: 'ch-1-0',
    name: 'Luna',
    kind: 'cat',
    description: 'black cat with a white spot on her nose',
    createdBy: 'user-2',
    introducedInPanel: 1,
  },
];

export const MOCK_STORY_SO_FAR: StoryPanelSummary[] = [
  {
    order: 0,
    authorId: 'user-1',
    finalText: 'Max the little robot woke up alone in an old workshop full of dusty tools.',
    scene: 'An old workshop at dawn',
    characterIds: ['ch-0-0'],
    reactions: { 'user-2': '😮', 'user-3': '❤️' },
  },
  {
    order: 1,
    authorId: 'user-2',
    finalText: 'Suddenly, a black cat called Luna jumped through the window and looked at him.',
    scene: 'The workshop window',
    characterIds: ['ch-0-0', 'ch-1-0'],
    reactions: { 'user-1': '😂' },
  },
];

export const MOCK_MANIFEST: ReviewManifest = {
  storyId: 'car_tree_green',
  title: 'The Missing Key',
  gameId: 'car_tree_green',
  characters: MOCK_CAST,
  ranking: [
    {
      userId: 'user-2',
      name: 'Carlos',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      panelsWritten: 2,
      totalScore: 290,
      averageScore: 145,
    },
    {
      userId: 'user-1',
      name: 'Fernanda',
      avatarUrl: null,
      panelsWritten: 2,
      totalScore: 230,
      averageScore: 115,
    },
    {
      userId: 'user-3',
      name: 'Lucía',
      avatarUrl: null,
      panelsWritten: 2,
      totalScore: 120,
      averageScore: 60,
    },
  ],
  panels: [
    {
      order: 0,
      author: { id: 'user-1', name: 'Fernanda' },
      originalText: 'Max the little robot wake up alone in a old workshop full of dusty tools.',
      finalText: 'Max the little robot woke up alone in an old workshop full of dusty tools.',
      scene: 'An old workshop at dawn',
      characterIds: ['ch-0-0'],
      corrections: [
        {
          original: 'wake',
          suggestion: 'woke',
          type: 'grammar',
          explanation: 'La historia está en pasado: "wake" pasa a "woke".',
        },
        {
          original: 'a old',
          suggestion: 'an old',
          type: 'grammar',
          explanation: 'Antes de un sonido vocal se usa "an".',
        },
      ],
      score: {
        accuracy: 57,
        firstTryBonus: 0,
        selfCorrectionBonus: 25,
        timeoutPenalty: false,
        total: 82,
      },
      reactions: { 'user-2': '😮', 'user-3': '❤️' },
      audioUrl: 'https://example.com/story/panel-0.mp3',
      speechMarks: speechMarksFor(
        'Max the little robot woke up alone in an old workshop full of dusty tools.',
      ),
      imageUrl: 'https://picsum.photos/seed/linguaplay-workshop/1024/768',
      mediaStatus: 'ready',
    },
    {
      order: 1,
      author: { id: 'user-2', name: 'Carlos' },
      originalText:
        'Suddenly, a black cat called Luna jumped through the window and looked at him.',
      finalText: 'Suddenly, a black cat called Luna jumped through the window and looked at him.',
      scene: 'The workshop window',
      characterIds: ['ch-0-0', 'ch-1-0'],
      corrections: [],
      score: {
        accuracy: 100,
        firstTryBonus: 50,
        selfCorrectionBonus: 0,
        timeoutPenalty: false,
        total: 150,
      },
      reactions: { 'user-1': '😂' },
      // Sigue en la cola: llega por `panelMediaReady`.
      audioUrl: null,
      speechMarks: null,
      imageUrl: null,
      mediaStatus: 'pending',
    },
  ],
};
