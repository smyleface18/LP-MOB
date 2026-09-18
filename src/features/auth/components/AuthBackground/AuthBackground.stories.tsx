import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import AuthBackground from './AuthBackground.component';

const meta: Meta<typeof AuthBackground> = {
  title: 'Auth/AuthBackground',
  component: AuthBackground,
  decorators: [
    (Story) => (
      <View style={{ width: 375, height: 500, position: 'relative' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AuthBackground>;

export const Default: Story = {};
