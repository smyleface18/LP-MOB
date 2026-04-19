import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import QuestionView from '@/features/question/components/QuestionView.component';
import OptionButton from '@/shared/components/OptionButton.component';
import ResultModal from '@/shared/components/ResultModal.component';
import { Question } from '@/features/question/types';

interface GamePlayProps {
  currentQuestion: Question | null;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  score: number;
  onOptionPress: (optionId: string) => void;
  onModalClose: () => void;
  showResult: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  selectedOption: string | null;
}

const GamePlay: React.FC<GamePlayProps> = ({
  currentQuestion,
  questionNumber,
  totalQuestions,
  timeRemaining,
  score,
  onOptionPress,
  onModalClose,
  showResult,
  isCorrect,
  correctAnswer,
  selectedOption,
}) => {
  const getOptionVariant = useCallback(
    (optionId: string): 'default' | 'correct' | 'incorrect' => {
      if (!selectedOption) return 'default';
      if (optionId === selectedOption) return isCorrect ? 'correct' : 'incorrect';
      return 'default';
    },
    [selectedOption, isCorrect],
  );

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>⏳ Loading next question...</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Score Header */}
        <View style={styles.scoreBar}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.questionCounter}>
            {questionNumber}/{totalQuestions}
          </Text>
        </View>

        {/* Question */}
        <QuestionView
          question={currentQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          timeRemaining={timeRemaining}
        />

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, i) => (
            <OptionButton
              key={option.id ?? i}
              option={option.text?.trim() || `Option ${i + 1}`}
              variant={getOptionVariant(option.id)}
              disabled={!!selectedOption || timeRemaining <= 0}
              onPress={() => onOptionPress(option.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Result Modal */}
      <ResultModal
        visible={showResult}
        isCorrect={isCorrect}
        correctAnswer={correctAnswer}
        timeRemaining={1000}
        onClose={onModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  questionCounter: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 16,
  },
  score: {
    fontSize: 16,
    color: '#64748b',
  },
});

export default GamePlay;
