import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { Loading } from '@/shared/components/Loading';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import StoryHeader, { StoryHeaderChip } from '../../components/StoryHeader';
import { useStoryGame } from '../../hooks/useStoryGame';
import { StoryStatus } from '../../types';
import { useStoryDraft } from './useStoryDraft';
import StoryMenuView from './StoryMenu.view';
import StoryLobbyView from './StoryLobby.view';
import StoryTurnView from './StoryTurn.view';
import StoryReviewView from './StoryReview.view';
import StoryProcessingView from './StoryProcessing.view';

/** Emojis por defecto si todavía no llegaron las reglas del servidor. */
const DEFAULT_REACTIONS = ['👏', '😂', '😮', '❤️', '🔥'];

const StoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, actions } = useStoryGame();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const editor = useStoryDraft({
    turnOrder: state.turn?.panelOrder ?? null,
    myTurn: state.myTurn,
    cast: state.cast,
    rules: state.rules,
    lastReview: state.lastReview,
    pending: state.pending,
    timeLeft: state.timeLeft,
    submitDraft: actions.submitDraft,
    confirmPanel: actions.confirmPanel,
  });

  const { lobby, manifest } = state;
  const status = lobby?.status ?? null;
  const inGame = status === StoryStatus.LOBBY || status === StoryStatus.PLAYING;
  const reactionOptions = state.rules?.reactions ?? DEFAULT_REACTIONS;
  const myScore = state.scoreboard.find((entry) => entry.userId === state.userId)?.totalScore ?? 0;

  const handleLeave = () => {
    setConfirmLeave(false);
    void actions.leaveGame();
  };

  const renderBody = () => {
    if (!state.connected && !lobby && !manifest) {
      return (
        <View style={styles.center}>
          <Loading size={80} />
          <Text style={styles.centerText}>Connecting to the story server...</Text>
        </View>
      );
    }

    if (manifest) {
      return (
        <StoryReviewView
          manifest={manifest}
          userId={state.userId}
          reactionOptions={reactionOptions}
          onReact={actions.reactToPanel}
          creating={state.pending === 'create'}
          onNewStory={actions.createGame}
          onBack={actions.backToMenu}
          autoPlay
        />
      );
    }

    if (!lobby) {
      return (
        <StoryMenuView
          creating={state.pending === 'create'}
          joining={state.pending === 'join'}
          onCreate={actions.createGame}
          onJoin={actions.joinGame}
        />
      );
    }

    if (status === StoryStatus.LOBBY) {
      return (
        <StoryLobbyView
          lobby={lobby}
          userId={state.userId}
          isHost={state.isHost}
          rules={state.rules}
          pending={state.pending}
          onUpdateConfig={actions.updateConfig}
          onKick={actions.kickPlayer}
          onStart={actions.startStory}
          onLeave={actions.leaveGame}
        />
      );
    }

    if (status === StoryStatus.PLAYING) {
      return (
        <StoryTurnView
          turn={state.turn}
          panelsCount={lobby.config.panelsCount}
          turnDurationSec={lobby.config.turnDurationSec}
          timeLeft={state.timeLeft}
          isAuthor={state.isAuthor}
          author={state.author}
          players={lobby.players}
          storySoFar={state.storySoFar}
          cast={state.cast}
          userId={state.userId}
          reactionOptions={reactionOptions}
          onReact={actions.reactToPanel}
          sharedDraft={state.sharedDraft}
          shareDrafts={lobby.config.shareDrafts}
          lastConfirmed={state.lastConfirmed}
          editor={state.isAuthor ? editor : null}
        />
      );
    }

    // PROCESSING, o REVIEW/FINISHED mientras llega el manifiesto.
    return <StoryProcessingView processing={state.processing} />;
  };

  const message = state.error ?? state.notice;

  return (
    <View style={styles.container}>
      <StoryHeader
        title="📖 Story Mode"
        onBack={!inGame && navigation.canGoBack() ? () => navigation.goBack() : undefined}
        backLabel="Back to the arena"
        onExit={inGame ? () => setConfirmLeave(true) : undefined}
      >
        <StoryHeaderChip
          label={state.connected ? 'Connected' : 'Reconnecting...'}
          dotColor={state.connected ? theme.color.success : theme.color.error}
        />
        {lobby && inGame && <StoryHeaderChip label={lobby.gameId} />}
        {status === StoryStatus.PLAYING && <StoryHeaderChip label={`Score: ${myScore}`} />}
      </StoryHeader>

      {renderBody()}

      {message && (
        <TouchableOpacity
          style={[styles.banner, state.error ? styles.bannerError : styles.bannerNotice]}
          onPress={actions.dismissMessage}
          accessibilityRole="button"
          accessibilityHint="Dismiss the message"
        >
          <Text style={[styles.bannerText, state.error && styles.bannerTextError]}>{message}</Text>
        </TouchableOpacity>
      )}

      <ConfirmDialog
        visible={confirmLeave}
        title="Leave the story?"
        message={
          status === StoryStatus.PLAYING
            ? 'You will not be able to come back, and your next panels will go to the other players.'
            : 'You will leave the lobby.'
        }
        confirmLabel="Leave"
        cancelLabel="Stay"
        destructive
        onConfirm={handleLeave}
        onCancel={() => setConfirmLeave(false)}
      />
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
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    centerText: {
      fontSize: theme.fontSize.lg,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    banner: {
      padding: theme.spacing.md,
      borderTopWidth: theme.borderWidth.xs,
    },
    bannerError: {
      backgroundColor: theme.color.errorSubtle,
      borderTopColor: theme.color.error,
    },
    bannerNotice: {
      backgroundColor: theme.color.surface,
      borderTopColor: theme.color.border,
    },
    bannerText: {
      color: theme.color.textPrimary,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      textAlign: 'center',
    },
    bannerTextError: {
      color: theme.color.textError,
    },
  });

export default StoryScreen;
