import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';

export interface AudioViewProps {
  url: string;
}

export const AudioView: React.FC<AudioViewProps> = ({ url }) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const player = useAudioPlayer({ uri: url });

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.controlItem}>
          <Button title="Play" variant="primary" size="small" onPress={() => player.play()} />
        </View>
        <View style={styles.controlItem}>
          <Button title="Pause" variant="outlined" size="small" onPress={() => player.pause()} />
        </View>
        <View style={styles.controlItem}>
          <Button
            title="Replay"
            variant="outlined"
            size="small"
            onPress={() => {
              player.seekTo(0);
              player.play();
            }}
          />
        </View>
      </View>
    </View>
  );
};

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
    controls: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      width: isDesktop ? 360 : '100%',
    },
    controlItem: {
      minWidth: 96,
      flexGrow: 1,
    },
  });
