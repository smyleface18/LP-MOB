import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import PlayerCard from '../../components/PlayerCard';
import { PlayerInfo } from '../../types';

const PAGE_MAX_WIDTH = 560;

interface GameLobbyProps {
  roomId: string;
  level: string | null;
  mode: string | null;
  players: PlayerInfo[];
  user: PlayerInfo;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  roomId,
  level,
  mode,
  players,
  user,
  onStartGame,
  onLeaveRoom,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.page}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>🎯 Game Room</Text>
            <View style={styles.roomDetails}>
              <Text style={styles.label}>
                Room ID: <Text style={styles.value}>{roomId}</Text>
              </Text>
              <Text style={styles.label}>
                Level: <Text style={styles.value}>{level || '⏳ Loading...'}</Text>
              </Text>
              <Text style={styles.label}>
                Mode: <Text style={styles.value}>{mode || '⏳ Loading...'}</Text>
              </Text>
            </View>
          </View>

          {/* Players List */}
          <View style={styles.playersSection}>
            <Text style={styles.sectionTitle}>Players ({players.length})</Text>
            {players.length > 0 ? (
              <View style={styles.playersList}>
                {players.map((player) => (
                  <PlayerCard key={player.userId} player={player} isHost={player.isOwner} />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Waiting for players...</Text>
            )}
          </View>

          {/* Ready to Start */}
          {players.length > 0 && (
            <View style={styles.readyContainer}>
              <Text style={styles.waitingText}>✅ Ready to start!</Text>
              {user.isOwner ? (
                <Text style={styles.hostText}>
                  You are the host. Click below to start the game.
                </Text>
              ) : (
                <Text style={styles.hostText}>Waiting for host to start the game...</Text>
              )}
            </View>
          )}
        </View>
        {/* Actions - Always visible at bottom */}
        <View style={styles.actions}>
          <View style={styles.actionsPage}>
            {user.isOwner && players.length > 0 && (
              <Button
                title="🚀 Start Game"
                variant="primary"
                onPress={onStartGame}
                style={styles.actionButton}
              />
            )}
            <Button
              title="← Leave Room"
              variant="outlined"
              onPress={onLeaveRoom}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
      flexDirection: 'column',
    },
    content: {
      flex: 1,
      minHeight: 0, // permite que el ScrollView se encoja bajo el contenido flex
    },
    scrollContent: {
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    headerInfo: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    roomDetails: {
      gap: theme.spacing.xs,
    },
    label: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      fontFamily: theme.fontFamily.body,
    },
    value: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPrimary,
      fontFamily: theme.fontFamily.bodyBold,
    },
    playersSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    playersList: {
      gap: theme.spacing.sm,
    },
    emptyText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
      textAlign: 'center',
      paddingVertical: theme.spacing.lg,
    },
    readyContainer: {
      backgroundColor: theme.color.successSubtle,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.success,
      marginBottom: theme.spacing.sm,
    },
    waitingText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    hostText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    actions: {
      width: '100%',
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      borderTopWidth: theme.borderWidth.xs,
      borderTopColor: theme.color.border,
      backgroundColor: theme.color.background,
      alignItems: 'center',
    },
    actionsPage: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      flexDirection: isDesktop ? 'row' : 'column',
      gap: theme.spacing.sm,
    },
    actionButton: {
      flex: 1,
    },
  });

export default GameLobby;
