import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import QuestionView from '@/features/question/components/QuestionView.component';
import { OptionButton } from '@/shared/components/OptionButton/OptionButton.component';
import { ResultModal } from '@/shared/components/ResultModal/ResultModal.component';
import { QuestionDto } from '@/features/question/types';
import { useTheme } from '@/app/providers/theme.provider';

const PAGE_MAX_WIDTH = 640;

interface GamePlayProps {
  currentQuestion: QuestionDto | null;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  score: number;
  onOptionPress: (optionId: string) => void;
  onModalClose: () => void;
  showResult: boolean;
  isCorrect: boolean;
  correctAnswer: string[];
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
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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
        <View style={styles.page}>
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
                option={option.content.value?.trim() || `Option ${i + 1}`}
                variant={getOptionVariant(option.id)}
                disabled={!!selectedOption || timeRemaining <= 0}
                onPress={() => onOptionPress(option.id)}
              />
            ))}
          </View>
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

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    scoreBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.md,
    },
    scoreText: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    questionCounter: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    optionsContainer: {
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.background,
    },
    loadingTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.heading,
      color: theme.color.primary,
      marginBottom: theme.spacing.md,
    },
    score: {
      fontSize: theme.fontSize.lg,
      color: theme.color.textSecondary,
    },
  });

export default GamePlay;
