import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import { useAuthState } from '@/store';
import type { StoryListStackParamList } from '@/app/navigation/storyListRoutes';
import StoryHeader from '../../components/StoryHeader';
import { useStoryHistoryDetail } from '../../hooks/useStoryHistory';
import StoryReviewView from '../Story/StoryReview.view';

/**
 * Una historieta del historial o del catálogo: el mismo review del final de la
 * partida (sin botón de historieta nueva). Se puede reaccionar a cada viñeta y
 * dar like a la historieta completa; ambos se guardan. Se vuelve con la flecha
 * de la cabecera.
 */
const StoryHistoryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<StoryListStackParamList, 'StoryHistoryDetail'>>();
  const { user } = useAuthState();
  const source = params.source ?? 'history';
  const userId = user?.id ?? '';
  const { manifest, loading, error, reload, react, toggleLike, actionError } =
    useStoryHistoryDetail(params.storyId, source, userId);
  const backLabel = source === 'catalog' ? 'Back to explore' : 'Back to my stories';
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <StoryHeader title="📖 Story" onBack={() => navigation.goBack()} backLabel={backLabel} />
      {manifest ? (
        <>
          {actionError && <Text style={styles.actionError}>{actionError}</Text>}
          <StoryReviewView
            manifest={manifest}
            userId={userId}
            reactionOptions={manifest.reactionOptions}
            onReact={(order, emoji) => void react(order, emoji)}
            likes={manifest.likes}
            onToggleLike={() => void toggleLike()}
            title="Read it again!"
          />
        </>
      ) : (
        <View style={styles.center}>
          {loading ? (
            <Loading size={64} />
          ) : (
            <>
              <Text style={styles.error}>{error ?? 'Could not load the story'}</Text>
              <Button
                title="Try again"
                variant="outlined"
                icon="ArrowCounterClockwiseIcon"
                onPress={() => void reload()}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    error: {
      fontSize: theme.fontSize.md,
      color: theme.color.textError,
      textAlign: 'center',
    },
    actionError: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.fontSize.sm,
      color: theme.color.textError,
      textAlign: 'center',
    },
  });

export default StoryHistoryDetailScreen;
