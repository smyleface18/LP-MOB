import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react-native-web-vite';
import { ThemeProvider } from '@/app/providers/theme.provider';
import { useUiActions } from '@/store';

const ThemeSync = ({ theme, children }: { theme: 'light' | 'dark'; children: React.ReactNode }) => {
  const { setTheme } = useUiActions();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return <>{children}</>;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Tema global de la app',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider>
        <ThemeSync theme={context.globals.theme}>
          <Story />
        </ThemeSync>
      </ThemeProvider>
    ),
  ],
};

export default preview;
