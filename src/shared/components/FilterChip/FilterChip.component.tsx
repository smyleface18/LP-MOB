import { useTheme } from '@/app/providers/theme.provider';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

export interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: isActive ? 1 : 0,
      duration: theme.duration.fast,
      easing: theme.easing.standard,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.color.border, theme.color.primary],
  });

  const borderColor = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.color.border, theme.color.primary],
  });

  const textColor = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.color.secondary, theme.color.textInverse],
  });

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {/*
        Dos vistas a propósito: la escala usa el driver nativo y los colores el
        de JS (el nativo no anima colores). En el mismo nodo, la primera
        animación nativa lo pasa al lado nativo y la siguiente de colores falla
        ("Attempting to run JS driven animation on animated node that has been
        moved to native").
      */}
      <Animated.View style={[styles.chipWrapper, { transform: [{ scale: pressAnim }] }]}>
        <Animated.View style={[styles.chip, { backgroundColor, borderColor }]}>
          <Animated.Text style={[styles.chipText, { color: textColor }]}>{label}</Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    // El margen y el ancho máximo van en la vista de afuera (la que escala).
    chipWrapper: {
      marginRight: theme.spacing.sm,
      maxWidth: theme.maxContentWidth,
    },
    chip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
      borderWidth: theme.borderWidth.xs,
    },
    chipText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
    },
  });

export { FilterChip };
