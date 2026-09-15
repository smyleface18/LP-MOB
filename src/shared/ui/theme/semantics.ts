import { colors } from './primitives';



export const color = {
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

    // Estados de feedback
    success: colors.brand.green,
    warning: colors.brand.orange,
    error: colors.brand.redDark,

    // Gamificación (streaks, logros)
    accent: colors.brand.yellow,

    // Bordes/divisores
    border: colors.neutral.gray,
} as const;