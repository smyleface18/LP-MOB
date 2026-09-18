import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useGame } from '../../hooks/useGame';
import Button from '@/shared/components/Button/Button.component';
import { useAnswerFeedback } from './useAnswerFeedback';
import GameLobby from './GameLobby.view';
import GamePlay from './GamePlay.view';
import GameMainMenu from './GameMainMenu.view';
import GameResults from './GameResults.view';
import { MatchStatus, ModeMatch } from '../../types';
import { Level } from '@/shared/types/common';

const GameScreen: React.FC = () => {
  const { state, actions } = useGame();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedLevel, setSelectedLevel] = React.useState<Level>(Level.A1);

  const { selectedOption, showResult, isCorrect, correctAnswerText, handleOptionPress, handleCloseResult } =
    useAnswerFeedback({
      timeRemaining: state.timeRemaining,
      currentQuestionId: state.currentQuestion?.id,
      lastAnswerResult: state.lastAnswerResult,
      onSubmit: actions.submitAnswer,
    });

  if (!state.user.isConnected) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.color.primary} />
        <Text style={styles.loadingText}>Connecting to game server...</Text>
        <Text style={styles.userId}>Your ID: {state.user.userId}</Text>
        {state.error && <Text style={styles.errorText}>{state.error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GameHeader connected={state.user.isConnected} score={state.user.matchScore} roomId={state.roomId} />

      {!state.roomId && !state.status && (
        <GameMainMenu
          selectedLevel={selectedLevel}
          onLevelSelect={setSelectedLevel}
          onCreateSinglePlayer={() => actions.createGame(selectedLevel, ModeMatch.SINGLEPLAYER)}
          onCreateMultiplayer={() => actions.createGame(selectedLevel, ModeMatch.MULTIPLAYER)}
          onJoinGame={actions.joinGame}
        />
      )}

      {state.roomId && state.status === MatchStatus.WAITING && (
        <GameLobby
          roomId={state.roomId}
          level={state.level}
          mode={state.modeMatch}
          players={state.players}
          user={state.user}
          onStartGame={actions.startGame}
          onLeaveRoom={actions.leaveRoom}
        />
      )}

      {state.status === MatchStatus.STARTING && (
        <>
          <GamePlay
            currentQuestion={state.currentQuestion}
            questionNumber={state.questionNumber}
            totalQuestions={state.totalQuestions}
            timeRemaining={state.timeRemaining}
            score={state.user.matchScore}
            onOptionPress={handleOptionPress}
            onModalClose={handleCloseResult}
            showResult={showResult}
            isCorrect={isCorrect}
            correctAnswer={correctAnswerText}
            selectedOption={selectedOption}
          />

          <View style={styles.leaveContainer}>
            <Button
              title="Leave Game"
              variant="outlined"
              onPress={actions.leaveRoom}
              style={styles.leaveButton}
            />
          </View>
        </>
      )}

      {state.status === MatchStatus.FINISHED && (
        <GameResults
          players={state.players}
          isMultiplayer={state.modeMatch === ModeMatch.MULTIPLAYER}
          onPlayAgain={
            state.modeMatch === ModeMatch.MULTIPLAYER ? actions.requestRematch : actions.playAgain
          }
        />
      )}

      {state.error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{state.error}</Text>
        </View>
      )}
    </View>
  );
};

const GameHeader: React.FC<{ connected: boolean; score: number; roomId: string | null }> = ({
  connected,
  score,
  roomId,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>🎮 LinguaPlay</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: connected ? theme.color.success : theme.color.error }]} />
        <Text style={styles.statusText}>{connected ? 'Connected' : 'Disconnected'}</Text>
        {roomId && <Text style={styles.roomId}>Room: {roomId}</Text>}
        <Text style={styles.score}>Score: {score}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.background,
      padding: theme.spacing.lg,
    },
    header: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.color.secondary,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.onSecondary,
      marginBottom: theme.spacing.sm,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: theme.radius.full,
      marginRight: theme.spacing.xs,
    },
    statusText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.onSecondary,
      marginRight: theme.spacing.sm,
    },
    roomId: {
      fontSize: theme.fontSize.sm,
      color: theme.color.onSecondary,
      fontFamily: theme.fontFamily.bodyBold,
      marginRight: theme.spacing.sm,
    },
    score: {
      fontSize: theme.fontSize.sm,
      color: theme.color.onSecondary,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSize.lg,
      color: theme.color.textSecondary,
    },
    userId: {
      marginTop: theme.spacing.xs,
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
      fontFamily: 'monospace',
    },
    errorText: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSize.sm,
      color: theme.color.error,
      textAlign: 'center',
    },
    leaveContainer: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      borderTopWidth: theme.borderWidth.xs,
      borderTopColor: theme.color.border,
    },
    leaveButton: {
      width: '100%',
    },
    errorBanner: {
      backgroundColor: theme.color.errorSubtle,
      padding: theme.spacing.md,
      borderTopWidth: theme.borderWidth.xs,
      borderTopColor: theme.color.error,
    },
    errorBannerText: {
      color: theme.color.textError,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      textAlign: 'center',
    },
  });

export default GameScreen;
