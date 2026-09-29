import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Loading } from '@/shared/components/Loading';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { StoryProcessingEvent } from '../../types';

const PAGE_MAX_WIDTH = 480;

export interface StoryProcessingViewProps {
  /** Avance de la generación; null hasta que llega el primer `storyProcessing`. */
  processing: StoryProcessingEvent | null;
}

/**
 * Mientras el servidor narra y dibuja las viñetas. El review se abre apenas
 * la primera está lista: el resto sigue llegando mientras se lee.
 */
const StoryProcessingView: React.FC<StoryProcessingViewProps> = ({ processing }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const total = processing?.panelsTotal ?? 0;
  const done = processing?.panelsDone ?? 0;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <Loading size={80} />
        <Text style={styles.title}>Putting your story together...</Text>
        <Text style={styles.subtitle}>
          🎙️ Recording the narration{total > 0 ? ' and 🎨 drawing the panels' : ''}.
        </Text>
        {total > 0 && (
          <View style={styles.progress}>
            <ProgressBar percentage={percentage} label={`Panels ready: ${done} of ${total}`} />
          </View>
        )}
        <Text style={styles.hint}>The story opens as soon as the first panel is ready.</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.color.background,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    progress: {
      width: '100%',
    },
    hint: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
      textAlign: 'center',
    },
  });

export default StoryProcessingView;
