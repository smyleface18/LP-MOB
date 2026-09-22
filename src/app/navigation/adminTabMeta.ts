import type { IconName } from '@/shared/components/Icon';

/**
 * Tabs que solo existen en el sidebar web para el rol ADMIN (ver
 * MainTabs.web.tsx). TabBarWeb usa esto para renderizar genéricamente
 * cualquier ruta admin que aparezca en `state.routes` sin tener que
 * hardcodear cada una — a diferencia de los 4 tabs base, que sí se
 * hardcodean porque su orden/ícono/label difieren entre mobile y web.
 */
export const ADMIN_TAB_META: Record<string, { label: string; icon: IconName }> = {
  Categorias: { label: 'Categorías', icon: 'TagIcon' },
  Preguntas: { label: 'Preguntas', icon: 'QuestionIcon' },
};
