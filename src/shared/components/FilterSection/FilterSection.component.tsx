import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FilterChip } from '../FilterChip';

export interface FilterSectionProps {
  title: string;
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onValueChange: (value: string) => void;
  showAllOption?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValue,
  onValueChange,
  showAllOption = true,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chipsWrapper}>
        {showAllOption && (
          <FilterChip
            label={`Todos ${title.toLowerCase()}`}
            isActive={selectedValue === 'all'}
            onPress={() => onValueChange('all')}
          />
        )}
        {options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            isActive={selectedValue === option.value}
            onPress={() => onValueChange(option.value)}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    section: {
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    chipsWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: theme.spacing.sm,
      justifyContent: 'center',
    },
  });

export { FilterSection }