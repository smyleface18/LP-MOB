import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface OptionButtonProps extends TouchableOpacityProps {
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
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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
      style={[styles.button, getButtonStyle(), disabled && styles.disabledButton, style]}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, getTextStyle()]}>{option}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    button: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
    },

    defaultButton: {
      backgroundColor: theme.color.surface,
      borderColor: theme.color.border,
    },

    correctButton: {
      backgroundColor: theme.color.success,
      borderColor: theme.color.success,
    },

    incorrectButton: {
      backgroundColor: theme.color.error,
      borderColor: theme.color.error,
    },

    disabledButton: {
      opacity: 0.6,
    },

    text: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      textAlign: 'center',
    },

    defaultText: {
      color: theme.color.textPrimary,
    },

    correctText: {
      color: theme.color.onSuccess,
    },

    incorrectText: {
      color: theme.color.onError,
    },
  });

export { OptionButton };
