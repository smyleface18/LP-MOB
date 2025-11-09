import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useGame } from '../hooks/useGame';
import Button from '../components/Button.component';
import QuestionCard from '../components/QuestionCard.component';
import OptionButton from '../components/OptionButton.component';
import ResultModal from '../components/ResultModal.component';
import QuestionView from '../components/QuestionView.component';

const GameScreen = () => {
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
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleOptionPress = (option: string) => {
    if (selectedOption || timeRemaining <= 0 || !currentQuestion) return;

    setSelectedOption(option);
    
    // Verificar respuesta localmente para feedback inmediato
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setCorrectAnswer(currentQuestion.correctAnswer);
    
    // Enviar respuesta al servidor
    submitAnswer(option);
    
    // Mostrar resultado
    setShowResult(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setSelectedOption(null);
  };

  const getOptionVariant = (option: string) => {
    if (!selectedOption || !currentQuestion) return 'default';
    
    if (option === currentQuestion.correctAnswer) return 'correct';
    if (option === selectedOption && option !== currentQuestion.correctAnswer) return 'incorrect';
    return 'default';
  };

  if (!connected) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0000ff" />
        <Text style={styles.loadingText}>Connecting to game server...</Text>
        <Text style={styles.userId}>Your ID: {userId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎮 LinguaPlay Trivia</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            connected ? styles.connected : styles.disconnected
          ]} />
          <Text style={styles.statusText}>
            {connected ? 'Connected' : 'Disconnected'}
          </Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Estado de espera */}
        {!gameStarted && !currentQuestion && (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.waitingText}>
              Waiting for game to start...
            </Text>
            <Text style={styles.userId}>Your ID: {userId}</Text>
          </View>
        )}

        {/* Pregunta actual */}
        {currentQuestion && (
          <QuestionView
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            timeRemaining={timeRemaining}
          />
        )}

        {/* Opciones de respuesta */}
        {currentQuestion && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={index}
                option={option}
                variant={getOptionVariant(option)}
                disabled={selectedOption !== null || timeRemaining <= 0}
                onPress={() => handleOptionPress(option)}
              />
            ))}
          </View>
        )}

        {/* Mensaje entre preguntas */}
        {gameStarted && !currentQuestion && (
          <View style={styles.finishedContainer}>
            <Text style={styles.finishedTitle}>⏳ Next Question</Text>
            <Text style={styles.finishedText}>
              Get ready for the next question...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Controles del juego */}
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
        onClose={handleCloseResult}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  userId: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connected: {
    backgroundColor: '#4ade80',
  },
  disconnected: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  score: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  waitingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  waitingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  finishedContainer: {
    alignItems: 'center',
    padding: 40,
  },
  finishedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  finishedText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  controls: {
    padding: 20,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    flex: 1,
  },
});

export default GameScreen;