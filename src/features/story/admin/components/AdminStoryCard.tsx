import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import StoryAvatar from '../../components/StoryAvatar';
import { AdminStoryItem, REMOVAL_REASON_LABELS, StoryVisibility } from '../types';

export interface AdminStoryCardProps {
  story: AdminStoryItem;
  onPress: (storyId: string) => void;
}

const MAX_AVATARS = 4;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });

/** Tarjeta del panel de moderación: portada, estado, título, extracto y jugadores. */
const AdminStoryCard: React.FC<AdminStoryCardProps> = ({ story, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const removed = story.visibility === StoryVisibility.REMOVED;
  const shown = story.participants.slice(0, MAX_AVATARS);

  return (
    <TouchableOpacity
      style={[styles.card, removed && styles.cardRemoved]}
      onPress={() => onPress(story.storyId)}
      accessibilityRole="button"
      accessibilityLabel={`Ver ${story.title ?? story.gameId}`}
    >
      {story.coverImageUrl ? (
        <Image source={{ uri: story.coverImageUrl }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.coverEmoji}>📖</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, removed ? styles.badgeRemoved : styles.badgePublished]}>
            {removed ? 'Quitada' : 'Publicada'}
          </Text>
          <Text style={styles.meta}>
            {story.level} · {story.panelsCount} viñetas · {formatDate(story.finishedAt)}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {story.title ?? 'Sin título'}
        </Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {story.excerpt || '(sin texto)'}
        </Text>

        {story.removal && (
          <Text style={styles.removal} numberOfLines={1}>
            {REMOVAL_REASON_LABELS[story.removal.reason]}
            {story.removal.removedBy ? ` · por ${story.removal.removedBy.username}` : ''}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.avatars}>
            {shown.map((player, index) => (
              <View key={player.userId} style={index > 0 && styles.avatarOverlap}>
                <StoryAvatar name={player.username} avatarUrl={player.avatarUrl} size={24} />
              </View>
            ))}
          </View>
          <Text style={styles.players} numberOfLines={1}>
            {story.participants.map((player) => player.username).join(', ')}
          </Text>
        </View>
        <Text style={styles.code}>Partida {story.gameId}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      overflow: 'hidden',
    },
    cardRemoved: {
      borderColor: theme.color.error,
      opacity: 0.85,
    },
    cover: {
      width: '100%',
      height: 140,
    },
    coverPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.primarySubtle,
    },
    coverEmoji: {
      fontSize: 40,
    },
    body: {
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    badge: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      overflow: 'hidden',
    },
    badgePublished: {
      color: theme.color.success,
      backgroundColor: theme.color.successSubtle,
    },
    badgeRemoved: {
      color: theme.color.error,
      backgroundColor: theme.color.errorSubtle,
    },
    meta: {
      flex: 1,
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
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
    removal: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    avatars: {
      flexDirection: 'row',
    },
    avatarOverlap: {
      marginLeft: -8,
    },
    players: {
      flex: 1,
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    code: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
    },
  });

export default AdminStoryCard;
