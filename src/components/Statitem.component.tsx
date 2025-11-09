import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatItemProps {
  value: number | string;
  label: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ 
  value, 
  label, 
  color = '#FF0000' 
}) => (
  <View style={styles.container}>
    <Text style={[styles.value, { color }]}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default StatItem;