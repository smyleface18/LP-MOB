import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { Button } from '@/shared/ui';

interface AudioViewProps {
  url: string;
}

export const AudioView = ({ url }: AudioViewProps) => {
  const player = useAudioPlayer({ uri: url });

  return (
    <View>
      <Button title="Play" onPress={() => player.play()} />
      <Button title="Pause" onPress={() => player.pause()} />
      <Button
        title="Replay"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
