import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import StoryAvatar from '../StoryAvatar';
import { StoryHistoryItem } from '../../types';

export interface StoryHistoryCardProps {
  item: StoryHistoryItem;
  onPress: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];
/** Avatares que se muestran antes de "+N". */
const MAX_AVATARS = 4;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

/** Una historieta del historial: portada, fecha, nivel, primera viñeta, jugadores y tu puesto. */
const StoryHistoryCard: React.FC<StoryHistoryCardProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const shown = item.players.slice(0, MAX_AVATARS);
  const position = item.myPosition;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Story from ${formatDate(item.finishedAt)}`}
    >
      {item.coverImageUrl ? (
        <Image source={{ uri: item.coverImageUrl }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.coverEmoji}>📖</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.date}>{formatDate(item.finishedAt)}</Text>
          <Text style={styles.level}>{item.level}</Text>
          <Text style={styles.meta}>
            {item.panelsCount} {item.panelsCount === 1 ? 'panel' : 'panels'}
          </Text>
          <Text
            style={[styles.meta, item.likes.likedByMe && styles.liked]}
            accessibilityLabel={`${item.likes.count} likes`}
          >
            {item.likes.likedByMe ? '❤️' : '🤍'} {item.likes.count}
          </Text>
        </View>

        {item.title && (
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        )}
        <Text style={styles.excerpt} numberOfLines={2}>
          {item.excerpt || 'A story without words...'}
        </Text>

        <View style={styles.footer}>
          <View style={styles.avatars}>
            {shown.map((player, index) => (
              <View key={player.userId} style={[styles.avatar, index > 0 && styles.avatarOverlap]}>
                <StoryAvatar name={player.name} avatarUrl={player.avatarUrl} size={24} />
              </View>
            ))}
            {item.players.length > MAX_AVATARS && (
              <Text style={styles.more}>+{item.players.length - MAX_AVATARS}</Text>
            )}
          </View>
          {position ? (
            <Text style={styles.result}>
              {`${MEDALS[position - 1] ?? `#${position}`} `}
              {item.myScore} pts
            </Text>
          ) : (
            // No jugó (catálogo): quién la escribió en lugar de su puntaje.
            <Text style={styles.authors} numberOfLines={1}>
              by {item.players.map((player) => player.name).join(', ')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    cover: {
      width: 96,
      height: 72,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.border,
    },
    coverPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.primarySubtle,
    },
    coverEmoji: {
      fontSize: 32,
    },
    body: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    date: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    level: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.secondary,
      backgroundColor: theme.color.secondarySubtle,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      overflow: 'hidden',
    },
    meta: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    liked: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    excerpt: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    avatars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      borderRadius: theme.radius.full,
      borderWidth: 2,
      borderColor: theme.color.surface,
    },
    avatarOverlap: {
      marginLeft: -8,
    },
    more: {
      marginLeft: theme.spacing.xs,
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    result: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
    },
    authors: {
      flexShrink: 1,
      marginLeft: theme.spacing.sm,
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
  });

export default StoryHistoryCard;
