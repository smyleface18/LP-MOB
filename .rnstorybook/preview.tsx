import React from 'react';
import type { Preview } from '@storybook/react-native';
import { ThemeProvider } from '@/app/providers/theme.provider';


const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
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

