import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import { Icon } from '@/shared/components/Icon';

export interface AudioViewProps {
  url: string;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Margen para considerar que el audio terminó (el status no siempre llega
// exactamente a `duration`).
const END_EPSILON = 0.25;

export const AudioView: React.FC<AudioViewProps> = ({ url }) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const player = useAudioPlayer({ uri: url }, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  // Autoplay: arranca una sola vez en cuanto el audio termina de cargar.
  const hasAutoPlayed = useRef(false);
  useEffect(() => {
    if (status.isLoaded && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      player.play();
    }
  }, [status.isLoaded, player]);

  // Detener al desmontar (cambio de pregunta). useLayoutEffect para que la
  // limpieza corra antes de que useAudioPlayer libere el player.
  useLayoutEffect(
    () => () => {
      try {
        player.pause();
      } catch {
        // El player ya fue liberado.
      }
    },
    [player],
  );

  const trackWidth = useRef(0);
  // Posición (0-1) mientras el usuario arrastra la barra; null si no arrastra.
  const [scrub, setScrub] = useState<number | null>(null);

  const duration = status.duration > 0 ? status.duration : 0;
  const isLoading = !status.isLoaded;
  const isBuffering = status.isLoaded && status.isBuffering && status.playing;
  const atEnd = duration > 0 && status.currentTime >= duration - END_EPSILON;

  const progress =
    scrub ?? (duration > 0 ? Math.min(Math.max(status.currentTime / duration, 0), 1) : 0);
  const displayedTime = scrub !== null ? scrub * duration : status.currentTime;

  const togglePlay = () => {
    if (isLoading) return;
    if (status.playing) {
      player.pause();
      return;
    }
    if (atEnd) player.seekTo(0);
    player.play();
  };

  const restart = () => {
    if (isLoading) return;
    player.seekTo(0);
    player.play();
  };

  const ratioFromEvent = (event: GestureResponderEvent) => {
    if (trackWidth.current <= 0) return 0;
    return Math.min(Math.max(event.nativeEvent.locationX / trackWidth.current, 0), 1);
  };

  const handleScrubStart = (event: GestureResponderEvent) => setScrub(ratioFromEvent(event));
  const handleScrubMove = (event: GestureResponderEvent) => setScrub(ratioFromEvent(event));
  const handleScrubEnd = (event: GestureResponderEvent) => {
    const ratio = ratioFromEvent(event);
    if (duration > 0) player.seekTo(ratio * duration);
    setScrub(null);
  };

  const canSeek = !isLoading && duration > 0;

  const statusLabel = isLoading
    ? 'Cargando audio...'
    : isBuffering
      ? 'Cargando...'
      : status.playing
        ? 'Reproduciendo'
        : atEnd
          ? 'Finalizado'
          : 'En pausa';

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={status.playing ? 'Pausar' : 'Reproducir'}
          onPress={togglePlay}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
            isLoading && styles.playButtonDisabled,
          ]}
        >
          {isLoading || isBuffering ? (
            <ActivityIndicator color={theme.color.onPrimary} />
          ) : (
            <Icon
              name={status.playing ? 'PauseIcon' : 'PlayIcon'}
              weight="fill"
              color={theme.color.onPrimary}
            />
          )}
        </Pressable>

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={styles.statusText}>{statusLabel}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reproducir desde el inicio"
              onPress={restart}
              disabled={isLoading}
              hitSlop={8}
            >
              <Icon name="ArrowCounterClockwiseIcon" size="sm" color={theme.color.textSecondary} />
            </Pressable>
          </View>

          <View
            style={styles.trackHitArea}
            onLayout={(e: LayoutChangeEvent) => {
              trackWidth.current = e.nativeEvent.layout.width;
            }}
            onStartShouldSetResponder={() => canSeek}
            onMoveShouldSetResponder={() => canSeek}
            onResponderTerminationRequest={() => false}
            onResponderGrant={handleScrubStart}
            onResponderMove={handleScrubMove}
            onResponderRelease={handleScrubEnd}
            onResponderTerminate={() => setScrub(null)}
            accessibilityRole="adjustable"
            accessibilityLabel="Progreso del audio"
            accessibilityValue={{
              min: 0,
              max: Math.round(duration),
              now: Math.round(displayedTime),
            }}
          >
            {/* pointerEvents none: locationX debe ser relativo al hit area, no a los hijos */}
            <View style={styles.track} pointerEvents="none">
              <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
            </View>
            <View
              pointerEvents="none"
              style={[
                styles.thumb,
                { left: `${progress * 100}%` },
                scrub !== null && styles.thumbActive,
                !canSeek && styles.thumbHidden,
              ]}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(displayedTime)}</Text>
            <Text style={styles.timeText}>{isLoading ? '--:--' : formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const PLAY_SIZE = 48;
const THUMB_SIZE = 14;

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      marginBottom: theme.spacing.md,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      alignItems: 'center',
    },
    player: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      width: isDesktop ? 420 : '100%',
    },
    playButton: {
      width: PLAY_SIZE,
      height: PLAY_SIZE,
      borderRadius: PLAY_SIZE / 2,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButtonPressed: {
      backgroundColor: theme.color.primaryPressed,
    },
    playButtonDisabled: {
      opacity: 0.6,
    },
    body: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    trackHitArea: {
      height: 24,
      justifyContent: 'center',
    },
    track: {
      height: 6,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.border,
      overflow: 'hidden',
    },
    trackFill: {
      height: '100%',
      backgroundColor: theme.color.primary,
    },
    thumb: {
      position: 'absolute',
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      marginLeft: -THUMB_SIZE / 2,
      backgroundColor: theme.color.primary,
      borderWidth: 2,
      borderColor: theme.color.surface,
    },
    thumbActive: {
      transform: [{ scale: 1.3 }],
    },
    thumbHidden: {
      opacity: 0,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    timeText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
      fontVariant: ['tabular-nums'],
    },
  });
