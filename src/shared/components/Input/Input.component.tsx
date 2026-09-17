import React, { useMemo } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';

export interface InputProps extends TextInputProps {
  variant?: 'default' | 'outlined';
  error?: boolean;
}

const Input: React.FC<InputProps> = ({ variant = 'default', error = false, style, ...props }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TextInput
      style={[
        styles.input,
        variant === 'outlined' && styles.inputOutlined,
        error && styles.inputError,
        style,
      ]}
      placeholderTextColor={theme.color.textPlaceholder}
      {...props}
    />
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    input: {
      width: '100%',
      height: 50,
      backgroundColor: theme.color.surface,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.color.textPrimary,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputOutlined: {
      borderWidth: 1,
      borderColor: theme.color.border,
    },
    inputError: {
      borderWidth: 1,
      borderColor: theme.color.error,
    },
  });

export default React.memo(Input);
