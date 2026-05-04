import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

interface VideoViewProps {
  url: string;
}

export const VideoViewComponent: React.FC<VideoViewProps> = ({ url }) => {
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
