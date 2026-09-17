import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface ProgressBarProps {
  percentage: number;
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'accent';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, label, color = 'primary' }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${normalizedPercentage}%`,
              backgroundColor: theme.color[color],
            },
          ]}
        />
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

    barFill: {
      height: '100%',
      borderRadius: theme.radius.sm,
    },

    percentage: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      textAlign: 'right',
    },
  });

export { ProgressBar };
