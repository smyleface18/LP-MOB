import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon, IconName } from '@/shared/components/Icon';

interface MobileTabItem {
  routeName: string;
  label: string;
  icon: IconName;
}

/** Orden e íconos fijos para el bottom nav mobile — a propósito distintos
 * de TabBarWeb (ahí "Dashboard" se llama "Dashboard" con ícono grid, acá es
 * "Inicio" con ícono de casa; el orden también difiere), así que no vale la
 * pena compartir una config genérica entre ambos. */
const ITEMS: MobileTabItem[] = [
  { routeName: 'Dashboard', label: 'Inicio', icon: 'HouseIcon' },
  { routeName: 'Arena', label: 'Arena', icon: 'GameControllerIcon' },
  { routeName: 'Ranking', label: 'Ranking', icon: 'TrophyIcon' },
  { routeName: 'Perfil', label: 'Perfil', icon: 'UserIcon' },
];

export const TabBarMobile: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, insets.bottom), [theme, insets.bottom]);

  const isFocused = (routeName: string) => state.routes[state.index].name === routeName;

  const goTo = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;

    const focused = isFocused(routeName);
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <Animated.View style={styles.container}>
      {ITEMS.filter((item) => state.routes.some((r) => r.name === item.routeName)).map((item) => (
        <TabBarMobileItem
          key={item.routeName}
          item={item}
          isActive={isFocused(item.routeName)}
          onPress={() => goTo(item.routeName)}
        />
      ))}
    </Animated.View>
  );
};

interface TabBarMobileItemProps {
  item: MobileTabItem;
  isActive: boolean;
  onPress: () => void;
}

/**
 * Cada tab anima su propio "badge" (el círculo elevado que antes solo tenía
 * Arena) al activarse/desactivarse — mismo patrón de Animated.Value +
 * interpolate que ya usa FilterChip para transiciones de color/estado.
 */
const TabBarMobileItem: React.FC<TabBarMobileItemProps> = ({ item, isActive, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createItemStyles(theme), [theme]);

  const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: isActive ? 1 : 0,
      duration: theme.duration.normal,
      easing: theme.easing.playful,
      useNativeDriver: false,
    }).start();
  }, [isActive, activeAnim, theme.duration.normal, theme.easing.playful]);

  const translateY = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -theme.spacing.lg],
  });
  const scale = activeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const backgroundColor = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', theme.color.primary],
  });
  const borderColor = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', theme.color.surfaceElevated],
  });
  const labelColor = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.color.textSecondary, theme.color.primary],
  });
  // Mismos números que theme.shadow.md, pero animados — Platform.select
  // decide una sola vez qué clave usar, animando el mismo `activeAnim`.
  const shadowStyle = Platform.select({
    android: { elevation: activeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
    default: {
      shadowColor: '#18181B',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      shadowOpacity: activeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.1] }),
    },
  });

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Animated.View
        style={[
          styles.badge,
          shadowStyle,
          {
            backgroundColor,
            borderColor,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <Icon
          name={item.icon}
          size="lg"
          color={isActive ? theme.color.onPrimary : theme.color.textSecondary}
        />
      </Animated.View>
      <Animated.Text style={[styles.itemLabel, { color: labelColor }]}>{item.label}</Animated.Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: theme.color.surfaceElevated,
      borderTopWidth: theme.borderWidth.xs,
      borderTopColor: theme.color.border,
      paddingTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
  });

const createItemStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
    },
    badge: {
      width: theme.spacing.xl * 1.5,
      height: theme.spacing.xl * 1.5,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemLabel: {
      fontSize: theme.fontSize.sm - 2,
      fontFamily: theme.fontFamily.bodyBold,
    },
  });
