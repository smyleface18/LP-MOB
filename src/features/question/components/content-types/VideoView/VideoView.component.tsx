import React, { useMemo } from 'react';
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

  const player = useVideoPlayer(url, (player) => {
    player.play();
  });

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
