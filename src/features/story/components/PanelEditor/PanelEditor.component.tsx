import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import Button from '@/shared/components/Button/Button.component';
import Input from '@/shared/components/Input/Input.component';
import CharacterPicker, {
  CharacterPickerLimits,
} from '../CharacterPicker/CharacterPicker.component';
import CorrectionList from '../CorrectionList';
import { CharacterSheet, PanelReviewResult, StoryCharacter } from '../../types';

export interface PanelEditorProps {
  text: string;
  scene: string;
  characterIds: string[];
  newCharacters: CharacterSheet[];
  cast: StoryCharacter[];
  limits: {
    minWords: number;
    maxChars: number;
    maxSceneChars: number;
    characters: CharacterPickerLimits;
  };
  onTextChange: (value: string) => void;
  onSceneChange: (value: string) => void;
  onToggleCharacter: (characterId: string) => void;
  onAddCharacter: (character: CharacterSheet) => void;
  onRemoveCharacter: (index: number) => void;
  /** Resultado de la última revisión de la IA. */
  lastReview: PanelReviewResult | null;
  attemptsLeft: number;
  /** Ya hay al menos un borrador guardado: se puede confirmar. */
  hasDraft: boolean;
  /** El texto cambió desde el último borrador revisado. */
  isDirty: boolean;
  /** La IA está revisando el borrador. */
  reviewing: boolean;
  confirming: boolean;
  /** Por qué todavía no se puede enviar a revisión (ej. faltan palabras). */
  validationError: string | null;
  wordCount: number;
  timeUp: boolean;
  onSubmit: () => void;
  onConfirm: () => void;
}

/**
 * Editor de la viñeta del autor: escenario, texto, personajes, revisión con
 * IA (hasta `attemptsLeft` veces) y confirmación. Confirmar usa el último
 * borrador revisado, no lo que está escrito si cambió después.
 */
const PanelEditor: React.FC<PanelEditorProps> = ({
  text,
  scene,
  characterIds,
  newCharacters,
  cast,
  limits,
  onTextChange,
  onSceneChange,
  onToggleCharacter,
  onAddCharacter,
  onRemoveCharacter,
  lastReview,
  attemptsLeft,
  hasDraft,
  isDirty,
  reviewing,
  confirming,
  validationError,
  wordCount,
  timeUp,
  onSubmit,
  onConfirm,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const locked = reviewing || confirming || timeUp;
  // Sin intentos solo se puede confirmar; con la IA caída no se consumen.
  const canSubmit = !locked && !validationError && attemptsLeft > 0 && (isDirty || !hasDraft);
  const canConfirm = !locked && hasDraft;

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Scene</Text>
        <Input
          variant="outlined"
          placeholder="Where does it happen? (e.g. a dark forest at night)"
          value={scene}
          onChangeText={onSceneChange}
          maxLength={limits.maxSceneChars}
          editable={!locked}
        />
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Your panel (in English)</Text>
          <Text style={[styles.counter, wordCount < limits.minWords && styles.counterWarning]}>
            {wordCount}/{limits.minWords}+ words · {text.length}/{limits.maxChars}
          </Text>
        </View>
        <Input
          variant="outlined"
          placeholder="What happens next in the story?"
          value={text}
          onChangeText={onTextChange}
          maxLength={limits.maxChars}
          multiline
          textAlignVertical="top"
          style={styles.textArea}
          editable={!locked}
        />
      </View>

      <CharacterPicker
        cast={cast}
        selectedIds={characterIds}
        onToggle={onToggleCharacter}
        newCharacters={newCharacters}
        onAddNew={onAddCharacter}
        onRemoveNew={onRemoveCharacter}
        limits={limits.characters}
        disabled={locked}
      />

      {lastReview && (
        <View style={styles.review}>
          <Text style={styles.reviewTitle}>
            {lastReview.flagged
              ? '🚫 That panel was not accepted'
              : !lastReview.reviewAvailable
                ? '⚠️ The English check is not available right now'
                : '🧑‍🏫 English check'}
          </Text>
          {lastReview.flagged ? (
            <Text style={styles.reviewText}>
              {lastReview.message ?? 'Please keep the story friendly and try again.'}
            </Text>
          ) : lastReview.reviewAvailable ? (
            <CorrectionList
              corrections={lastReview.corrections}
              characterCorrections={lastReview.characterCorrections}
              newCharacterNames={newCharacters.map((c) => c.name)}
              emptyText="Perfect! No mistakes."
            />
          ) : (
            <Text style={styles.reviewText}>
              Your panel was saved without a review. You can confirm it.
            </Text>
          )}
        </View>
      )}

      {validationError && (isDirty || !hasDraft) && (
        <Text style={styles.hint}>{validationError}</Text>
      )}
      {hasDraft && isDirty && (
        <Text style={styles.hint}>
          {attemptsLeft > 0
            ? 'You changed your panel: check it again, or confirm your last checked version.'
            : 'No checks left: confirming uses your last checked version.'}
        </Text>
      )}

      <View style={styles.actions}>
        <Button
          title={reviewing ? 'Checking...' : `Check my English (${attemptsLeft} left)`}
          variant="outlined"
          onPress={onSubmit}
          disabled={!canSubmit}
          style={styles.actionButton}
        />
        <Button
          title={confirming ? 'Confirming...' : 'Confirm panel'}
          variant="primary"
          icon="CheckCircleIcon"
          onPress={onConfirm}
          disabled={!canConfirm}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    field: {
      gap: theme.spacing.xs,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    label: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    counter: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    counterWarning: {
      color: theme.color.textError,
    },
    textArea: {
      minHeight: 110,
    },
    review: {
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    reviewTitle: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    reviewText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    hint: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    actions: {
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: '100%',
    },
  });

export default PanelEditor;
