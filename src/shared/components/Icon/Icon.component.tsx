import React from 'react';
import type { IconWeight, IconProps as PhosphorIconProps } from 'phosphor-react-native';
import { useTheme, AppTheme } from '@/app/providers/theme.provider';
import { iconRegistry, IconName } from './icon-registry';

export type { IconName };

export interface IconProps
  extends Omit<PhosphorIconProps, 'color' | 'size' | 'weight' | 'duotoneColor'> {
  name: IconName;
  /** Key de `theme.iconSize` (sm/md/lg/xl) o un número explícito en px. */
  size?: keyof AppTheme['iconSize'] | number;
  /**
   * Reglas de uso (ver también README.md en esta carpeta):
   * - "regular": default para navegación/UI.
   * - "bold" | "fill": estados activos/seleccionados.
   * - "duotone": EXCLUSIVO para gamificación (racha, trofeos, XP, logros).
   *   No mezclar weights distintos para el mismo elemento sin razón.
   */
  weight?: IconWeight;
  /** Default: theme.color.textPrimary. */
  color?: string;
  /**
   * Color de acento del trazo duotone. Solo aplica con weight="duotone".
   * Default: theme.color.accent (amarillo de marca) — no usar otro color
   * para íconos de gamificación.
   */
  accentColor?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  weight = 'regular',
  color,
  accentColor,
  ...props
}) => {
  const theme = useTheme();
  const PhosphorIcon = iconRegistry[name];

  return (
    <PhosphorIcon
      size={typeof size === 'number' ? size : theme.iconSize[size]}
      weight={weight}
      color={color ?? theme.color.textPrimary}
      duotoneColor={accentColor ?? theme.color.accent}
      {...props}
    />
  );
};

export default Icon;
