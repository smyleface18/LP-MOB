import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useGame } from "../hooks/useGame";
import Button from "../components/Button.component";
import OptionButton from "../components/OptionButton.component";
import ResultModal from "../components/ResultModal.component";
import QuestionView from "../components/QuestionView.component";

const GameScreen: React.FC = () => {
  const {
    connected,
    gameStarted,
    currentQuestion,
    questionNumber,
    totalQuestions,
    timeRemaining,
    score,
    userId,
    joinGame,
    startGame,
    stopGame,
    submitAnswer,
  } = useGame();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");

  /** 🧠 Manejador cuando el usuario selecciona una opción */
  const handleOptionPress = useCallback(
    (optionId: string) => {
      if (selectedOption || timeRemaining <= 0 || !currentQuestion) return;

      const correct = currentQuestion.options.find(
        (op) => op.id === optionId
      )?.isCorrect;
      setSelectedOption(optionId);
      setIsCorrect(correct!);
      setCorrectAnswer("oe");

      // Enviar al servidor
      submitAnswer(optionId, userId);

      // Mostrar feedback visual
      setShowResult(true);
    },
    [selectedOption, timeRemaining, currentQuestion, submitAnswer, userId]
  );

  /** ⏱ Cerrar modal y limpiar estado */
  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    setSelectedOption(null);
  }, []);

  /** 🎨 Determinar color/estilo de cada opción */
  const getOptionVariant = useCallback(
    (option: string) => {
      if (!selectedOption || !currentQuestion) return "default";
      if (option === currentQuestion.id) return "correct";
      if (option === selectedOption && option !== currentQuestion.id)
        return "incorrect";
      return "default";
    },
    [selectedOption, currentQuestion]
  );

  /** 🧩 Estado de carga */
  if (!connected) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Connecting to game server...</Text>
        <Text style={styles.userId}>Your ID: {userId}</Text>
      </CenteredContainer>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header connected={connected} score={score} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Estado inicial */}
        {!gameStarted && !currentQuestion && (
          <CenteredContainer>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.waitingText}>Waiting for game to start...</Text>
            <Text style={styles.userId}>Your ID: {userId}</Text>
          </CenteredContainer>
        )}

        {/* Pregunta actual */}
        {currentQuestion && (
          <>
            <QuestionView
              question={currentQuestion}
              questionNumber={questionNumber}
              totalQuestions={totalQuestions}
              timeRemaining={timeRemaining}
            />

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, i) => (
                <OptionButton
                  key={i}
                  option={option.text!}
                  variant={getOptionVariant(option.text!)}
                  disabled={!!selectedOption || timeRemaining <= 0}
                  onPress={() => handleOptionPress(option.id)}
                />
              ))}
            </View>
          </>
        )}

        {/* Mensaje entre preguntas */}
        {gameStarted && !currentQuestion && (
          <CenteredContainer>
            <Text style={styles.finishedTitle}>⏳ Next Question</Text>
            <Text style={styles.finishedText}>
              Get ready for the next challenge...
            </Text>
          </CenteredContainer>
        )}
      </ScrollView>

      {/* Controles */}
      <View style={styles.controls}>
        {!gameStarted ? (
          <>
            <Button
              title="Join Game"
              variant="primary"
              onPress={joinGame}
              style={styles.controlButton}
              disabled={!connected}
            />
            <Button
              title="Start Game"
              variant="secondary"
              onPress={startGame}
              style={styles.controlButton}
              disabled={!connected}
            />
          </>
        ) : (
          <Button
            title="Stop Game"
            variant="outlined"
            onPress={stopGame}
            style={styles.controlButton}
          />
        )}
      </View>

      {/* Modal de resultado */}
      <ResultModal
        visible={showResult}
        isCorrect={isCorrect}
        correctAnswer={correctAnswer}
        timeRemaining={1000} // Se cierra automáticamente en 1s
        onClose={handleCloseResult}
      />
    </View>
  );
};

/* ---------------------- 🔹 COMPONENTES AUXILIARES ---------------------- */

const Header = ({
  connected,
  score,
}: {
  connected: boolean;
  score: number;
}) => (
  <View style={styles.header}>
    <Text style={styles.title}>🎮 LinguaPlay Trivia</Text>
    <View style={styles.statusContainer}>
      <View
        style={[
          styles.statusIndicator,
          connected ? styles.connected : styles.disconnected,
        ]}
      />
      <Text style={styles.statusText}>
        {connected ? "Connected" : "Disconnected"}
      </Text>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  </View>
);

const CenteredContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <View style={styles.centered}>{children}</View>;

/* --------------------------- 🎨 ESTILOS --------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  userId: { marginTop: 5, fontSize: 12, color: "#999", textAlign: "center" },
  header: {
    backgroundColor: "#667eea",
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
  connected: { backgroundColor: "#4ade80" },
  disconnected: { backgroundColor: "#ef4444" },
  statusText: { color: "#FFF", fontSize: 14, flex: 1, marginLeft: 8 },
  score: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  content: { flex: 1 },
  scrollContent: { padding: 20 },
  waitingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  optionsContainer: { marginTop: 10 },
  finishedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 10,
  },
  finishedText: { fontSize: 16, color: "#666", textAlign: "center" },
  controls: {
    padding: 20,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    gap: 10,
  },
  controlButton: { flex: 1 },
});

export default GameScreen;
