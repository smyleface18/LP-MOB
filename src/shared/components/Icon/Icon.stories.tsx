import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Icon } from './Icon.component';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'HouseIcon' },
};

export const Weights: Story = {
  args: { name: 'HeartIcon' },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Icon name="HeartIcon" weight="thin" />
      <Icon name="HeartIcon" weight="light" />
      <Icon name="HeartIcon" weight="regular" />
      <Icon name="HeartIcon" weight="bold" />
      <Icon name="HeartIcon" weight="fill" />
    </View>
  ),
};

export const Duotone: Story = {
  args: { name: 'TrophyIcon', weight: 'duotone', size: 'xl' },
};
