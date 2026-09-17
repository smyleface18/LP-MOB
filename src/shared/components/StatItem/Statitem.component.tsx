import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface StatItemProps {
  value: number | string;
  label: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}

const StatItem: React.FC<StatItemProps> = ({ value, label, color = 'primary' }) => {
  const theme = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color: theme.color[color] }]}>{value}</Text>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
    },

    value: {
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },

    label: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
  });

export { StatItem };
