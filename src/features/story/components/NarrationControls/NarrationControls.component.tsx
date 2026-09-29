import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon } from '@/shared/components/Icon';
import { PanelMediaStatus } from '../../types';

export interface NarrationControlsProps {
  mediaStatus: PanelMediaStatus;
  /** Hay audio para reproducir (URL firmada). */
  hasAudio: boolean;
  playing: boolean;
  /** Cargando el audio después de tocar play. */
  loading: boolean;
  /** 0 a 1. */
  progress: number;
  onToggle: () => void;
}

/** Play/pausa de la narración de una viñeta, o el estado de su media si todavía no hay audio. */
const NarrationControls: React.FC<NarrationControlsProps> = ({
  mediaStatus,
  hasAudio,
  playing,
  loading,
  progress,
  onToggle,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (mediaStatus === 'none') return null;

  if (mediaStatus === 'pending') {
    return (
      <View style={styles.row}>
        <ActivityIndicator size="small" color={theme.color.textSecondary} />
        <Text style={styles.hint}>Preparing the narration...</Text>
      </View>
    );
  }

  if (!hasAudio) {
    return <Text style={styles.hint}>🔇 Narration not available for this panel.</Text>;
  }

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause the narration' : 'Listen to this panel'}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.color.onPrimary} />
        ) : (
          <Icon
            name={playing ? 'PauseIcon' : 'PlayIcon'}
            size="sm"
            weight="fill"
            color={theme.color.onPrimary}
          />
        )}
      </TouchableOpacity>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Text style={styles.label}>{playing ? 'Listening' : 'Listen'}</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    button: {
      width: 36,
      height: 36,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.primary,
    },
    track: {
      flex: 1,
      height: 6,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.border,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primary,
    },
    label: {
      minWidth: 64,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    hint: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
  });

export default NarrationControls;
