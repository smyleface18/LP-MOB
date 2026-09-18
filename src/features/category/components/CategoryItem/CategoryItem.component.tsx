import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface CategoryItemProps {
  color: string;
  text: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ color, text }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    dot: {
      width: theme.iconSize.sm,
      height: theme.iconSize.sm,
      borderRadius: theme.radius.full,
      marginRight: theme.spacing.sm,
    },
    text: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textPrimary,
    },
  });

export default CategoryItem;
