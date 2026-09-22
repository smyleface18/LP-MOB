import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ExitGameButton } from './ExitGameButton.component';

const meta: Meta<typeof ExitGameButton> = {
  title: 'Game/ExitGameButton',
  component: ExitGameButton,
  args: {
    onPress: () => {},
  },
  argTypes: {
    onPress: { action: 'press' },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ExitGameButton>;

export const Default: Story = {};

/** Como se usa en GameHeader: color claro + fondo translúcido sobre una
 * superficie oscura. */
export const OnDarkHeader: Story = {
  args: { color: '#FFFFFF' },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start', backgroundColor: '#1F2937' }}>
        <Story />
      </View>
    ),
  ],
  render: (args) => <ExitGameButton {...args} style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />,
};
