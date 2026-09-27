import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon } from '@/shared/components/Icon';

export interface RefreshButtonProps {
  onPress: () => void;
  /** Mientras está en true muestra un spinner y no acepta toques. */
  refreshing?: boolean;
  /** Color del ícono y del spinner. Default: theme.color.textPrimary. */
  color?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Botón redondo para volver a pedir los datos de una pantalla. Complementa el
 * pull-to-refresh (que en web no existe y en mobile no todos descubren).
 */
const RefreshButton: React.FC<RefreshButtonProps> = ({
  onPress,
  refreshing = false,
  color,
  accessibilityLabel = 'Actualizar',
  style,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const tint = color ?? theme.color.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: refreshing, disabled: refreshing }}
      onPress={onPress}
      disabled={refreshing}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {refreshing ? (
        <ActivityIndicator size="small" color={tint} />
      ) : (
        <Icon name="ArrowClockwiseIcon" size="sm" weight="bold" color={tint} />
      )}
    </Pressable>
  );
};

const SIZE = 40;

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    button: {
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.surfaceElevated,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    pressed: {
      opacity: 0.7,
    },
  });

export default RefreshButton;
