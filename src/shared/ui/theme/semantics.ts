import { colors } from './primitives';

export const lightColors = {
  // Fondo general de las screens vs. superficie de cards/inputs
  background: colors.neutral.white,
  surface: colors.brand.green,

  // Texto
  textPrimary: colors.brand.black,
  textSecondary: colors.neutral.gray,
  textInverse: colors.neutral.white,

  // Marca / acción
  primary: colors.brand.red,
  primaryPressed: colors.brand.redDark,
  secondary: colors.brand.black,
  secondaryPressed: '#27272A',

  // Estados de feedback
  success: colors.brand.green,
  warning: colors.brand.orange,
  error: colors.brand.redDark,

  // Gamificación (streaks, logros)
  accent: colors.brand.yellow,

  // Bordes/divisores
  border: colors.neutral.gray,
} as const;

export const darkColors = {
  // Fondo general de las screens vs. superficie de cards/inputs
  background: colors.brand.black,
  surface: '#27272A',

  // Texto
  textPrimary: colors.neutral.white,
  textSecondary: colors.neutral.gray,
  textInverse: colors.brand.black,

  // Marca / acción
  primary: colors.brand.red,
  primaryPressed: colors.brand.redDark,
  secondary: colors.neutral.white,
  secondaryPressed: '#3F3F46',

  // Estados de feedback
  success: colors.brand.green,
  warning: colors.brand.orange,
  error: colors.brand.redDark,

  // Gamificación (streaks, logros)
  accent: colors.brand.yellow,

  // Bordes/divisores
  border: '#3F3F46',
} as const;

export const color = lightColors;

export type ColorTheme = Record<keyof typeof lightColors, string>;