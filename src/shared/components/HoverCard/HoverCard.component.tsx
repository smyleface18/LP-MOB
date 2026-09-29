import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { colors, withAlpha } from '@/shared/ui/theme/primitives';

export interface HoverCardProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** Cuánto crece la card con el mouse encima. */
const HOVER_SCALE = 1.02;
const SHADOW_COLOR = colors.surfaceDark.base;

/**
 * Contenedor de card con sombra en la parte inferior. En web, además, crece
 * un poco (y la sombra se hace más marcada) al pasar el mouse por encima.
 * Solo escucha el hover: los toques los manejan los botones de adentro, así
 * que no hay pulsables anidados. En nativo es un View con sombra.
 */
const HoverCard: React.FC<HoverCardProps> = ({ style, children }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [hovered, setHovered] = useState(false);

  if (Platform.OS !== 'web') {
    return <View style={[styles.card, styles.nativeShadow, style]}>{children}</View>;
  }

  return (
    <Pressable
      accessible={false}
      focusable={false}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[styles.card, styles.webCard, hovered && styles.webCardHovered, style]}
    >
      {children}
    </Pressable>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      flex: 1,
      // Mismo radio que las cards, para que la sombra siga su forma.
      borderRadius: theme.radius.lg,
    },
    nativeShadow: {
      ...theme.shadow.md,
    },
    webCard: {
      // Sombra solo abajo: el spread negativo la esconde de los costados.
      boxShadow: `0 6px 10px -4px ${withAlpha(SHADOW_COLOR, 0.22)}`,
      // react-native-web pasa estas propiedades a CSS; no están en los tipos de RN.
      ...({
        transitionProperty: 'transform, box-shadow',
        transitionDuration: '150ms',
        transitionTimingFunction: 'ease-out',
      } as ViewStyle),
    },
    webCardHovered: {
      transform: [{ scale: HOVER_SCALE }],
      boxShadow: `0 12px 18px -6px ${withAlpha(SHADOW_COLOR, 0.3)}`,
      zIndex: 1,
    },
  });

export default HoverCard;
