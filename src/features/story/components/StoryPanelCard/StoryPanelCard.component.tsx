import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import ReactionBar from '../ReactionBar';
import { PanelReactions } from '../../types';

export interface StoryPanelCardProps {
  /** Orden de la viñeta, desde 0 (se muestra desde 1). */
  order: number;
  authorName: string;
  scene: string;
  text: string;
  /** Nombres de los personajes que aparecen. */
  characterNames?: string[];
  /** Puntos de la viñeta (se muestran arriba a la derecha). */
  score?: number;
  /**
   * 'panel': viñeta confirmada. 'draft': borrador en curso del autor (lo ven
   * los demás con `shareDrafts`), con borde punteado.
   */
  variant?: 'panel' | 'draft';
  reactions?: PanelReactions;
  reactionOptions?: string[];
  userId?: string;
  onReact?: (emoji: string) => void;
  /** Detalle extra debajo del texto (ej. correcciones en el review). */
  children?: React.ReactNode;
}

const StoryPanelCard: React.FC<StoryPanelCardProps> = ({
  order,
  authorName,
  scene,
  text,
  characterNames = [],
  score,
  variant = 'panel',
  reactions,
  reactionOptions = [],
  userId = '',
  onReact,
  children,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.card, variant === 'draft' && styles.draft]}>
      <View style={styles.header}>
        <Text style={styles.order}>{variant === 'draft' ? '✏️ Draft' : `Panel ${order + 1}`}</Text>
        <Text style={styles.author} numberOfLines={1}>
          by {authorName}
        </Text>
        {score !== undefined && <Text style={styles.score}>{score} pts</Text>}
      </View>

      {!!scene && <Text style={styles.scene}>🎬 {scene}</Text>}
      <Text style={styles.text}>{text}</Text>

      {characterNames.length > 0 && (
        <View style={styles.characters}>
          {characterNames.map((name) => (
            <Text key={name} style={styles.character}>
              {name}
            </Text>
          ))}
        </View>
      )}

      {children}

      {reactions && reactionOptions.length > 0 && (
        <ReactionBar
          reactions={reactions}
          options={reactionOptions}
          userId={userId}
          onReact={onReact}
        />
      )}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    draft: {
      borderStyle: 'dashed',
      borderColor: theme.color.textPlaceholder,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    order: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.primary,
    },
    author: {
      flex: 1,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
    score: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
      backgroundColor: theme.color.successSubtle,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
    },
    scene: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      fontStyle: 'italic',
      color: theme.color.textSecondary,
    },
    text: {
      fontSize: theme.fontSize.lg,
      lineHeight: theme.fontSize.lg * theme.lineHeight.lg,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textPrimary,
    },
    characters: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    character: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.secondary,
      backgroundColor: theme.color.secondarySubtle,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      overflow: 'hidden',
    },
  });

export default StoryPanelCard;
