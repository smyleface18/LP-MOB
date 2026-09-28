import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import StoryAvatar from '../../components/StoryAvatar';
import StoryPanelCard from '../../components/StoryPanelCard';
import CorrectionList from '../../components/CorrectionList';
import { PanelScore, ReviewManifest, ReviewPanel } from '../../types';

const PAGE_MAX_WIDTH = 640;
const MEDALS = ['🥇', '🥈', '🥉'];

export interface StoryReviewViewProps {
  manifest: ReviewManifest;
  userId: string;
  reactionOptions: string[];
  onReact: (panelOrder: number, emoji: string) => void;
  creating: boolean;
  onNewStory: () => void;
  onBackToMenu: () => void;
}

const scoreDetails = (score: PanelScore): string[] => {
  const details = [`Accuracy ${score.accuracy}`];
  if (score.firstTryBonus) details.push(`+${score.firstTryBonus} first try`);
  if (score.selfCorrectionBonus) details.push(`+${score.selfCorrectionBonus} self-correction`);
  if (score.timeoutPenalty) details.push('time ran out (half accuracy)');
  return details;
};

/** Detalle de una viñeta en el review: lo que escribió el jugador y sus correcciones. */
const PanelDetails: React.FC<{ panel: ReviewPanel }> = ({ panel }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, false), [theme]);
  const [open, setOpen] = useState(false);
  const changed = panel.originalText !== '' && panel.originalText !== panel.finalText;

  return (
    <View style={styles.details}>
      <Text style={styles.scoreDetails}>{scoreDetails(panel.score).join(' · ')}</Text>
      {(changed || panel.corrections.length > 0) && (
        <TouchableOpacity
          onPress={() => setOpen((prev) => !prev)}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
        >
          <Text style={styles.toggle}>
            {open ? '▲ Hide corrections' : `▼ Show corrections (${panel.corrections.length})`}
          </Text>
        </TouchableOpacity>
      )}
      {open && (
        <View style={styles.detailsBody}>
          {changed && (
            <Text style={styles.originalText}>
              <Text style={styles.originalLabel}>Written: </Text>
              {panel.originalText}
            </Text>
          )}
          <CorrectionList corrections={panel.corrections} />
        </View>
      )}
    </View>
  );
};

const StoryReviewView: React.FC<StoryReviewViewProps> = ({
  manifest,
  userId,
  reactionOptions,
  onReact,
  creating,
  onNewStory,
  onBackToMenu,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const characterNames = (ids: string[]) =>
    ids
      .map((id) => manifest.characters.find((c) => c.id === id)?.name)
      .filter((name): name is string => !!name);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🎉</Text>
            <Text style={styles.title}>Your story is ready!</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ranking</Text>
            <View style={styles.ranking}>
              {manifest.ranking.map((entry, index) => (
                <View
                  key={entry.userId}
                  style={[styles.rankRow, entry.userId === userId && styles.rankRowMine]}
                >
                  <Text style={styles.rankPosition}>{MEDALS[index] ?? `${index + 1}`}</Text>
                  <StoryAvatar name={entry.name} avatarUrl={entry.avatarUrl} size={36} />
                  <View style={styles.rankInfo}>
                    <Text style={styles.rankName} numberOfLines={1}>
                      {entry.name}
                      {entry.userId === userId ? ' (you)' : ''}
                    </Text>
                    <Text style={styles.rankMeta}>
                      {entry.panelsWritten} {entry.panelsWritten === 1 ? 'panel' : 'panels'} ·{' '}
                      {entry.totalScore} pts
                    </Text>
                  </View>
                  <View style={styles.rankScore}>
                    <Text style={styles.rankAverage}>{entry.averageScore}</Text>
                    <Text style={styles.rankMeta}>avg</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {manifest.characters.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Characters</Text>
              {manifest.characters.map((character) => (
                <Text key={character.id} style={styles.character}>
                  <Text style={styles.characterName}>{character.name}</Text> ({character.kind}) —{' '}
                  {character.description}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The story</Text>
            {manifest.panels.map((panel) => (
              <StoryPanelCard
                key={panel.order}
                order={panel.order}
                authorName={panel.author.name}
                scene={panel.scene}
                text={panel.finalText}
                characterNames={characterNames(panel.characterIds)}
                score={panel.score.total}
                reactions={panel.reactions}
                reactionOptions={reactionOptions}
                userId={userId}
                onReact={(emoji) => onReact(panel.order, emoji)}
              >
                {/* Fase 4b del backend: por ahora las viñetas no traen imagen. */}
                {panel.imageUrl && (
                  <Image
                    source={{ uri: panel.imageUrl }}
                    style={styles.panelImage}
                    resizeMode="cover"
                  />
                )}
                <PanelDetails panel={panel} />
              </StoryPanelCard>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <View style={styles.actionsPage}>
          <Button
            title={creating ? 'Creating...' : 'New story'}
            icon="BookOpenIcon"
            onPress={onNewStory}
            disabled={creating}
            style={styles.actionButton}
          />
          <Button
            title="Back to menu"
            variant="outlined"
            onPress={onBackToMenu}
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
      minHeight: 0,
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
    hero: {
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    heroEmoji: {
      fontSize: 48,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      textAlign: 'center',
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    ranking: {
      gap: theme.spacing.xs,
    },
    rankRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    rankRowMine: {
      borderColor: theme.color.primary,
    },
    rankPosition: {
      width: 28,
      textAlign: 'center',
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textSecondary,
    },
    rankInfo: {
      flex: 1,
    },
    rankName: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    rankMeta: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    rankScore: {
      alignItems: 'center',
    },
    rankAverage: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.success,
    },
    character: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    characterName: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    panelImage: {
      width: '100%',
      aspectRatio: 4 / 3,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.border,
    },
    details: {
      gap: theme.spacing.xs,
    },
    detailsBody: {
      gap: theme.spacing.sm,
    },
    scoreDetails: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    toggle: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
    },
    originalText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    originalLabel: {
      fontFamily: theme.fontFamily.bodyBold,
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

export default StoryReviewView;
