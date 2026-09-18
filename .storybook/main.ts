import type { StorybookConfig } from '@storybook/react-native-web-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
    viteConfig.resolve = {
      ...viteConfig.resolve,
      // expo-audio/expo-video (incluso sus variantes .web.js) importan
      // `useEvent` desde el paquete `expo`, que reexporta el EventEmitter real
      // de expo-modules-core — una clase que lee `globalThis.expo`, un global
      // que solo instala el runtime nativo/Metro y que nunca existe en un
      // navegador. Esta versión de expo-modules-core no tiene variante web
      // para esa clase, así que no es arreglable con resolve.extensions: se
      // mockean por completo solo para Storybook (ver .storybook/mocks/). No
      // afecta al build real de la app.
      alias: {
        ...viteConfig.resolve?.alias,
        'expo-audio': path.resolve(dirname, 'mocks/expo-audio.ts'),
        'expo-video': path.resolve(dirname, 'mocks/expo-video.tsx'),
      },
      // Metro prefiere automáticamente *.web.js sobre *.js para cualquier
      // paquete nativo de Expo. Vite no replica ese comportamiento por
      // defecto para node_modules, así que sin esto carga la implementación
      // nativa (que también depende de globalThis.expo) en vez de la
      // variante web que esos paquetes sí traen.
      extensions: [
        '.web.mjs',
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        ...(viteConfig.resolve?.extensions ?? [
          '.mjs',
          '.js',
          '.mts',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ]),
      ],
    };
    return viteConfig;
  },
};
export default config;