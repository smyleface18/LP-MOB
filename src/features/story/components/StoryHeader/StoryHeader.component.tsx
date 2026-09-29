import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { withAlpha } from '@/shared/ui/theme/primitives';
import { Icon } from '@/shared/components/Icon';
import { ExitGameButton } from '@/features/game/components/ExitGameButton';

export interface StoryHeaderProps {
  title: string;
  /** Botón de volver a la izquierda. */
  onBack?: () => void;
  backLabel?: string;
  /** Botón de salir de la partida a la derecha. */
  onExit?: () => void;
  /** Fila de chips debajo del título (ej. conexión, código, puntaje). */
  children?: React.ReactNode;
}

/** Cabecera de las pantallas del modo Historieta (mismo estilo que la de la trivia). */
const StoryHeader: React.FC<StoryHeaderProps> = ({
  title,
  onBack,
  backLabel = 'Back',
  onExit,
  children,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.button}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
          >
            <Icon name="ArrowLeftIcon" size="md" color={theme.color.onSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {onExit ? (
          <ExitGameButton onPress={onExit} color={theme.color.onSecondary} style={styles.button} />
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
      {children && <View style={styles.chips}>{children}</View>}
    </View>
  );
};

export interface StoryHeaderChipProps {
  label: string;
  /** Punto de color a la izquierda (ej. estado de la conexión). */
  dotColor?: string;
}

/** Chip de la cabecera. */
export const StoryHeaderChip: React.FC<StoryHeaderChipProps> = ({ label, dotColor }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.chip}>
      {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    header: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.color.secondaryButton,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
      gap: theme.spacing.sm,
      ...theme.shadow.sm,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    title: {
      flexShrink: 1,
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.onSecondary,
    },
    button: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: withAlpha(theme.color.onSecondary, 0.12),
    },
    spacer: {
      width: theme.spacing.xl,
    },
    chips: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: withAlpha(theme.color.onSecondary, 0.12),
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.radius.full,
      marginRight: theme.spacing.xs,
    },
    chipText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onSecondary,
    },
  });

export default StoryHeader;
