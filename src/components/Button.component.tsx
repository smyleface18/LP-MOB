import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outlined';
  title: string;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  title,
  size = 'medium',
  style,
  ...props 
}) => {
  // Función para obtener estilos basados en variant y size
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = styles.button;
    const variantStyle = styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles];
    const sizeStyle = styles[`buttonSize${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles];
    
    return [baseStyle, variantStyle as ViewStyle, sizeStyle as ViewStyle];
  };

  const getTextStyle = (): TextStyle => {
    return styles[`buttonText${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles] as TextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      {...props}
    >
      <Text style={[styles.buttonText, getTextStyle()]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#FF0000',
  },
  buttonSecondary: {
    backgroundColor: '#000000',
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  buttonSizeSmall: {
    height: 40,
  },
  buttonSizeMedium: {
    height: 50,
  },
  buttonSizeLarge: {
    height: 60,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
  buttonTextOutlined: {
    color: '#FF0000',
  },
});

export default Button;