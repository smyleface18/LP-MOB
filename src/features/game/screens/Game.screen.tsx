import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGame } from '../hooks/useGame';
import Button from '@/shared/components/Button.component';
import GameLobby from './GameLobby.screen';
import GamePlay from './GamePlay.screen';
import GameMainMenu from './GameMainMenu.screen';
import GameResults from './GameResults.screen';
import { MatchStatus, ModeMatch } from '../types';
import { Level } from '@/shared/types/common';
import { colors } from '@/shared/ui/tokens';

const GameScreen: React.FC = () => {
  const { state, actions } = useGame();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.A1);
  const lastProcessedAnswerRef = React.useRef<string | null>(null);
  /** 🧠 Manejador cuando el usuario selecciona una opción */
  const handleOptionPress = useCallback(
    (optionId: string) => {
      if (selectedOption || state.timeRemaining <= 0 || !state.currentQuestion) return;

      setSelectedOption(optionId);
      // Enviar al servidor - el backend decidirá si es correcta
      actions.submitAnswer(optionId);
      // El resultado será recibido del backend via lastAnswerResult
    },
    [selectedOption, state.timeRemaining, state.currentQuestion, actions],
  );

  // Cuando recibimos la respuesta del backend - solo procesar una vez
  React.useEffect(() => {
    if (
      state.lastAnswerResult &&
      lastProcessedAnswerRef.current !== JSON.stringify(state.lastAnswerResult)
    ) {
      lastProcessedAnswerRef.current = JSON.stringify(state.lastAnswerResult);
      setIsCorrect(state.lastAnswerResult.isCorrect);
      setCorrectAnswer(state.lastAnswerResult.isCorrect ? 'Correct!' : 'Incorrect');
      setShowResult(true);
    }
  }, [state.lastAnswerResult]);

  /** ⏱ Cerrar modal */
  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    lastProcessedAnswerRef.current = null; // Reset para permitir mostrar otro resultado
  }, []);

  // Reiniciar selección y resultado al llegar nueva pregunta
  React.useEffect(() => {
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setCorrectAnswer('');
    lastProcessedAnswerRef.current = null; // Permitir procesar nueva respuesta
  }, [state.currentQuestion?.id]);

  /** 🧩 Estado de carga */
  if (!state.user.isConnected) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent.indigo} />
        <Text style={styles.loadingText}>Connecting to game server...</Text>
        <Text style={styles.userId}>Your ID: {state.user.userId}</Text>
        {state.error && <Text style={styles.errorText}>{state.error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        connected={state.user.isConnected}
        score={state.user.matchScore}
        roomId={state.roomId}
      />

      {/* Main Content */}
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
            correctAnswer={correctAnswer}
            selectedOption={selectedOption}
          />

          {/* Leave Button */}
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
        <GameResults players={state.players} onPlayAgain={actions.leaveRoom} />
      )}

      {state.error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{state.error}</Text>
        </View>
      )}

      {}
    </View>
  );
};

/* ---------------------- 🔹 COMPONENTES AUXILIARES ---------------------- */

const Header = ({
  connected,
  score,
  roomId,
}: {
  connected: boolean;
  score: number;
  roomId: string | null;
}) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>🎮 LinguaPlay</Text>
    <View style={styles.statusContainer}>
      <View style={[styles.statusIndicator, connected ? styles.connected : styles.disconnected]} />
      <Text style={styles.statusText}>{connected ? 'Connected' : 'Disconnected'}</Text>
      {roomId && <Text style={styles.roomId}>Room: {roomId}</Text>}
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  </View>
);

const CenteredContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.centered}>{children}</View>
);

/* --------------------------- 🎨 ESTILOS --------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connected: {
    backgroundColor: colors.status.online,
  },
  disconnected: {
    backgroundColor: colors.status.offline,
  },
  statusText: {
    fontSize: 12,
    color: colors.text.inverse,
    marginRight: 8,
  },
  roomId: {
    fontSize: 12,
    color: colors.text.inverse,
    fontWeight: '600',
    marginRight: 8,
  },
  score: {
    fontSize: 12,
    color: colors.text.inverse,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text.secondary,
  },
  userId: {
    marginTop: 6,
    fontSize: 12,
    color: colors.text.hint,
    fontFamily: 'monospace',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.status.offline,
    textAlign: 'center',
  },
  leaveContainer: {
    padding: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  leaveButton: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: colors.feedback.error.background,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.feedback.error.border,
  },
  errorBannerText: {
    color: colors.feedback.error.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GameScreen;
