import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon, IconName } from '@/shared/components/Icon';
import { Logo } from '@/shared/components/Logo';
import { ADMIN_TAB_META } from '../adminTabMeta';

interface WebTabItem {
  routeName: string;
  label: string;
  icon: IconName;
}

/** Orden e íconos fijos para el sidebar web — a propósito distinto de
 * TabBarMobile (acá "Dashboard" tiene ícono de grid y ese label, en mobile
 * es "Inicio" con ícono de casa), así que no comparten config. */
const BASE_ITEMS: WebTabItem[] = [
  { routeName: 'Arena', label: 'Arena / Jugar', icon: 'GameControllerIcon' },
  { routeName: 'Dashboard', label: 'Dashboard', icon: 'GridFourIcon' },
  { routeName: 'Ranking', label: 'Ranking', icon: 'TrophyIcon' },
  { routeName: 'Perfil', label: 'Perfil', icon: 'UserIcon' },
];

export const TabBarWeb: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isFocused = (routeName: string) => state.routes[state.index].name === routeName;

  const goTo = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;

    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!isFocused(routeName) && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const renderItem = (routeName: string, label: string, icon: IconName) => {
    const active = isFocused(routeName);
    return (
      <TouchableOpacity
        key={routeName}
        style={[styles.item, active && styles.itemActive]}
        onPress={() => goTo(routeName)}
      >
        <Icon
          name={icon}
          size="md"
          color={active ? theme.color.primary : theme.color.textSecondary}
        />
        <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const adminRoutes = state.routes.filter((r) => ADMIN_TAB_META[r.name]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo layout="horizontal" imageSize={32} textSize={16} showText />
      </View>

      <ScrollView contentContainerStyle={styles.nav}>
        {BASE_ITEMS.filter((item) => state.routes.some((r) => r.name === item.routeName)).map(
          (item) => renderItem(item.routeName, item.label, item.icon),
        )}

        {adminRoutes.length > 0 && (
          <>
            <View style={styles.divider} />
            {adminRoutes.map((route) =>
              renderItem(
                route.name,
                ADMIN_TAB_META[route.name].label,
                ADMIN_TAB_META[route.name].icon,
              ),
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      width: '30%',
      maxWidth: 300,
      height: '100%',
      backgroundColor: theme.color.surfaceElevated,
      borderRightWidth: theme.borderWidth.xs,
      borderRightColor: theme.color.border,
    },
    header: {
      padding: theme.spacing.lg,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.color.border,
    },
    nav: {
      padding: theme.spacing.md,
      gap: theme.spacing.xs / 2,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.lg,
    },
    itemActive: {
      backgroundColor: theme.color.primarySubtle,
    },
    itemLabel: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    itemLabelActive: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
    },
    divider: {
      height: theme.borderWidth.xs,
      backgroundColor: theme.color.border,
      marginVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
    },
  });
