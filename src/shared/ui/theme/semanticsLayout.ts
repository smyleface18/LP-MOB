import { radius, spacing } from "./primitives";


export const layout = {
    screenPadding: spacing.lg,

    cardPadding: spacing.md,
    cardGap: spacing.sm,
    cardRadius: radius.lg,

    buttonPaddingX: spacing.lg,
    buttonPaddingY: spacing.sm,
    buttonRadius: radius.full,

    inputPaddingX: spacing.md,
    inputPaddingY: spacing.sm,
    inputRadius: radius.md,

    sectionGap: spacing.xl,
} as const;