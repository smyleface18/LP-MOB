import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { PanelReactions } from '../../types';

export interface ReactionBarProps {
  /** userId → emoji. */
  reactions: PanelReactions;
  /** Emojis permitidos (`rules.reactions`). */
  options: string[];
  /** Para resaltar la reacción propia. */
  userId: string;
  /** Sin esto la barra es de solo lectura (ej. el jugador salió de la partida). */
  onReact?: (emoji: string) => void;
}

/** Una reacción por jugador y viñeta: tocar otra la reemplaza, tocar la propia la quita. */
const ReactionBar: React.FC<ReactionBarProps> = ({ reactions, options, userId, onReact }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    Object.values(reactions).forEach((emoji) => {
      result[emoji] = (result[emoji] ?? 0) + 1;
    });
    return result;
  }, [reactions]);
  const mine = reactions[userId];

  return (
    <View style={styles.bar}>
      {options.map((emoji) => {
        const count = counts[emoji] ?? 0;
        const selected = mine === emoji;
        return (
          <TouchableOpacity
            key={emoji}
            onPress={onReact ? () => onReact(emoji) : undefined}
            disabled={!onReact}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled: !onReact }}
            accessibilityLabel={`React with ${emoji}${count ? `, ${count}` : ''}`}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            {count > 0 && (
              <Text style={[styles.count, selected && styles.countSelected]}>{count}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.full,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      backgroundColor: theme.color.background,
    },
    chipSelected: {
      borderColor: theme.color.primary,
      backgroundColor: theme.color.primarySubtle,
    },
    emoji: {
      fontSize: theme.fontSize.lg,
    },
    count: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    countSelected: {
      color: theme.color.textPrimary,
    },
  });

export default ReactionBar;
