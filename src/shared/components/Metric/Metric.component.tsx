import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface MetricCardProps {
  value: number | string;
  label: string;
  subLabel?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, subLabel, color = 'primary' }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: theme.color[color] }]}>{value}</Text>

      <Text style={styles.label}>{label}</Text>

      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      width: 150,
      backgroundColor: theme.color.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.color.border,
    },
    value: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.bodyBold,
      marginBottom: theme.spacing.xs,
    },
    label: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
  });

export { MetricCard };
