import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { TabBarWeb } from './TabBarWeb';
import { createMockTabBarProps } from '../mockTabBarProps';

const PLAYER_ROUTES = ['Dashboard', 'Arena', 'Ranking', 'Perfil'];
const ADMIN_ROUTES = ['Dashboard', 'Arena', 'Ranking', 'Perfil', 'Categorias', 'Preguntas'];

const meta: Meta<typeof TabBarWeb> = {
  title: 'Navigation/TabBarWeb',
  component: TabBarWeb,
  decorators: [
    (Story) => (
      <View style={{ height: 600 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TabBarWeb>;

export const DashboardActive: Story = {
  args: createMockTabBarProps(PLAYER_ROUTES, PLAYER_ROUTES.indexOf('Dashboard')),
};

export const ArenaActive: Story = {
  args: createMockTabBarProps(PLAYER_ROUTES, PLAYER_ROUTES.indexOf('Arena')),
};

export const RankingActive: Story = {
  args: createMockTabBarProps(PLAYER_ROUTES, PLAYER_ROUTES.indexOf('Ranking')),
};

export const PerfilActive: Story = {
  args: createMockTabBarProps(PLAYER_ROUTES, PLAYER_ROUTES.indexOf('Perfil')),
};

export const AdminWithCategoriasActive: Story = {
  args: createMockTabBarProps(ADMIN_ROUTES, ADMIN_ROUTES.indexOf('Categorias')),
};

export const AdminWithPreguntasActive: Story = {
  args: createMockTabBarProps(ADMIN_ROUTES, ADMIN_ROUTES.indexOf('Preguntas')),
};
