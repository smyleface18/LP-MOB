import { breakpoints, maxContentWidth } from './theme/breakpoints';
import { iconSize, opacity, radius, spacing, zIndex } from './theme/primitives';
import { color } from './theme/semantics';
import { layout } from './theme/semanticsLayout';
import { shadow } from './theme/Shadows';
import { fontFamily, fontSize, fontWeight, lineHeight } from './theme/typography';

export { default as Button } from '@/shared/components/Button.component';
export { default as Input } from '@/shared/components/Input.component';

export { default as FilterSection } from '@/shared/components/FilterSection.component';





export const theme = {
    color,
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
} as const;


export type Theme = typeof theme;