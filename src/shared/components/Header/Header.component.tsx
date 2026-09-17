import { useTheme } from '@/app/providers/theme.provider';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  /**
   * 'default': fondo neutro (surface). Úsalo en pantallas internas,
   * listados, configuración — donde el foco es el contenido.
   * 'brand': fondo con tinte de marca (primarySubtle). Úsalo en
   * pantallas de entrada/bienvenida, home, o donde quieras transmitir
   * la energía de la marca desde el primer vistazo.
   */
  variant?: 'default' | 'brand';
  leading?: React.ReactNode; // slot para botón de volver, ícono
  trailing?: React.ReactNode; // slot para avatar, settings, acción
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  headerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  variant = 'default',
  leading,
  trailing,
  titleStyle,
  subtitleStyle,
  headerStyle,
  containerStyle,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.header, variant === 'brand' && styles.headerBrand, headerStyle]}>
      <View style={styles.row}>
        {leading ? <View style={styles.accessory}>{leading}</View> : null}

        <View style={[styles.container, containerStyle]}>
          <Text style={[styles.title, titleStyle]} numberOfLines={2} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {trailing ? <View style={styles.accessory}>{trailing}</View> : null}
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    header: {
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      backgroundColor: theme.color.surface,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
    },
    headerBrand: {
      backgroundColor: theme.color.primarySubtle,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    accessory: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      gap: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.color.textPrimary,
    },
    subtitle: {
      fontSize: 16,
      color: theme.color.textSecondary,
    },
  });

export default React.memo(Header);
