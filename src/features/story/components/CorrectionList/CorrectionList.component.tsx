import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { CharacterCorrection, Correction, CorrectionType } from '../../types';

export interface CorrectionListProps {
  corrections: Correction[];
  /** Correcciones de las fichas de personajes nuevos (no restan puntos). */
  characterCorrections?: CharacterCorrection[];
  /** Nombres de los personajes nuevos, por índice, para las correcciones de fichas. */
  newCharacterNames?: string[];
  /** Texto si no hay correcciones (ej. "Perfect! No mistakes."). */
  emptyText?: string;
}

const TYPE_LABEL: Record<CorrectionType, string> = {
  grammar: 'Grammar',
  spelling: 'Spelling',
  vocabulary: 'Vocabulary',
  punctuation: 'Punctuation',
};

/**
 * Correcciones de la IA: fragmento original → sugerencia, con la explicación
 * (en español). Nunca muestra el texto corregido completo: el jugador corrige solo.
 */
const CorrectionList: React.FC<CorrectionListProps> = ({
  corrections,
  characterCorrections = [],
  newCharacterNames = [],
  emptyText,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (corrections.length === 0 && characterCorrections.length === 0) {
    return emptyText ? <Text style={styles.empty}>✅ {emptyText}</Text> : null;
  }

  return (
    <View style={styles.list}>
      {corrections.map((correction, index) => (
        <View key={`text-${index}`} style={styles.item}>
          <View style={styles.header}>
            <Text style={styles.type}>{TYPE_LABEL[correction.type] ?? correction.type}</Text>
          </View>
          <Text style={styles.change}>
            <Text style={styles.original}>{correction.original}</Text>
            {'  →  '}
            <Text style={styles.suggestion}>{correction.suggestion}</Text>
          </Text>
          <Text style={styles.explanation}>{correction.explanation}</Text>
        </View>
      ))}

      {characterCorrections.map((correction, index) => (
        <View key={`character-${index}`} style={styles.item}>
          <View style={styles.header}>
            <Text style={styles.type}>
              Character
              {newCharacterNames[correction.characterIndex]
                ? ` · ${newCharacterNames[correction.characterIndex]}`
                : ''}{' '}
              · {correction.field}
            </Text>
          </View>
          <Text style={styles.change}>
            <Text style={styles.original}>{correction.original}</Text>
            {'  →  '}
            <Text style={styles.suggestion}>{correction.suggestion}</Text>
          </Text>
          <Text style={styles.explanation}>{correction.explanation}</Text>
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    list: {
      gap: theme.spacing.sm,
    },
    // accentSubtle es translúcido en dark: el texto usa los tokens de texto
    // normales, no onAccent (que es para el amarillo sólido).
    item: {
      backgroundColor: theme.color.accentSubtle,
      borderRadius: theme.radius.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.color.accent,
      padding: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    header: {
      flexDirection: 'row',
    },
    type: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
      textTransform: 'uppercase',
    },
    change: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textPrimary,
    },
    original: {
      textDecorationLine: 'line-through',
      color: theme.color.textError,
    },
    suggestion: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    explanation: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
    empty: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
    },
  });

export default CorrectionList;
