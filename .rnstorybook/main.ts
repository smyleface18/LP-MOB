import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  // Apuntaba solo a ./stories (las stories de ejemplo del template) — nunca
  // incluía las stories reales del proyecto en src/. Mismo glob que ya usa
  // .storybook/main.ts (la config web).
  stories: ['../src/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
