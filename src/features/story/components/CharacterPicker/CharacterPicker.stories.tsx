import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CharacterPicker, { CharacterPickerProps } from './CharacterPicker.component';
import { CharacterSheet } from '../../types';

const LIMITS = {
  maxPerPanel: 3,
  maxNewPerPanel: 2,
  maxPerStory: 6,
  fields: { name: 30, kind: 30, description: 100 },
};

const CAST = [
  {
    id: 'ch-0-0',
    name: 'Max',
    kind: 'robot',
    description: 'small silver robot with blue eyes',
    createdBy: 'user-1',
    introducedInPanel: 0,
  },
  {
    id: 'ch-0-1',
    name: 'Luna',
    kind: 'cat',
    description: 'black cat with a white spot',
    createdBy: 'user-1',
    introducedInPanel: 0,
  },
];

/** Con estado propio para poder elegir y crear personajes en Storybook. */
const Interactive = (props: CharacterPickerProps) => {
  const [selectedIds, setSelectedIds] = useState(props.selectedIds);
  const [newCharacters, setNewCharacters] = useState<CharacterSheet[]>(props.newCharacters);
  return (
    <CharacterPicker
      {...props}
      selectedIds={selectedIds}
      newCharacters={newCharacters}
      onToggle={(id) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
      }
      onAddNew={(character) => setNewCharacters((prev) => [...prev, character])}
      onRemoveNew={(index) => setNewCharacters((prev) => prev.filter((_, i) => i !== index))}
    />
  );
};

const meta: Meta<typeof CharacterPicker> = {
  title: 'Story/CharacterPicker',
  component: CharacterPicker,
  render: (args) => <Interactive {...args} />,
  args: {
    cast: CAST,
    selectedIds: ['ch-0-0'],
    newCharacters: [],
    limits: LIMITS,
    onToggle: () => {},
    onAddNew: () => {},
    onRemoveNew: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof CharacterPicker>;

export const Default: Story = {};

export const EmptyCast: Story = {
  args: {
    cast: [],
    selectedIds: [],
  },
};

export const WithNewCharacter: Story = {
  args: {
    newCharacters: [{ name: 'Rex', kind: 'dinosaur', description: 'tiny green dinosaur' }],
  },
};

export const PanelFull: Story = {
  args: {
    selectedIds: ['ch-0-0', 'ch-0-1'],
    newCharacters: [{ name: 'Rex', kind: 'dinosaur', description: 'tiny green dinosaur' }],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
