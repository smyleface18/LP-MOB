import { AppTheme } from '@/app/providers/theme.provider';
import { TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import type { IconName } from '@/shared/components/Icon';

export interface CategoryTypeMeta {
  icon: IconName;
  label: string;
  subtitle: string;
}

/** Ícono, label legible y subtítulo por macrodestreza — usado en las tarjetas
 * de Gestión de Categorías y en el selector de tipo de Crear Categoría. */
export const CATEGORY_TYPE_META: Record<TypeQuestionCategory, CategoryTypeMeta> = {
  [TypeQuestionCategory.LISTENING]: { icon: 'HeadphonesIcon', label: 'Listening', subtitle: 'Comprensión' },
  [TypeQuestionCategory.GRAMMAR]: { icon: 'TextAaIcon', label: 'Grammar', subtitle: 'Estructuras' },
  [TypeQuestionCategory.READING]: { icon: 'BookOpenIcon', label: 'Reading', subtitle: 'Lectura' },
  [TypeQuestionCategory.VOCABULARY]: { icon: 'TranslateIcon', label: 'Vocabulary', subtitle: 'Léxico' },
  [TypeQuestionCategory.WRITING]: { icon: 'NotePencilIcon', label: 'Writing', subtitle: 'Redacción' },
  [TypeQuestionCategory.SPEAKING]: { icon: 'MicrophoneIcon', label: 'Speaking', subtitle: 'Fluidez' },
};

/** Subtítulo descriptivo por nivel CEFR — usado en el selector de nivel de
 * Crear Categoría. */
export const LEVEL_SUBTITLE: Record<Level, string> = {
  [Level.A1]: 'Principiante',
  [Level.A2]: 'Básico',
  [Level.B1]: 'Intermedio',
  [Level.B2]: 'Avanzado',
  [Level.C1]: 'Dominio',
  [Level.C2]: 'Nativo',
};

/**
 * Asigna un color del theme a un valor de enum de forma determinística
 * (mismo índice → mismo color siempre), para no inventar una paleta de
 * colores fuera del theme. El orden de `values` (ej. `Object.values(Level)`)
 * define qué color le toca a cada valor.
 */
export const getCategoryPaletteColor = (
  theme: AppTheme,
  values: string[],
  value: string,
): string => {
  const palette = [
    theme.color.primary,
    theme.color.secondary,
    theme.color.accent,
    theme.color.success,
    theme.color.error,
    theme.color.textSecondary,
  ];
  const index = values.indexOf(value);
  return palette[index % palette.length];
};
