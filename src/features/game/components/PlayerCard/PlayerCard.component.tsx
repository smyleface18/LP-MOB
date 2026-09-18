import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { PlayerInfo } from '../../types';

export interface PlayerCardProps {
  player: PlayerInfo;
  isHost?: boolean;
}

const getInitials = (username: string): string =>
  username
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isHost = false }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusColor = player.isConnected ? theme.color.success : theme.color.error;

  return (
    <View style={[styles.card, { opacity: player.isConnected ? 1 : 0.6 }]}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        {player.avatar ? (
          <Image source={{ uri: player.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>{getInitials(player.username)}</Text>
          </View>
        )}
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      {/* Player Info */}
      <View style={styles.infoSection}>
        <View style={styles.nameRow}>
          <Text style={styles.username} numberOfLines={1}>
            {player.username}
          </Text>
          <Text style={styles.levelBadge}>Level {player.level}</Text>
          {isHost && <Text style={styles.hostBadge}>👑 Host</Text>}
        </View>
        <Text style={styles.status}>{player.isConnected ? '🟢 Connected' : '🔴 Disconnected'}</Text>
      </View>

      {/* Score */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{player.matchScore}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.md,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      gap: theme.spacing.md,
    },
    avatarSection: {
      position: 'relative',
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.border,
    },
    avatarPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    initials: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onPrimary,
    },
    statusDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: theme.radius.full,
      borderWidth: 2,
      borderColor: theme.color.surface,
    },
    infoSection: {
      flex: 1,
      gap: theme.spacing.xs / 2,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    username: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      flex: 1,
    },
    hostBadge: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      // El amarillo de accent es claro: necesita fondo sólido + onAccent
      // oscuro para tener contraste legible (ver doc de ColorTheme.onAccent).
      color: theme.color.onAccent,
      backgroundColor: theme.color.accent,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
    },
    levelBadge: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.secondary,
      backgroundColor: theme.color.secondarySubtle,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
    },
    status: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    scoreSection: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xs,
    },
    scoreLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
    },
    scoreValue: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginTop: 2,
    },
  });

export default PlayerCard;
