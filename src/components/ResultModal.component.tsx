// components/ResultModal.component.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Button from './Button.component';

interface ResultModalProps {
  visible: boolean;
  isCorrect: boolean;
  correctAnswer?: string;
  timeRemaining?: number; // tiempo restante para la siguiente pregunta en segundos
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  isCorrect,
  correctAnswer,
  timeRemaining,
  onClose
}) => {
  const [counter, setCounter] = useState(timeRemaining ?? 0);

  useEffect(() => {
    if (!visible || !timeRemaining) return;

    setCounter(timeRemaining);

    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose(); // cerrar automáticamente
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, timeRemaining, onClose]);

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

          {timeRemaining && (
            <Text style={styles.timer}>
              Next question in {counter} {counter === 1 ? 'second' : 'seconds'}...
            </Text>
          )}

          <Button
            title="Continue"
            variant="primary"
            onPress={onClose}
            style={styles.button}
            disabled={counter > 0} // bloquea botón hasta que pase el tiempo
          />
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
  timer: { fontSize: 16, color: '#334155', marginBottom: 20 },
  button: { width: '100%' },
});

export default ResultModal;
