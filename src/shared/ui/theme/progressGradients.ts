/** Jerarquía de intensidad para los gradientes de progreso, ordenada de menor
 * a mayor énfasis visual. ProgressBar y CircularProgress solo aceptan
 * colores de esta lista (no cualquier token de ColorTheme): así evitamos
 * combinaciones sin sentido semántico (ej. `error` o `textPrimary` en una
 * barra de XP) y garantizamos que todo gradiente vaya de "menos" a "más"
 * dentro de la misma escala, nunca al revés. */
export const PROGRESS_COLOR_HIERARCHY = [
  'secondarySubtle', // 0 - más sutil
  'accentSubtle', // 1
  'secondary', // 2
  'successSubtle', // 3
  'accent', // 4 - gamificación (racha, XP, logros)
  'success', // 5 - estado de éxito/finalización
  'primarySubtle', // 6
  'primary', // 7 - máximo énfasis de marca
] as const;

export type ProgressColorToken = (typeof PROGRESS_COLOR_HIERARCHY)[number];

/** Lista ordenada de 2 o más tokens que forman un gradiente. Con 2 se
 * interpola entre extremos; con 3+ se agregan paradas intermedias
 * distribuidas parejo (transición de 3+ colores). */
export type GradientColors = readonly [ProgressColorToken, ProgressColorToken, ...ProgressColorToken[]];

const hierarchyIndex = (token: ProgressColorToken) => PROGRESS_COLOR_HIERARCHY.indexOf(token);

/** Solo en desarrollo: avisa por consola si los colores no van de menor a
 * mayor jerarquía (nunca lanza, no afecta producción). Sirve para detectar
 * gradientes "al revés" (ej. primary -> accent) al momento de escribirlos. */
export function warnIfOutOfHierarchyOrder(colors: GradientColors): void {
  if (typeof __DEV__ !== 'undefined' && !__DEV__) {
    for (let i = 1; i < colors.length; i++) {
      if (hierarchyIndex(colors[i]) < hierarchyIndex(colors[i - 1])) {
        console.warn(
          `[progressGradients] "${colors[i]}" tiene menor jerarquía que "${colors[i - 1]}". ` +
            `Un gradiente de progreso debería ir de menor a mayor énfasis: ${colors.join(' → ')}.`,
        );
        break;
      }
    }
  }
}

/** Combinaciones listas para usar en ProgressBar / CircularProgress, todas
 * ordenadas de menor a mayor jerarquía. Un padre también puede pasar su
 * propio array de `GradientColors` (respetando el mismo orden) en vez de
 * uno de estos presets. */
export const GRADIENT_PRESETS = {
  secondaryToAccent: ['secondarySubtle', 'accent'],
  secondaryToPrimary: ['secondarySubtle', 'primary'],
  accentToPrimary: ['accent', 'primary'],
  successToPrimary: ['success', 'primary'],
  /** Transición de 3 colores: tibio -> logro -> marca. */
  tricolorEnergy: ['secondarySubtle', 'accent', 'primary'],
  /** Transición de 3 colores: logro -> éxito -> marca. */
  tricolorProgress: ['accent', 'success', 'primary'],
} as const satisfies Record<string, GradientColors>;

export type GradientPresetName = keyof typeof GRADIENT_PRESETS;
