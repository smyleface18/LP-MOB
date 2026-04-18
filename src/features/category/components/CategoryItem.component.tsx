import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CategoryItemProps {
  color: string;
  text: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ color, text }) => (
  <View style={styles.container}>
    <View style={[styles.color, { backgroundColor: color }]} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  color: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    color: '#000000',
  },
});

export default CategoryItem;