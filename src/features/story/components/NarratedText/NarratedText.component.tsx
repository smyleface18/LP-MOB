import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { SpeechMark } from '../../types';

export interface NarratedTextProps {
  text: string;
  /** Offsets en caracteres de cada palabra narrada (speech marks de Polly). */
  speechMarks: SpeechMark[] | null;
  /** Palabra que se está leyendo (índice en `speechMarks`); -1 = ninguna. */
  activeIndex: number;
  style?: TextStyle;
}

/**
 * Texto de la viñeta con la palabra que se está narrando resaltada, como un
 * karaoke: ayuda a seguir la lectura en inglés. Sin marcas es texto normal.
 */
const NarratedText: React.FC<NarratedTextProps> = ({ text, speechMarks, activeIndex, style }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const mark = activeIndex >= 0 ? speechMarks?.[activeIndex] : undefined;

  if (!mark || mark.start < 0 || mark.end > text.length || mark.start >= mark.end) {
    return <Text style={[styles.text, style]}>{text}</Text>;
  }

  return (
    <Text style={[styles.text, style]}>
      {text.slice(0, mark.start)}
      <Text style={styles.active}>{text.slice(mark.start, mark.end)}</Text>
      {text.slice(mark.end)}
    </Text>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    text: {
      fontSize: theme.fontSize.lg,
      lineHeight: theme.fontSize.lg * theme.lineHeight.lg,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textPrimary,
    },
    // Fondo amarillo sólido + onAccent: se lee igual en light y dark.
    active: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onAccent,
      backgroundColor: theme.color.accent,
    },
  });

export default NarratedText;
