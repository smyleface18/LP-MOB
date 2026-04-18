import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  percentage: number;
  label: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  label, 
  color = '#FF0000' 
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.barBackground}>
      <View 
        style={[
          styles.barFill, 
          { width: `${percentage}%`, backgroundColor: color }
        ]} 
      />
    </View>
    <Text style={styles.percentage}>{percentage}%</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 5,
  },
  barBackground: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 5,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
});

export default ProgressBar;