import { useTheme } from '@/app/providers/theme.provider';
import React, { useEffect, useMemo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

export interface ResultModalProps {
  visible: boolean;
  isCorrect: boolean;
  correctAnswer: string[];
  onClose: () => void;
  timeRemaining?: number;
}

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  isCorrect,
  correctAnswer,
  onClose,
  timeRemaining = 2000,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onClose();
    }, timeRemaining);

    return () => clearTimeout(timer);
  }, [visible, onClose, timeRemaining]);

  if (!visible) return null;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={() => {}}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.icon}>{isCorrect ? '🎉' : '❌'}</Text>

          <Text style={[styles.title, isCorrect ? styles.correctTitle : styles.incorrectTitle]}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </Text>

          <Text style={styles.answer}>
            {isCorrect
              ? 'Excellent answer!'
              : `The correct answer was: ${correctAnswer.join(', ')}`}
          </Text>

          <Text style={styles.timer}>Next question coming...</Text>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.color.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    },

    modalContent: {
      backgroundColor: theme.color.surfaceElevated,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      alignItems: 'center',
      maxWidth: 400,
      width: '100%',
    },

    icon: {
      fontSize: 60,
      marginBottom: theme.spacing.md,
    },

    title: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },

    correctTitle: {
      color: theme.color.success,
    },

    incorrectTitle: {
      color: theme.color.error,
    },

    answer: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      lineHeight: 22,
    },

    timer: {
      fontSize: theme.fontSize.md,
      color: theme.color.textPrimary,
      marginTop: theme.spacing.sm,
    },
  });

export { ResultModal };
