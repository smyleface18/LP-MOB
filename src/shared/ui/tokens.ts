export const colors = {
  primary: '#FF0000',
  secondary: '#18181B',
  background: '#FFFFFF',
  surface: '#F8F8F8',
  text: {
    primary: '#000000',
    secondary: '#666666',
    hint: '#999999',
    inverse: '#FFFFFF',
  },
  border: {
    default: '#000000',
    light: '#E0E0E0',
    error: '#FF0000',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#FF0000',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const fontSize = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
} as const;