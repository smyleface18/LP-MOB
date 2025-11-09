// components/QuestionCard.component.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { GameQuestion, Question } from '../types/type';

interface QuestionCardProps {
  question: GameQuestion
  questionNumber?: number;
  totalQuestions?: number;
  timeRemaining?: number;
}

const QuestionView: React.FC<QuestionCardProps> = ({ 
  question, 
  questionNumber,
  totalQuestions,
  timeRemaining 
}) => {
  return (
    <View style={styles.container}>
      {/* Header con número de pregunta y timer */}
      {(questionNumber !== undefined || timeRemaining !== undefined) && (
        <View style={styles.header}>
          {questionNumber && totalQuestions && (
            <Text style={styles.questionNumber}>
              Question {questionNumber} of {totalQuestions}
            </Text>
          )}
          {timeRemaining !== undefined && (
            <Text style={[
              styles.timer,
              timeRemaining <= 10 && styles.timerWarning
            ]}>
              ⏱️ {timeRemaining}s
            </Text>
          )}
        </View>
      )}

      {/* Imagen de la pregunta */}
      {question.questionImage && (
        <Image 
          source={{ uri: question.questionImage }} 
          style={styles.questionImage}
          resizeMode="contain"
        />
      )}

      {/* Texto de la pregunta */}
      {question.questionText && (
        <Text style={styles.questionText}>
          {question.questionText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  timerWarning: {
    color: '#ef4444',
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default QuestionView;