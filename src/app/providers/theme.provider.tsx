import React, { createContext, useContext, useMemo } from 'react';
import { useUiActions, useUiState } from '@/store';
import { spacing, radius, iconSize, opacity, zIndex } from '@/shared/ui/theme/primitives';
import { lightColors, darkColors, ColorTheme } from '@/shared/ui/theme/semantics';
import { layout } from '@/shared/ui/theme/semanticsLayout';
import { fontSize, lineHeight, fontWeight, fontFamily } from '@/shared/ui/theme/typography';
import { shadow } from '@/shared/ui/theme/Shadows';
import { breakpoints, maxContentWidth } from '@/shared/ui/theme/breakpoints';
import { borderWidth } from '@/shared/ui/theme/borderwidth';
import { easing } from '@/shared/ui/theme/easing';
import { duration } from '@/shared/ui/theme/duration';

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;

  // Semantics
  color: ColorTheme;
  layout: typeof layout;

  // Primitives
  spacing: typeof spacing;
  radius: typeof radius;
  iconSize: typeof iconSize;
  opacity: typeof opacity;
  zIndex: typeof zIndex;
  borderWidth: typeof borderWidth;

  // Typography
  fontSize: typeof fontSize;
  lineHeight: typeof lineHeight;
  fontWeight: typeof fontWeight;
  fontFamily: typeof fontFamily;

  // Visuals & Layout
  shadow: typeof shadow;
  breakpoints: typeof breakpoints;
  maxContentWidth: typeof maxContentWidth;

  //animation
  easing: typeof easing;
  duration: typeof duration;
}

const buildTheme = (
  mode: ThemeMode,
  toggleTheme: () => void = () => {},
  setTheme: (m: ThemeMode) => void = () => {},
): AppTheme => {
  const isDark = mode === 'dark';
  const activeColor = isDark ? darkColors : lightColors;

  return {
    mode,
    theme: mode,
    isDark,
    toggleTheme,
    setTheme,
    color: activeColor,
    layout,
    spacing,
    radius,
    iconSize,
    opacity,
    zIndex,
    borderWidth,
    fontSize,
    lineHeight,
    fontWeight,
    fontFamily,
    shadow,
    breakpoints,
    maxContentWidth,
    easing,
    duration,
  };
};

const ThemeContext = createContext<AppTheme | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: mode } = useUiState();
  const { setTheme } = useUiActions();

  const toggleTheme = () => {
    setTheme(mode === 'light' ? 'dark' : 'light');
  };

  const value = useMemo(() => buildTheme(mode, toggleTheme, setTheme), [mode, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  const context = useContext(ThemeContext);
  if (!context) {
    return buildTheme('light');
  }
  return context;
}
