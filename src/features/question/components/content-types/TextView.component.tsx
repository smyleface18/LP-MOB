import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TextViewProps {
  text: string;
}

export const TextView: React.FC<TextViewProps> = ({ text }) => {
  return <Text style={styles.text}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 24,
    textAlign: 'center',
  },
});
