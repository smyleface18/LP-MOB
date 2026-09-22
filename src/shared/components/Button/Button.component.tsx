import { useTheme } from '@/app/providers/theme.provider';
import { maxContentWidth } from '@/shared/ui/tokens';
import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Icon, IconName } from '@/shared/components/Icon';

/** Tamaño de ícono proporcional al tamaño del botón, mismo criterio que ya
 * usan las pantallas de categorías (icon size chico con texto chico, etc.). */
const ICON_SIZE_BY_BUTTON_SIZE = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
} as const;

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'outlinedSecondary';
  title: string;
  size?: 'small' | 'medium' | 'large';
  /** Ícono de phosphor-react-native a mostrar antes del título. */
  icon?: IconName;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  title,
  size = 'medium',
  icon,
  style,
  disabled,
  ...props
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const variantStyle: Record<
    NonNullable<ButtonProps['variant']>,
    { container: ViewStyle; text: TextStyle }
  > = {
    primary: {
      container: { backgroundColor: theme.color.primary },
      text: { color: theme.color.onPrimary },
    },
    secondary: {
      container: { backgroundColor: theme.color.secondary },
      text: { color: theme.color.textInverse },
    },
    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.color.primary,
      },
      text: { color: theme.color.primary },
    },
    outlinedSecondary: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.color.secondaryButton,
      },
      text: { color: theme.color.textPrimary },
    },
  };

  const sizeStyle: Record<
    NonNullable<ButtonProps['size']>,
    { container: ViewStyle; text: TextStyle }
  > = {
    small: {
      container: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
      text: { fontSize: theme.fontSize.sm },
    },
    medium: {
      container: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
      text: { fontSize: theme.fontSize.lg },
    },
    large: {
      container: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl },
      text: { fontSize: theme.fontSize.xl },
    },
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        variantStyle[variant].container,
        sizeStyle[size].container,
        disabled && { opacity: theme.opacity.disabled },
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {icon && (
          <Icon
            name={icon}
            size={ICON_SIZE_BY_BUTTON_SIZE[size]}
            color={variantStyle[variant].text.color as string}
          />
        )}
        <Text style={[styles.buttonText, variantStyle[variant].text, sizeStyle[size].text]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    button: {
      borderRadius: theme.layout.buttonRadius,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      maxWidth: maxContentWidth,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    buttonText: {
      fontFamily: theme.fontFamily.heading,
    },
  });

export default Button;
