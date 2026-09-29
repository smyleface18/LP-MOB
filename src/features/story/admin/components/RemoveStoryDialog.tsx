import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import Button from '@/shared/components/Button/Button.component';
import Input from '@/shared/components/Input/Input.component';
import { FilterChip } from '@/shared/components/FilterChip';
import {
  REMOVAL_NOTE_MAX_CHARS,
  REMOVAL_REASON_LABELS,
  RemoveStoryInput,
  StoryRemovalReason,
} from '../types';

export interface RemoveStoryDialogProps {
  visible: boolean;
  /** Título (o código) de la historieta, para que el admin sepa cuál quita. */
  storyLabel: string;
  submitting: boolean;
  /** Error de la API al quitar; se muestra dentro del diálogo. */
  error: string | null;
  onConfirm: (input: RemoveStoryInput) => void;
  onCancel: () => void;
}

/**
 * Confirmación para quitar una historieta: el admin elige el motivo y puede
 * dejar una nota (obligatoria con "Otro motivo"). Es un Modal propio y no
 * Alert.alert, que en web no muestra nada (ver ConfirmDialog).
 */
const RemoveStoryDialog: React.FC<RemoveStoryDialogProps> = ({
  visible,
  storyLabel,
  submitting,
  error,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [reason, setReason] = useState<StoryRemovalReason | null>(null);
  const [note, setNote] = useState('');

  // Cada vez que se abre, empieza vacío.
  useEffect(() => {
    if (visible) {
      setReason(null);
      setNote('');
    }
  }, [visible]);

  const noteRequired = reason === StoryRemovalReason.OTHER;
  const canConfirm = !!reason && (!noteRequired || !!note.trim()) && !submitting;

  const handleConfirm = () => {
    if (!reason || !canConfirm) return;
    onConfirm({ reason, ...(note.trim() ? { note: note.trim() } : {}) });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Quitar historieta</Text>
          <Text style={styles.message}>
            «{storyLabel}» dejará de verse en el catálogo y en el historial de sus jugadores. El
            registro queda guardado para auditoría.
          </Text>

          <Text style={styles.label}>Motivo</Text>
          <View style={styles.reasons}>
            {Object.values(StoryRemovalReason).map((value) => (
              <FilterChip
                key={value}
                label={REMOVAL_REASON_LABELS[value]}
                isActive={reason === value}
                onPress={() => setReason(value)}
              />
            ))}
          </View>

          <Text style={styles.label}>Nota {noteRequired ? '(obligatoria)' : '(opcional)'}</Text>
          <Input
            variant="outlined"
            placeholder="Qué encontraste y por qué la quitas"
            value={note}
            onChangeText={setNote}
            maxLength={REMOVAL_NOTE_MAX_CHARS}
            multiline
            style={styles.note}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={onCancel}
              disabled={submitting}
              style={styles.button}
            />
            <Button
              title={submitting ? 'Quitando...' : 'Quitar historieta'}
              variant="outlined"
              icon="TrashIcon"
              onPress={handleConfirm}
              disabled={!canConfirm}
              style={[styles.button, styles.destructiveButton]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.color.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 480,
      backgroundColor: theme.color.surfaceElevated,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      gap: theme.spacing.sm,
      ...theme.shadow.sm,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    message: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      lineHeight: theme.fontSize.md * theme.lineHeight.md,
    },
    label: {
      marginTop: theme.spacing.sm,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    reasons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    note: {
      height: 96,
      paddingTop: theme.spacing.sm,
      textAlignVertical: 'top',
    },
    error: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textError,
    },
    actions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    button: {
      flex: 1,
    },
    destructiveButton: {
      borderColor: theme.color.error,
    },
  });

export default RemoveStoryDialog;
