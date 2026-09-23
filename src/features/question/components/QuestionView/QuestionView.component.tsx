import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuestionDto } from '@/features/question/types';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import { ContentView } from '../ContentView';

export interface QuestionViewProps {
  question: QuestionDto;
  questionNumber?: number;
  totalQuestions?: number;
  timeRemaining?: number;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return (
    <View style={styles.container}>
      {(questionNumber !== undefined || timeRemaining !== undefined) && (
        <View style={styles.header}>
          {questionNumber && totalQuestions && (
            <Text style={styles.questionNumber}>
              Question {questionNumber} of {totalQuestions}
            </Text>
          )}
          {timeRemaining !== undefined && (
            <Text style={[styles.timer, timeRemaining <= 10 && styles.timerWarning]}>
              ⏱️ {timeRemaining}s
            </Text>
          )}
        </View>
      )}

      {/* key por pregunta: al cambiar de pregunta se desmonta la media anterior
          (y se detiene su reproducción) aunque la URL se repita. */}
      <ContentView
        key={question.id}
        contentType={question.contentType}
        text={question.text}
        media={question.media}
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: isDesktop ? 640 : undefined,
      alignSelf: 'center',
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadow.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    questionNumber: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
    },
    timer: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.primary,
    },
    timerWarning: {
      color: theme.color.error,
    },
  });

export { QuestionView };
export default QuestionView;
