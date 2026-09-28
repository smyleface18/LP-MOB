import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon } from '@/shared/components/Icon';
import StoryAvatar from '../StoryAvatar';
import { StoryLobbyPlayer } from '../../types';

export interface StoryPlayerCardProps {
  player: StoryLobbyPlayer;
  isHost?: boolean;
  /** Es el jugador que está usando la app. */
  isYou?: boolean;
  /** Posición en el orden de turnos (1, 2, ...). */
  turnPosition?: number;
  /** Solo el anfitrión, en el lobby: muestra el botón para expulsarlo. */
  onKick?: () => void;
}

const StoryPlayerCard: React.FC<StoryPlayerCardProps> = ({
  player,
  isHost = false,
  isYou = false,
  turnPosition,
  onKick,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const status = player.left ? 'Left the story' : player.connected ? 'Connected' : 'Disconnected';
  const statusColor = player.left
    ? theme.color.textPlaceholder
    : player.connected
      ? theme.color.success
      : theme.color.error;

  return (
    <View style={[styles.card, (player.left || !player.connected) && styles.inactive]}>
      {turnPosition !== undefined && <Text style={styles.position}>{turnPosition}</Text>}

      <View>
        <StoryAvatar name={player.username} avatarUrl={player.avatarUrl} />
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.username} numberOfLines={1}>
            {player.username}
            {isYou ? ' (you)' : ''}
          </Text>
          {isHost && <Text style={styles.hostBadge}>👑 Host</Text>}
        </View>
        <Text style={styles.status}>{status}</Text>
      </View>

      {onKick && (
        <TouchableOpacity
          onPress={onKick}
          style={styles.kickButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${player.username}`}
        >
          <Icon name="XIcon" size="sm" color={theme.color.textError} />
        </TouchableOpacity>
      )}
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
    inactive: {
      opacity: 0.6,
    },
    position: {
      width: 20,
      textAlign: 'center',
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textSecondary,
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
    info: {
      flex: 1,
      gap: theme.spacing.xs / 2,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    username: {
      flexShrink: 1,
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    hostBadge: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      // El amarillo de accent es claro: fondo sólido + onAccent (ver PlayerCard).
      color: theme.color.onAccent,
      backgroundColor: theme.color.accent,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
    },
    status: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    kickButton: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.errorSubtle,
    },
  });

export default StoryPlayerCard;
