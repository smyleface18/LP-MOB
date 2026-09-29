import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import { FilterChip } from '@/shared/components/FilterChip';
import StoryPlayerCard from '../../components/StoryPlayerCard';
import { StoryConfig, StoryLobby, StoryRules } from '../../types';
import { StoryPendingAction } from '../../hooks/storyGame.reducer';

const PAGE_MAX_WIDTH = 560;

export interface StoryLobbyViewProps {
  lobby: StoryLobby;
  userId: string;
  isHost: boolean;
  rules: StoryRules | null;
  pending: StoryPendingAction | null;
  onUpdateConfig: (config: Partial<StoryConfig>) => void;
  onKick: (userId: string) => void;
  onStart: () => void;
  onLeave: () => void;
}

/** Por qué el anfitrión todavía no puede empezar, o null si puede. */
const startBlocker = (lobby: StoryLobby, rules: StoryRules | null): string | null => {
  const minPlayers = rules?.players.min ?? 1;
  const connected = lobby.players.filter((player) => player.connected).length;
  if (connected < minPlayers) {
    return `You need at least ${minPlayers} connected ${minPlayers === 1 ? 'player' : 'players'}.`;
  }
  if (lobby.config.panelsCount < lobby.players.length) {
    return 'There must be at least one panel per player.';
  }
  return null;
};

const StoryLobbyView: React.FC<StoryLobbyViewProps> = ({
  lobby,
  userId,
  isHost,
  rules,
  pending,
  onUpdateConfig,
  onKick,
  onStart,
  onLeave,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const { config } = lobby;
  const blocker = startBlocker(lobby, rules);
  const maxPlayers = rules?.players.max ?? 6;
  const panels = rules?.config.panelsCount ?? { min: 4, max: 10 };
  const editable = isHost && pending !== 'config';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Story code — share it with your friends</Text>
            <Text style={styles.code} selectable>
              {lobby.gameId}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Players ({lobby.players.length}/{maxPlayers})
            </Text>
            <Text style={styles.hint}>The order below is the writing order.</Text>
            <View style={styles.list}>
              {lobby.players.map((player, index) => (
                <StoryPlayerCard
                  key={player.userId}
                  player={player}
                  turnPosition={index + 1}
                  isHost={player.userId === lobby.hostId}
                  isYou={player.userId === userId}
                  onKick={
                    isHost && player.userId !== userId && pending !== 'kick'
                      ? () => onKick(player.userId)
                      : undefined
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {!isHost && <Text style={styles.hint}>Only the host can change the settings.</Text>}

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Panels</Text>
              <View style={styles.stepper}>
                <Button
                  title="−"
                  variant="outlined"
                  size="small"
                  onPress={() => onUpdateConfig({ panelsCount: config.panelsCount - 1 })}
                  disabled={!editable || config.panelsCount <= panels.min}
                  accessibilityLabel="Fewer panels"
                  style={styles.stepperButton}
                />
                <Text style={styles.stepperValue}>{config.panelsCount}</Text>
                <Button
                  title="+"
                  variant="outlined"
                  size="small"
                  onPress={() => onUpdateConfig({ panelsCount: config.panelsCount + 1 })}
                  disabled={!editable || config.panelsCount >= panels.max}
                  accessibilityLabel="More panels"
                  style={styles.stepperButton}
                />
              </View>
            </View>

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Time per turn</Text>
              <View style={styles.chips}>
                {(rules?.config.turnDurationsSec ?? [config.turnDurationSec]).map((seconds) => (
                  <FilterChip
                    key={seconds}
                    label={`${seconds}s`}
                    isActive={config.turnDurationSec === seconds}
                    onPress={() => editable && onUpdateConfig({ turnDurationSec: seconds })}
                  />
                ))}
              </View>
            </View>

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>English level</Text>
              <View style={styles.chips}>
                {(rules?.config.levels ?? [config.level]).map((level) => (
                  <FilterChip
                    key={level}
                    label={level}
                    isActive={config.level === level}
                    onPress={() => editable && onUpdateConfig({ level })}
                  />
                ))}
              </View>
            </View>

            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Show drafts to everyone</Text>
              <View style={styles.chips}>
                <FilterChip
                  label="On"
                  isActive={config.shareDrafts}
                  onPress={() => editable && onUpdateConfig({ shareDrafts: true })}
                />
                <FilterChip
                  label="Off"
                  isActive={!config.shareDrafts}
                  onPress={() => editable && onUpdateConfig({ shareDrafts: false })}
                />
              </View>
            </View>
          </View>

          <View style={[styles.status, blocker ? styles.statusWaiting : styles.statusReady]}>
            <Text style={[styles.statusText, !blocker && styles.statusTextReady]}>
              {blocker ?? '✅ Ready to start!'}
            </Text>
            {!blocker && !isHost && (
              <Text style={styles.hint}>Waiting for the host to start the story...</Text>
            )}
            {!blocker && isHost && lobby.players.length === 1 && (
              <Text style={styles.hint}>
                Playing solo: you will write all {lobby.config.panelsCount} panels. Share the code
                if you want friends to join.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <View style={styles.actionsPage}>
          {isHost && (
            <Button
              title={pending === 'start' ? 'Starting...' : '🚀 Start story'}
              onPress={onStart}
              disabled={!!blocker || pending === 'start'}
              style={styles.actionButton}
            />
          )}
          <Button
            title="← Leave"
            variant="outlined"
            onPress={onLeave}
            disabled={pending === 'leave'}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
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
      gap: theme.spacing.lg,
    },
    codeCard: {
      alignItems: 'center',
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.primarySubtle,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.primary,
    },
    codeLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    code: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    hint: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    list: {
      gap: theme.spacing.sm,
    },
    setting: {
      gap: theme.spacing.xs,
    },
    settingLabel: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    // Button ocupa todo el ancho por defecto.
    stepperButton: {
      width: 48,
    },
    stepperValue: {
      minWidth: 32,
      textAlign: 'center',
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    status: {
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      borderWidth: theme.borderWidth.xs,
      gap: theme.spacing.xs,
      alignItems: 'center',
    },
    statusWaiting: {
      backgroundColor: theme.color.surface,
      borderColor: theme.color.border,
    },
    statusReady: {
      backgroundColor: theme.color.successSubtle,
      borderColor: theme.color.success,
    },
    statusText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    statusTextReady: {
      color: theme.color.success,
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
      flex: isDesktop ? 1 : undefined,
    },
  });

export default StoryLobbyView;
