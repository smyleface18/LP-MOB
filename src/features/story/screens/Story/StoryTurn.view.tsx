import React, { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Loading } from '@/shared/components/Loading';
import TurnTimer from '../../components/TurnTimer';
import PanelEditor, { PanelEditorProps } from '../../components/PanelEditor';
import StoryPanelCard from '../../components/StoryPanelCard';
import CorrectionList from '../../components/CorrectionList';
import StoryAvatar from '../../components/StoryAvatar';
import {
  AuthorStatus,
  PanelConfirmedEvent,
  SharedDraftEvent,
  StoryCharacter,
  StoryLobbyPlayer,
  StoryPanelSummary,
  StoryTurn,
} from '../../types';

const PAGE_MAX_WIDTH = 640;

export interface StoryTurnViewProps {
  /** null entre la confirmación de una viñeta y el turno siguiente. */
  turn: StoryTurn | null;
  panelsCount: number;
  turnDurationSec: number;
  timeLeft: number;
  isAuthor: boolean;
  author: StoryLobbyPlayer | null;
  players: StoryLobbyPlayer[];
  storySoFar: StoryPanelSummary[];
  cast: StoryCharacter[];
  userId: string;
  reactionOptions: string[];
  onReact: (panelOrder: number, emoji: string) => void;
  /** Borrador revisado del autor, visto por los demás (`shareDrafts`). */
  sharedDraft: SharedDraftEvent | null;
  shareDrafts: boolean;
  lastConfirmed: PanelConfirmedEvent | null;
  /** Solo para el autor del turno. */
  editor: PanelEditorProps | null;
}

const AUTHOR_STATUS_TEXT: Record<AuthorStatus, string> = {
  writing: 'is writing',
  reviewing: 'is checking their English',
  correcting: 'is fixing their mistakes',
};

const StoryTurnView: React.FC<StoryTurnViewProps> = ({
  turn,
  panelsCount,
  turnDurationSec,
  timeLeft,
  isAuthor,
  author,
  players,
  storySoFar,
  cast,
  userId,
  reactionOptions,
  onReact,
  sharedDraft,
  shareDrafts,
  lastConfirmed,
  editor,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const nameOf = (id: string) => players.find((p) => p.userId === id)?.username ?? 'Someone';
  const characterNames = (ids: string[]) =>
    ids.map((id) => cast.find((c) => c.id === id)?.name).filter((name): name is string => !!name);
  // Las más recientes primero: la última es el contexto de la que se escribe.
  const previousPanels = useMemo(() => [...storySoFar].reverse(), [storySoFar]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          {turn ? (
            <View style={styles.turnCard}>
              <View style={styles.turnHeader}>
                <Text style={styles.panelNumber}>
                  Panel {turn.panelOrder + 1} of {panelsCount}
                </Text>
                {author && (
                  <View style={styles.authorRow}>
                    <StoryAvatar name={author.username} avatarUrl={author.avatarUrl} size={24} />
                    <Text style={styles.authorName} numberOfLines={1}>
                      {isAuthor ? 'Your turn!' : author.username}
                    </Text>
                  </View>
                )}
              </View>
              <TurnTimer secondsLeft={timeLeft} totalSeconds={turnDurationSec} />
            </View>
          ) : (
            <View style={styles.between}>
              <Loading size={48} />
              <Text style={styles.betweenText}>Getting the next panel ready...</Text>
            </View>
          )}

          {lastConfirmed && (
            <View style={styles.confirmedBanner}>
              <Text style={styles.confirmedText}>
                {lastConfirmed.authorId === userId ? 'You' : nameOf(lastConfirmed.authorId)} earned{' '}
                <Text style={styles.confirmedPoints}>{lastConfirmed.score.total} pts</Text> for
                panel {lastConfirmed.order + 1}
                {lastConfirmed.confirmedBy === 'timeout' ? ' (time ran out)' : ''}.
              </Text>
            </View>
          )}

          {turn && isAuthor && editor && <PanelEditor {...editor} />}

          {turn && !isAuthor && (
            <View style={styles.watching}>
              <Text style={styles.watchingText}>
                ✍️ {author?.username ?? 'The author'} {AUTHOR_STATUS_TEXT[turn.authorStatus]}...
              </Text>
              {sharedDraft ? (
                <StoryPanelCard
                  variant="draft"
                  order={sharedDraft.order}
                  authorName={nameOf(sharedDraft.authorId)}
                  scene={sharedDraft.scene}
                  text={sharedDraft.text}
                  characterNames={[
                    ...characterNames(sharedDraft.characterIds),
                    ...sharedDraft.newCharacters.map((c) => `✨ ${c.name}`),
                  ]}
                >
                  {sharedDraft.reviewAvailable && (
                    <CorrectionList
                      corrections={sharedDraft.corrections}
                      characterCorrections={sharedDraft.characterCorrections}
                      newCharacterNames={sharedDraft.newCharacters.map((c) => c.name)}
                      emptyText="No mistakes so far."
                    />
                  )}
                </StoryPanelCard>
              ) : (
                <Text style={styles.hint}>
                  {shareDrafts
                    ? 'You will see their draft here after the English check.'
                    : 'You will read the panel when they confirm it.'}
                </Text>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The story so far</Text>
            {previousPanels.length === 0 ? (
              <Text style={styles.hint}>Nothing yet — this is the first panel!</Text>
            ) : (
              previousPanels.map((panel) => (
                <StoryPanelCard
                  key={panel.order}
                  order={panel.order}
                  authorName={nameOf(panel.authorId)}
                  scene={panel.scene}
                  text={panel.finalText}
                  characterNames={characterNames(panel.characterIds)}
                  reactions={panel.reactions}
                  reactionOptions={reactionOptions}
                  userId={userId}
                  onReact={(emoji) => onReact(panel.order, emoji)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
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
    turnCard: {
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      ...theme.shadow.sm,
    },
    turnHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    panelNumber: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      flexShrink: 1,
    },
    authorName: {
      flexShrink: 1,
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
    },
    between: {
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.lg,
    },
    betweenText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    confirmedBanner: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.successSubtle,
    },
    confirmedText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPrimary,
      textAlign: 'center',
    },
    confirmedPoints: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
    },
    watching: {
      gap: theme.spacing.sm,
    },
    watchingText: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
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
  });

export default StoryTurnView;
