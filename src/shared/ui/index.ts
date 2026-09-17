import { borderWidth } from './theme/borderwidth';
import { breakpoints, maxContentWidth } from './theme/breakpoints';
import { iconSize, opacity, radius, spacing, zIndex } from './theme/primitives';
import { layout } from './theme/semanticsLayout';
import { shadow } from './theme/Shadows';
import { fontFamily, fontSize, fontWeight, lineHeight } from './theme/typography';
import { darkColors, lightColors } from './tokens';

export const theme = {
  darkColors,
  lightColors,
  layout,
  spacing,
  radius,
  fontSize,
  lineHeight,
  fontWeight,
  fontFamily,
  shadow,
  breakpoints,
  maxContentWidth,
  iconSize,
  opacity,
  zIndex,
  borderWidth,
} as const;

export type Theme = typeof theme;
