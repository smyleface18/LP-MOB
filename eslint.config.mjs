// eslint.config.ts
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tsEslint from '@typescript-eslint/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig({
  // Ignorar carpetas y archivos
  ignores: [
    'eslint.config.mjs',
    '**/*.js',
    'node_modules/**',
    '.expo/**',
    'dist/**',
    'build/**',
    'android/**',
    'ios/**',
  ],

  // Configuración de lenguaje y globals
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
    globals: {
      ...globals.node,            // Node.js globals
      ...globals.jest,            // Jest globals
      __DEV__: 'readonly',        // Expo / React Native development flag
      requireNativeComponent: 'readonly', // React Native native components
      global: 'writable',         // Espacio para variables globales propias
      ExpoConstants: 'readonly',  // Expo configuration
    },
  },

  // Plugins
  plugins: {
    react: pluginReact,
    'react-native': pluginReactNative,
    'react-hooks': pluginReactHooks,
    '@typescript-eslint': tsEslint,
    prettier: eslintPluginPrettierRecommended,
  },

  // Configuración de React
  settings: {
    react: { version: 'detect' },
  },

  // Reglas generales para todo el proyecto
  rules: {
    // React
    'react/react-in-jsx-scope': 'off', // No necesario con React 17+
    'react/prop-types': 'off',         // Usamos TypeScript para props
    'react/display-name': 'off',

    'prettier/prettier': 'error',

    // React Native
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': ['warn', { skip: ['Button', 'Text'] }],

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', disallowTypeAnnotations: true },
    ],
  },

  // Overrides por tipo de archivo
  overrides: [
    // Archivos de prueba
    {
      files: ['**/*.{test,spec}.{js,ts,jsx,tsx}', '**/__tests__/**/*'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },

    // Archivos DTO
    {
      files: ['**/*.dto.ts', '**/*.dto.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },

    // Archivos de constantes
    {
      files: ['**/*.constant.ts', '**/constants/**/*'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },

    // Archivos de tipos
    {
      files: ['**/*.type.ts', '**/types/**/*'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      },
    },

    // Archivos React / React Native
    {
      files: ['**/*.{jsx,tsx}'],
      rules: {
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
});