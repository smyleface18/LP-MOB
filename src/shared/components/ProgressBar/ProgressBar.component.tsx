import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GradientColors,
  GRADIENT_PRESETS,
  warnIfOutOfHierarchyOrder,
} from '@/shared/ui/theme/progressGradients';

export interface ProgressBarProps {
  percentage: number;
  label: string;
  /** Colores del gradiente de relleno, en orden (2 o más tokens de
   * theme.color). Ver GRADIENT_PRESETS para combinaciones listas, o pasa tu
   * propio array para una combinación custom. */
  colors?: GradientColors;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  colors = GRADIENT_PRESETS.secondaryToPrimary,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  warnIfOutOfHierarchyOrder(colors);

  const resolvedColors = useMemo(
    () => colors.map((key) => theme.color[key]) as [string, string, ...string[]],
    [colors, theme],
  );

  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.barBackground}>
        <View style={[styles.barFillWrapper, { width: `${normalizedPercentage}%` }]}>
          <LinearGradient
            colors={resolvedColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      </View>

      <Text style={styles.percentage}>{normalizedPercentage}%</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    barBackground: {
      height: 8,
      backgroundColor: theme.color.border,
      borderRadius: theme.radius.sm,
      marginBottom: theme.spacing.xs,
      overflow: 'hidden',
    },
    barFillWrapper: {
      height: '100%',
      overflow: 'hidden',
      borderRadius: theme.radius.sm,
    },
    percentage: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      textAlign: 'right',
    },
  });

export { ProgressBar };
