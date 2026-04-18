// components/OptionButton.component.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface OptionButtonProps extends TouchableOpacityProps {
  option: string;
  variant?: 'default' | 'correct' | 'incorrect';
  disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ 
  option, 
  variant = 'default',
  disabled = false,
  style,
  ...props 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'correct':
        return styles.correctButton;
      case 'incorrect':
        return styles.incorrectButton;
      default:
        return styles.defaultButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'correct':
        return styles.correctText;
      case 'incorrect':
        return styles.incorrectText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style
      ]}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, getTextStyle()]}>
        {option}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  defaultButton: {
    backgroundColor: '#667eea',
  },
  correctButton: {
    backgroundColor: '#10b981',
  },
  incorrectButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  defaultText: {
    color: '#FFFFFF',
  },
  correctText: {
    color: '#FFFFFF',
  },
  incorrectText: {
    color: '#FFFFFF',
  },
});

export default OptionButton;