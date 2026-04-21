export const colors = {
  brand: {
    red: '#FF0000',
    redDark: '#CC0000',
    black: '#000000',
    charcoal: '#18181B',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F8F8F8',
    gray100: '#F4F4F5',
    gray150: '#F0F0F0',
    gray300: '#E0E0E0',
    gray500: '#999999',
    gray600: '#666666',
    gray700: '#333333',
    slate200: '#e2e8f0',
    slate300: '#cbd5e1',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate800: '#1e293b',
  },
  accent: {
    indigo: '#667eea',
    indigoDark: '#4338ca',
    indigoSoft: '#e0e7ff',
    amber: '#f59e0b',
    amberSoft: '#fef3c7',
  },
  feedback: {
    success: {
      background: '#d1fae5',
      border: '#86efac',
      text: '#047857',
    },
    error: {
      background: '#fee2e2',
      border: '#fecaca',
      text: '#dc2626',
    },
  },
  overlay: {
    scrim50: 'rgba(0, 0, 0, 0.5)',
    scrim70: 'rgba(0, 0, 0, 0.7)',
  },
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
    subtle: '#e2e8f0',
    error: '#FF0000',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#FF0000',
    online: '#10b981',
    offline: '#ef4444',
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
