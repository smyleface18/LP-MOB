// components/ResultModal.component.tsx
import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';

interface ResultModalProps {
  visible: boolean;
  isCorrect: boolean;
  correctAnswer?: string;
  onClose: () => void;
    timeRemaining: number
}


const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  isCorrect,
  correctAnswer,
  onClose,
  timeRemaining = 2000
}) => {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onClose(); // cerrar automáticamente después de 2s
    }, timeRemaining);

    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.icon}>{isCorrect ? '🎉' : '❌'}</Text>

          <Text style={[styles.title, isCorrect ? styles.correctTitle : styles.incorrectTitle]}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </Text>

          <Text style={styles.answer}>
            {isCorrect ? 'Excellent answer!' : `The correct answer was: ${correctAnswer}`}
          </Text>

          <Text style={styles.timer}>Next question coming...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  icon: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  correctTitle: { color: '#10b981' },
  incorrectTitle: { color: '#ef4444' },
  answer: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 15, lineHeight: 22 },
  timer: { fontSize: 16, color: '#334155', marginTop: 10 },
});

export default ResultModal;
