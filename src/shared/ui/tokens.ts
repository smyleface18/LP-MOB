import { color as semanticColor } from './theme/semantics';
import { colors as primitiveColors } from './theme/primitives';

export const colors = {
  ...primitiveColors,
  ...semanticColor,
  text: semanticColor.textPrimary,
  slate500: '#64748B',
};

export * from './theme/primitives';
export * from './theme/typography';
export * from './theme/semantics';
export * from './theme/semanticsLayout';
export * from './theme/Shadows';
export * from './theme/breakpoints';
