export const colors = {
  brand: {
    red: '#E7274F', //#E01C48 E01C48
    redLight: '#FEE2E2',
    redDark: '#BE123C',

    yellow: '#E69010',
    yellowLight: '#FABC22',

    orange: '#EA580C',
    orangeStrong: '#C2410C',
    orangeLight: '#FFEDD5',

    green: '#39977B',
    greenLight: '#7EDABA',
    greenExtraLight: '#ECFDF5',
  },
  neutral: {
    white: '#F8FAFC',
    gray: '#E4E1E6',
    grayLight: '#CBD5E1',
    grayStrong: '#9DA3AE',
  },
  surfaceDark: {
    base: '#1F2937',
    raised: '#374151',
    overlay2: '#1F2937',
  },
  danger: {
    base: '#E11D48',
    dark: '#9F1239',
    light: '#FFE4E6',
  },
} as const;

export const withAlpha = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const opacity = {
  disabled: 0.5, // botones, inputs, cards no interactuables
  pressed: 0.85, // feedback táctil al presionar (además del color pressed)
  overlay: 0.6, // fondo oscuro detrás de un modal/bottom sheet
  hint: 0.4, // placeholders, texto de ayuda muy secundario
} as const;

/**
 * Controla qué se dibuja encima de qué. Úsalo en la prop `style={{ zIndex }}`
 * de cualquier componente que se superponga a otros.
 * Deja espacio entre números (10 en 10) por si necesitas insertar algo
 * entre dos niveles más adelante sin renumerar todo.
 */
export const zIndex = {
  base: 0, // contenido normal de la screen
  dropdown: 10, // selects, menús desplegables
  stickyHeader: 20, // headers fijos al hacer scroll
  overlay: 30, // fondo oscuro detrás de modal/bottom sheet
  modal: 40, // el modal/bottom sheet en sí
  toast: 50, // notificaciones tipo "¡Correcto!" flotando arriba de todo
  tooltip: 60, // el nivel más alto — siempre visible
} as const;
