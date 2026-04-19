import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGame } from '../hooks/useGame';
import Button from '@/shared/components/Button.component';
import GameLobby from './GameLobby.screen';
import GamePlay from './GamePlay.screen';
import { Level, ModeMatch } from '@/shared/types/Type';
import GameMainMenu from './GameMainMenu.screen';

const GameScreen: React.FC = () => {
  const {
    connected,
    roomId,
    level,
    mode,
    gameStarted,
    currentQuestion,
    questionNumber,
    totalQuestions,
    timeRemaining,
    score,
    user,
    players,
    error,
    lastAnswerResult,
    createGame,
    joinGame,
    startGame,
    leaveRoom,
    submitAnswer,
  } = useGame();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.A1);
  const lastProcessedAnswerRef = React.useRef<string | null>(null);

  /** 🧠 Manejador cuando el usuario selecciona una opción */
  const handleOptionPress = useCallback(
    (optionId: string) => {
      if (selectedOption || timeRemaining <= 0 || !currentQuestion) return;

      setSelectedOption(optionId);
      // Enviar al servidor - el backend decidirá si es correcta
      submitAnswer(optionId);
      // El resultado será recibido del backend via lastAnswerResult
    },
    [selectedOption, timeRemaining, currentQuestion, submitAnswer],
  );

  // Cuando recibimos la respuesta del backend - solo procesar una vez
  React.useEffect(() => {
    if (lastAnswerResult && lastProcessedAnswerRef.current !== JSON.stringify(lastAnswerResult)) {
      lastProcessedAnswerRef.current = JSON.stringify(lastAnswerResult);
      setIsCorrect(lastAnswerResult.correct);
      setCorrectAnswer(lastAnswerResult.correct ? 'Correct!' : 'Incorrect');
      setShowResult(true);
    }
  }, [lastAnswerResult]);

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
  }, [currentQuestion?.id]);

  /** 🧩 Estado de carga */
  if (!connected) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Connecting to game server...</Text>
        <Text style={styles.userId}>Your ID: {user?.id}</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header connected={connected} score={score} roomId={roomId} />

      {/* Main Content */}
      {!roomId && !gameStarted && (
        <GameMainMenu
          selectedLevel={selectedLevel}
          onLevelSelect={setSelectedLevel}
          onCreateSinglePlayer={() => createGame(selectedLevel, ModeMatch.SINGLEPLAYER)}
          onCreateMultiplayer={() => createGame(selectedLevel, ModeMatch.MULTIPLAYER)}
          onJoinGame={joinGame}
        />
      )}

      {roomId && !gameStarted && (
        <GameLobby
          roomId={roomId}
          level={level}
          mode={mode}
          players={players}
          userId={user?.id || ''}
          onStartGame={startGame}
          onLeaveRoom={leaveRoom}
        />
      )}

      {gameStarted && (
        <>
          <GamePlay
            currentQuestion={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            timeRemaining={timeRemaining}
            score={score}
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
              onPress={leaveRoom}
              style={styles.leaveButton}
            />
          </View>
        </>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
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
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
    backgroundColor: '#10b981',
  },
  disconnected: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    marginRight: 8,
  },
  roomId: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    marginRight: 8,
  },
  score: {
    fontSize: 12,
    color: '#ffffff',
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
    color: '#666',
  },
  userId: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  leaveContainer: {
    padding: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  leaveButton: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  errorBannerText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GameScreen;
