import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'outlined';
  error?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  variant = 'default',
  error = false,
  style,
  ...props 
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        variant === 'outlined' && styles.inputOutlined,
        error && styles.inputError,
        style
      ]}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  inputOutlined: {
    borderWidth: 1,
    borderColor: '#000000',
  },
  inputError: {
    borderColor: '#FF0000',
  },
});

export default Input;