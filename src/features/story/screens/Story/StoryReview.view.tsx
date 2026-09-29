import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import StoryAvatar from '../../components/StoryAvatar';
import StoryPanelCard from '../../components/StoryPanelCard';
import CorrectionList from '../../components/CorrectionList';
import NarratedText from '../../components/NarratedText';
import NarrationControls from '../../components/NarrationControls';
import { stopNarration, usePanelNarration } from '../../hooks/usePanelNarration';
import { PanelScore, ReviewManifest, ReviewPanel, StoryLikes } from '../../types';

const PAGE_MAX_WIDTH = 640;
const MEDALS = ['🥇', '🥈', '🥉'];

export interface StoryReviewViewProps {
  manifest: ReviewManifest;
  userId: string;
  reactionOptions: string[];
  /** Sin esto las reacciones son de solo lectura (ej. una historieta del historial). */
  onReact?: (panelOrder: number, emoji: string) => void;
  /** Título de arriba. Por defecto, el del final de una partida. */
  title?: string;
  /** Sin esto no se muestra el botón de historieta nueva (ej. en el historial). */
  onNewStory?: () => void;
  creating?: boolean;
  /**
   * Botón de volver abajo. Sin esto no se muestra (ej. en el historial, donde
   * se vuelve con la flecha de la cabecera).
   */
  onBack?: () => void;
  backLabel?: string;
  /** Likes de la historieta completa; sin esto no se muestra el botón. */
  likes?: StoryLikes;
  onToggleLike?: () => void;
  /** Al abrir, narra la historia completa, viñeta por viñeta. */
  autoPlay?: boolean;
}

/**
 * Qué se está narrando: la historia completa (al terminar una viñeta sigue la
 * siguiente) o una sola viñeta que eligió el jugador.
 */
interface Playback {
  mode: 'story' | 'panel';
  order: number;
}

/** Se puede narrar si tiene audio, o si todavía se está generando (se espera). */
const isNarratable = (panel: ReviewPanel) =>
  panel.mediaStatus === 'pending' || (panel.mediaStatus === 'ready' && !!panel.audioUrl);

/** Margen arriba de la viñeta al desplazarse hasta ella. */
const SCROLL_MARGIN = 16;

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

interface ReviewPanelItemProps {
  panel: ReviewPanel;
  characterNames: string[];
  userId: string;
  reactionOptions: string[];
  onReact?: (panelOrder: number, emoji: string) => void;
  /**
   * Pedido de narrar esta viñeta desde el principio (cambia con cada pedido).
   * Si el audio todavía no está, se narra apenas llega.
   */
  playRequestId: number | null;
  /** El jugador tocó play/pausa en esta viñeta. */
  onToggle: (order: number, willPlay: boolean) => void;
  onEnded: (order: number) => void;
}

/** Una viñeta del review: imagen, texto narrado con la palabra resaltada, puntaje y reacciones. */
const ReviewPanelItem: React.FC<ReviewPanelItemProps> = ({
  panel,
  characterNames,
  userId,
  reactionOptions,
  onReact,
  playRequestId,
  onToggle,
  onEnded,
}) => {
  const narration = usePanelNarration(panel.audioUrl, panel.speechMarks, () =>
    onEnded(panel.order),
  );
  const { play } = narration;

  // Cada pedido se atiende una sola vez, aunque la URL se vuelva a firmar.
  const handledRequest = useRef<number | null>(null);
  useEffect(() => {
    if (playRequestId === null || handledRequest.current === playRequestId) return;
    if (!panel.audioUrl) return;
    handledRequest.current = playRequestId;
    play();
  }, [playRequestId, panel.audioUrl, play]);

  const handleToggle = () => {
    onToggle(panel.order, !narration.playing);
    narration.toggle();
  };

  return (
    <StoryPanelCard
      order={panel.order}
      authorName={panel.author.name}
      scene={panel.scene}
      text={panel.finalText}
      imageUrl={panel.imageUrl}
      textNode={
        <NarratedText
          text={panel.finalText}
          speechMarks={panel.speechMarks}
          activeIndex={narration.activeIndex}
        />
      }
      characterNames={characterNames}
      score={panel.score.total}
      reactions={panel.reactions}
      reactionOptions={reactionOptions}
      userId={userId}
      onReact={onReact ? (emoji) => onReact(panel.order, emoji) : undefined}
    >
      <NarrationControls
        mediaStatus={panel.mediaStatus}
        hasAudio={!!panel.audioUrl}
        playing={narration.playing}
        loading={narration.loading}
        progress={narration.progress}
        onToggle={handleToggle}
      />
      <PanelDetails panel={panel} />
    </StoryPanelCard>
  );
};

const StoryReviewView: React.FC<StoryReviewViewProps> = ({
  manifest,
  userId,
  reactionOptions,
  onReact,
  title = 'Your story is ready!',
  onNewStory,
  creating = false,
  onBack,
  backLabel = 'Back to menu',
  likes,
  onToggleLike,
  autoPlay = false,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  // --- Narración: la historia completa o una viñeta ---
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [playRequest, setPlayRequest] = useState<{ order: number; id: number } | null>(null);
  const [storyPlayed, setStoryPlayed] = useState(false);
  const nextRequestId = useRef(0);
  const playbackRef = useRef(playback);
  playbackRef.current = playback;

  // Posiciones para desplazarse hasta la viñeta que se narra.
  const scrollRef = useRef<ScrollView>(null);
  const pageY = useRef(0);
  const storyY = useRef(0);
  const panelY = useRef<Record<number, number>>({});
  const scrollToPanel = useCallback((order: number) => {
    const y = panelY.current[order];
    if (y === undefined) return;
    scrollRef.current?.scrollTo({
      y: Math.max(pageY.current + storyY.current + y - SCROLL_MARGIN, 0),
      animated: true,
    });
  }, []);

  const panels = manifest.panels;
  const hasNarration = panels.some(isNarratable);

  const nextAfter = useCallback(
    (order: number | null) =>
      panels.find((panel) => (order === null || panel.order > order) && isNarratable(panel)),
    [panels],
  );

  /** Narra `panel` como parte de la historia completa; sin viñeta, la historia terminó. */
  const playInStory = useCallback(
    (panel: ReviewPanel | undefined, scroll = true) => {
      if (!panel) {
        setPlayback(null);
        return;
      }
      setPlayback({ mode: 'story', order: panel.order });
      setPlayRequest({ order: panel.order, id: ++nextRequestId.current });
      if (scroll) scrollToPanel(panel.order);
    },
    [scrollToPanel],
  );

  const playStory = () => {
    setStoryPlayed(true);
    playInStory(nextAfter(null));
  };

  const stopStory = () => {
    stopNarration();
    setPlayback(null);
  };

  const handlePanelEnded = useCallback(
    (order: number) => {
      const current = playbackRef.current;
      if (current?.order !== order) return;
      if (current.mode === 'story') playInStory(nextAfter(order));
      else setPlayback(null);
    },
    [playInStory, nextAfter],
  );

  // El jugador eligió una viñeta: la historia completa deja de avanzar sola.
  const handlePanelToggle = useCallback((order: number, willPlay: boolean) => {
    setPlayback(willPlay ? { mode: 'panel', order } : null);
  }, []);

  // Si la viñeta que se esperaba se quedó sin audio (falló la generación), se salta.
  useEffect(() => {
    if (playback?.mode !== 'story') return;
    const current = panels.find((panel) => panel.order === playback.order);
    if (current && !isNarratable(current)) playInStory(nextAfter(current.order));
  }, [panels, playback, playInStory, nextAfter]);

  // Al abrir el review, la historia se narra sola desde la primera viñeta
  // (sin desplazarse: primero se ve el ranking).
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoPlay || autoStarted.current) return;
    autoStarted.current = true;
    setStoryPlayed(true);
    playInStory(nextAfter(null), false);
  }, [autoPlay, playInStory, nextAfter]);

  const currentPanel =
    playback?.mode === 'story' ? panels.find((panel) => panel.order === playback.order) : undefined;
  const storyStatus = !currentPanel
    ? null
    : currentPanel.mediaStatus === 'pending'
      ? `⏳ Waiting for panel ${currentPanel.order + 1}...`
      : `🔊 Panel ${currentPanel.order + 1} of ${panels.length}`;

  const characterNames = (ids: string[]) =>
    ids
      .map((id) => manifest.characters.find((c) => c.id === id)?.name)
      .filter((name): name is string => !!name);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={styles.page}
          onLayout={(event) => {
            pageY.current = event.nativeEvent.layout.y;
          }}
        >
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🎉</Text>
            <Text style={styles.title}>{title}</Text>
            {manifest.title && <Text style={styles.storyTitle}>“{manifest.title}”</Text>}
            {likes && (
              <TouchableOpacity
                style={[styles.likeButton, likes.likedByMe && styles.likeButtonActive]}
                onPress={onToggleLike}
                disabled={!onToggleLike}
                accessibilityRole="button"
                accessibilityState={{ selected: likes.likedByMe }}
                accessibilityLabel={likes.likedByMe ? 'Unlike this story' : 'Like this story'}
              >
                <Text style={styles.likeEmoji}>{likes.likedByMe ? '❤️' : '🤍'}</Text>
                <Text style={[styles.likeText, likes.likedByMe && styles.likeTextActive]}>
                  {likes.likedByMe ? 'Liked' : 'Like'} · {likes.count}
                </Text>
              </TouchableOpacity>
            )}
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

          <View
            style={styles.section}
            onLayout={(event) => {
              storyY.current = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.sectionTitle}>The story</Text>
            {panels.map((panel) => (
              <View
                key={panel.order}
                onLayout={(event) => {
                  panelY.current[panel.order] = event.nativeEvent.layout.y;
                }}
              >
                <ReviewPanelItem
                  panel={panel}
                  characterNames={characterNames(panel.characterIds)}
                  userId={userId}
                  reactionOptions={reactionOptions}
                  onReact={onReact}
                  playRequestId={playRequest?.order === panel.order ? playRequest.id : null}
                  onToggle={handlePanelToggle}
                  onEnded={handlePanelEnded}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {(hasNarration || onNewStory || onBack) && (
        <View style={styles.actions}>
          {hasNarration && (
            <View style={styles.storyPlayer}>
              <Text style={styles.storyPlayerText} numberOfLines={1}>
                {storyStatus ?? '🎧 Listen to the whole story'}
              </Text>
              {storyStatus ? (
                <Button
                  title="Stop"
                  icon="PauseIcon"
                  variant="outlined"
                  size="small"
                  onPress={stopStory}
                />
              ) : (
                <Button
                  title={storyPlayed ? 'Replay story' : 'Play story'}
                  icon={storyPlayed ? 'ArrowCounterClockwiseIcon' : 'PlayIcon'}
                  size="small"
                  onPress={playStory}
                />
              )}
            </View>
          )}
          {(onNewStory || onBack) && (
            <View style={styles.actionsPage}>
              {onNewStory && (
                <Button
                  title={creating ? 'Creating...' : 'New story'}
                  icon="BookOpenIcon"
                  onPress={onNewStory}
                  disabled={creating}
                  style={styles.actionButton}
                />
              )}
              {onBack && (
                <Button
                  title={backLabel}
                  variant="outlined"
                  onPress={onBack}
                  style={styles.actionButton}
                />
              )}
            </View>
          )}
        </View>
      )}
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
    storyTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
      textAlign: 'center',
    },
    likeButton: {
      marginTop: theme.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.full,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      backgroundColor: theme.color.surface,
    },
    likeButtonActive: {
      borderColor: theme.color.error,
      backgroundColor: theme.color.errorSubtle,
    },
    likeEmoji: {
      fontSize: theme.fontSize.lg,
    },
    likeText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    likeTextActive: {
      color: theme.color.error,
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
    storyPlayer: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    storyPlayerText: {
      flex: 1,
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
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
