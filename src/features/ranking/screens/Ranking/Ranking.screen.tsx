import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon } from '@/shared/components/Icon';

/**
 * Placeholder: todavía no existe un servicio de ranking/leaderboard en el
 * backend. Esta pantalla solo existe para que el tab "Ranking" del menú
 * principal tenga algo que renderizar — reemplazar cuando el feature real
 * esté listo.
 */
const RankingScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="TrophyIcon" size="xl" color={theme.color.accent} weight="duotone" />
      </View>
      <Text style={styles.title}>Ranking</Text>
      <Text style={styles.subtitle}>Muy pronto vas a poder ver el top de jugadores acá.</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.background,
      padding: theme.spacing.xl,
      gap: theme.spacing.xs,
    },
    iconWrap: {
      width: theme.spacing.xl * 2,
      height: theme.spacing.xl * 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.accentSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
  });

export default RankingScreen;
