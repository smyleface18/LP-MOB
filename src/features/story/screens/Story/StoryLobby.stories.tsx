import type { Meta, StoryObj } from '@storybook/react';
import StoryLobbyView from './StoryLobby.view';
import { MOCK_LOBBY, MOCK_RULES } from './Story.mocks';

const meta: Meta<typeof StoryLobbyView> = {
  title: 'Screens/StoryLobby',
  component: StoryLobbyView,
  args: {
    lobby: MOCK_LOBBY,
    userId: 'user-1',
    isHost: true,
    rules: MOCK_RULES,
    pending: null,
    onUpdateConfig: () => {},
    onKick: () => {},
    onStart: () => {},
    onLeave: () => {},
  },
  argTypes: {
    onUpdateConfig: { action: 'update-config' },
    onKick: { action: 'kick' },
    onStart: { action: 'start' },
    onLeave: { action: 'leave' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryLobbyView>;

export const Host: Story = {};

export const Guest: Story = {
  args: {
    userId: 'user-2',
    isHost: false,
  },
};

export const WaitingForPlayers: Story = {
  args: {
    lobby: { ...MOCK_LOBBY, players: [MOCK_LOBBY.players[0]] },
  },
};

export const NotEnoughPanels: Story = {
  args: {
    lobby: {
      ...MOCK_LOBBY,
      config: { ...MOCK_LOBBY.config, panelsCount: 4 },
      players: [
        ...MOCK_LOBBY.players,
        { userId: 'user-4', username: 'Diego', avatarUrl: null, connected: true, left: false },
        { userId: 'user-5', username: 'Ana', avatarUrl: null, connected: true, left: false },
      ],
    },
  },
};

export const Starting: Story = {
  args: {
    pending: 'start',
  },
};
