import React from 'react';
import type { Preview } from '@storybook/react-native-web-vite';
import { ThemeProvider } from '@/app/providers/theme.provider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;