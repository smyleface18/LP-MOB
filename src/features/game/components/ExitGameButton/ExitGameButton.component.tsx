import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon } from '@/shared/components/Icon';

export interface ExitGameButtonProps {
  onPress: () => void;
  /** Default: theme.color.textPrimary — pasar theme.color.onSecondary (u
   * otro) cuando el fondo detrás del botón no sea la superficie normal. */
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** Botón circular para salir de la partida/sala — sin posición ni fondo
 * propios, así el que lo usa decide dónde y sobre qué fondo va (hoy: la
 * esquina superior derecha de GameHeader). */
export const ExitGameButton: React.FC<ExitGameButtonProps> = ({ onPress, color, style }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Icon name="XIcon" size="md" color={color ?? theme.color.textPrimary} />
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    button: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ExitGameButton;
