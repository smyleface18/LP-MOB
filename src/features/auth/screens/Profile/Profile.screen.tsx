import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useAuthState } from '@/store';
import { useAuth } from '../../hooks/useAuth';
import Button from '@/shared/components/Button/Button.component';
import { Icon } from '@/shared/components/Icon';

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { user } = useAuthState();
  const { handleSignOut, loading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.avatar}>
          <Icon name="UserIcon" size="xl" color={theme.color.onPrimary} />
        </View>
        <Text style={styles.username}>{user?.username ?? 'Jugador'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.level ?? '—'}</Text>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.score ?? 0}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
        </View>

        <View style={styles.signOutButton}>
          <Button
            title={loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
            variant="outlined"
            onPress={handleSignOut}
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
      alignItems: 'center',
    },
    page: {
      width: '100%',
      maxWidth: theme.maxContentWidth,
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    avatar: {
      width: theme.spacing.xl * 2,
      height: theme.spacing.xl * 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    username: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    email: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      width: '100%',
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.surface,
    },
    statValue: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    statLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    signOutButton: {
      width: '100%',
    },
  });

export default ProfileScreen;
