import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import Button from '@/shared/components/Button/Button.component';
import Input from '@/shared/components/Input/Input.component';
import { Icon } from '@/shared/components/Icon';
import { CharacterSheet, StoryCharacter } from '../../types';

export interface CharacterPickerLimits {
  /** Personajes por viñeta (existentes + nuevos). */
  maxPerPanel: number;
  maxNewPerPanel: number;
  maxPerStory: number;
  fields: Record<keyof CharacterSheet, number>;
}

export interface CharacterPickerProps {
  /** Elenco de la historieta (personajes ya confirmados). */
  cast: StoryCharacter[];
  selectedIds: string[];
  onToggle: (characterId: string) => void;
  /** Personajes nuevos de este borrador: entran al elenco al confirmar la viñeta. */
  newCharacters: CharacterSheet[];
  onAddNew: (character: CharacterSheet) => void;
  onRemoveNew: (index: number) => void;
  limits: CharacterPickerLimits;
  disabled?: boolean;
}

const EMPTY_SHEET: CharacterSheet = { name: '', kind: '', description: '' };

const FIELD_PLACEHOLDER: Record<keyof CharacterSheet, string> = {
  name: 'Name (e.g. Max)',
  kind: 'What is it? (e.g. dog, robot)',
  description: 'Looks like... (e.g. small brown dog with a red collar)',
};

/**
 * Personajes de la viñeta: se eligen del elenco o se crean con una ficha corta
 * (en inglés). Aplica los mismos topes que el servidor para no dejar armar
 * algo que se va a rechazar.
 */
const CharacterPicker: React.FC<CharacterPickerProps> = ({
  cast,
  selectedIds,
  onToggle,
  newCharacters,
  onAddNew,
  onRemoveNew,
  limits,
  disabled = false,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [formOpen, setFormOpen] = useState(false);
  const [sheet, setSheet] = useState<CharacterSheet>(EMPTY_SHEET);
  const [formError, setFormError] = useState<string | null>(null);

  const inPanel = selectedIds.length + newCharacters.length;
  const panelFull = inPanel >= limits.maxPerPanel;
  const storyFull = cast.length + newCharacters.length >= limits.maxPerStory;
  const canCreate =
    !disabled && !panelFull && !storyFull && newCharacters.length < limits.maxNewPerPanel;

  const createLimitReason = storyFull
    ? `The story already has ${limits.maxPerStory} characters.`
    : panelFull
      ? `A panel can have up to ${limits.maxPerPanel} characters.`
      : newCharacters.length >= limits.maxNewPerPanel
        ? `You can create up to ${limits.maxNewPerPanel} new characters per panel.`
        : null;

  const handleAdd = () => {
    const trimmed: CharacterSheet = {
      name: sheet.name.trim(),
      kind: sheet.kind.trim(),
      description: sheet.description.trim(),
    };
    if (!trimmed.name || !trimmed.kind || !trimmed.description) {
      setFormError('Fill in the name, what it is and how it looks.');
      return;
    }
    const taken = [...cast.map((c) => c.name), ...newCharacters.map((c) => c.name)];
    if (taken.some((name) => name.toLowerCase() === trimmed.name.toLowerCase())) {
      setFormError(`There is already a character called ${trimmed.name}.`);
      return;
    }
    onAddNew(trimmed);
    setSheet(EMPTY_SHEET);
    setFormError(null);
    setFormOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Characters</Text>
        <Text style={styles.counter}>
          {inPanel}/{limits.maxPerPanel} in this panel
        </Text>
      </View>

      {cast.length > 0 ? (
        <View style={styles.chips}>
          {cast.map((character) => {
            const selected = selectedIds.includes(character.id);
            const blocked = !selected && panelFull;
            return (
              <TouchableOpacity
                key={character.id}
                onPress={() => onToggle(character.id)}
                disabled={disabled || blocked}
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                  blocked && styles.chipBlocked,
                ]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected, disabled: disabled || blocked }}
              >
                <Text style={[styles.chipName, selected && styles.chipNameSelected]}>
                  {character.name}
                </Text>
                <Text style={styles.chipKind}>{character.kind}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text style={styles.hint}>No characters yet — create the first one!</Text>
      )}

      {newCharacters.map((character, index) => (
        <View key={`${character.name}-${index}`} style={styles.newCharacter}>
          <View style={styles.newCharacterInfo}>
            <Text style={styles.chipName}>
              ✨ {character.name} <Text style={styles.chipKind}>· {character.kind}</Text>
            </Text>
            <Text style={styles.description}>{character.description}</Text>
          </View>
          {!disabled && (
            <TouchableOpacity
              onPress={() => onRemoveNew(index)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${character.name}`}
            >
              <Icon name="TrashIcon" size="sm" color={theme.color.textError} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {formOpen ? (
        <View style={styles.form}>
          {(Object.keys(FIELD_PLACEHOLDER) as (keyof CharacterSheet)[]).map((field) => (
            <Input
              key={field}
              variant="outlined"
              placeholder={FIELD_PLACEHOLDER[field]}
              value={sheet[field]}
              maxLength={limits.fields[field]}
              onChangeText={(value) => setSheet((prev) => ({ ...prev, [field]: value }))}
              autoCapitalize={field === 'name' ? 'words' : 'none'}
            />
          ))}
          {formError && <Text style={styles.error}>{formError}</Text>}
          <View style={styles.formActions}>
            <Button
              title="Cancel"
              variant="outlined"
              size="small"
              onPress={() => {
                setFormOpen(false);
                setFormError(null);
              }}
              style={styles.formButton}
            />
            <Button title="Add" size="small" onPress={handleAdd} style={styles.formButton} />
          </View>
        </View>
      ) : (
        <>
          <Button
            title="New character"
            variant="outlinedSecondary"
            size="small"
            icon="PlusCircleIcon"
            onPress={() => setFormOpen(true)}
            disabled={!canCreate}
          />
          {!disabled && createLimitReason && <Text style={styles.hint}>{createLimitReason}</Text>}
        </>
      )}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    counter: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    chip: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.md,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      backgroundColor: theme.color.background,
    },
    chipSelected: {
      borderColor: theme.color.primary,
      backgroundColor: theme.color.primarySubtle,
    },
    chipBlocked: {
      opacity: 0.4,
    },
    chipName: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    chipNameSelected: {
      color: theme.color.primary,
    },
    chipKind: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
    newCharacter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.secondarySubtle,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    newCharacterInfo: {
      flex: 1,
      gap: 2,
    },
    description: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    form: {
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    formActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    formButton: {
      flex: 1,
    },
    hint: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
    },
    error: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textError,
    },
  });

export default CharacterPicker;
