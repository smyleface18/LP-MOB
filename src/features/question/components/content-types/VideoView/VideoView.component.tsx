import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';

export interface VideoViewComponentProps {
  url: string;
}

export const VideoViewComponent: React.FC<VideoViewComponentProps> = ({ url }) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const player = useVideoPlayer(url);

  // Autoplay: arranca una sola vez en cuanto el video está listo
  // (play() antes de cargar se pierde en algunas plataformas, sobre todo web).
  const hasAutoPlayed = useRef(false);
  useEffect(() => {
    const tryAutoPlay = (status: string) => {
      if (status === 'readyToPlay' && !hasAutoPlayed.current) {
        hasAutoPlayed.current = true;
        player.play();
      }
    };
    tryAutoPlay(player.status);
    const subscription = player.addListener('statusChange', ({ status }) => tryAutoPlay(status));
    return () => subscription.remove();
  }, [player]);

  // Detener al desmontar (cambio de pregunta). useLayoutEffect para que la
  // limpieza corra antes de que useVideoPlayer libere el player.
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

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: isDesktop ? 360 : 200,
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      marginBottom: theme.spacing.md,
      // Letterbox background: intentionally always black, independent of theme,
      // matching standard video player conventions.
      backgroundColor: '#000000',
    },
    video: {
      width: '100%',
      height: '100%',
    },
  });
