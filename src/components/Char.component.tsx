import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CircularChartProps {
  percentage: number;
  label: string;
  color?: string;
}

const CircularChart: React.FC<CircularChartProps> = ({ 
  percentage, 
  label, 
  color = '#FF0000' 
}) => (
  <View style={styles.container}>
    <View style={[styles.circle, { borderColor: color }]}>
      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  label: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default CircularChart;