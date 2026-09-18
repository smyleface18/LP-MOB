import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-native-web-vite",
  // expo-modules-core ships .ts "ambient declaration" files (global.ts importing
  // types as values) that Vite's dependency optimizer fails to bundle. Excluding
  // it skips eager pre-bundling so it's transformed per-file on demand instead.
  viteFinal: async (viteConfig) => {
    viteConfig.optimizeDeps = {
      ...viteConfig.optimizeDeps,
      exclude: [...(viteConfig.optimizeDeps?.exclude ?? []), 'expo-modules-core'],
    };
    return viteConfig;
  },
};
export default config;