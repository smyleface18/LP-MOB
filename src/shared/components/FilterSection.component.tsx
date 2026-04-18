import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import FilterChip from './FilterChip.component';

interface FilterSectionProps {
  title: string;
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValue,
  onValueChange,
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      <FilterChip
        label={`Todos ${title.toLowerCase()}`}
        isActive={selectedValue === 'all'}
        onPress={() => onValueChange('all')}
      />
      {options.map(option => (
        <FilterChip
          key={option.value}
          label={option.label}
          isActive={selectedValue === option.value}
          onPress={() => onValueChange(option.value)}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  scrollView: {
    flexDirection: 'row',
  },
});

export default FilterSection;