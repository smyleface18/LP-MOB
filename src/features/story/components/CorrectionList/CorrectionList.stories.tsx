import type { Meta, StoryObj } from '@storybook/react';
import CorrectionList from './CorrectionList.component';

const meta: Meta<typeof CorrectionList> = {
  title: 'Story/CorrectionList',
  component: CorrectionList,
  args: {
    corrections: [
      {
        original: 'walk',
        suggestion: 'walked',
        type: 'grammar',
        explanation: 'La historia está en pasado: usa "walked" en lugar de "walk".',
      },
      {
        original: 'forrest',
        suggestion: 'forest',
        type: 'spelling',
        explanation: '"Forest" se escribe con una sola "r".',
      },
    ],
    emptyText: 'Perfect! No mistakes.',
  },
};

export default meta;

type Story = StoryObj<typeof CorrectionList>;

export const Default: Story = {};

export const WithCharacterCorrections: Story = {
  args: {
    newCharacterNames: ['Max'],
    characterCorrections: [
      {
        characterIndex: 0,
        field: 'description',
        original: 'a dog very small',
        suggestion: 'a very small dog',
        explanation: 'En inglés el adjetivo va antes del sustantivo.',
      },
    ],
  },
};

export const NoMistakes: Story = {
  args: {
    corrections: [],
  },
};
