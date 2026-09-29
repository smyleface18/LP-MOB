import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Meta, StoryObj } from '@storybook/react';
import { createMockTabBarProps } from '../mockTabBarProps';
import { TabBarMobile } from './TabBarMobile';

const PLAYER_ROUTES = ['Arena', 'Explorar', 'Perfil'];

const DEVICE_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 200 },
  insets: { top: 0, left: 0, right: 0, bottom: 24 },
};

const meta: Meta<typeof TabBarMobile> = {
  title: 'Navigation/TabBarMobile',
  component: TabBarMobile,
  decorators: [
    (Story) => (
      <SafeAreaProvider initialMetrics={DEVICE_METRICS}>
        <View style={{ width: 390 }}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TabBarMobile>;

export const ArenaActive: Story = {
  args: createMockTabBarProps(PLAYER_ROUTES, PLAYER_ROUTES.indexOf('Arena')),
};

export const ExplorarActive: Story = {
  args: createMockTabBarProps(PLAYER_ROUTES, PLAYER_ROUTES.indexOf('Explorar')),
};

export const PerfilActive: Story = {
  args: createMockTabBarProps(PLAYER_ROUTES, PLAYER_ROUTES.indexOf('Perfil')),
};
