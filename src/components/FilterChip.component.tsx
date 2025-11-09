import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.chip, isActive && styles.chipActive]}
    onPress={onPress}
  >
    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  chipText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});

export default FilterChip;