// src/shared/ui/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radius, fontSize } from './tokens';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], styles[size], style as ViewStyle]}
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`] as TextStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  // variants
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  // sizes
  small: { height: 40 },
  medium: { height: 50 },
  large: { height: 60 },
  // text
  text: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  primaryText: { color: colors.text.inverse },
  secondaryText: { color: colors.text.inverse },
  outlinedText: { color: colors.primary },
});