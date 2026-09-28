import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';

export interface TurnTimerProps {
  secondsLeft: number;
  /** Duración total del turno (config.turnDurationSec). */
  totalSeconds: number;
}

/** A partir de acá el contador se pone en rojo. */
const WARNING_SECONDS = 15;

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/** Tiempo que le queda al turno: barra + mm:ss. */
const TurnTimer: React.FC<TurnTimerProps> = ({ secondsLeft, totalSeconds }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const ratio = totalSeconds > 0 ? Math.min(1, Math.max(0, secondsLeft / totalSeconds)) : 0;
  const warning = secondsLeft <= WARNING_SECONDS;
  const color = warning ? theme.color.error : theme.color.success;

  return (
    <View
      style={styles.container}
      accessibilityRole="timer"
      accessibilityLabel={`${secondsLeft} seconds left`}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.time, warning && { color: theme.color.textError }]}>
        ⏱ {formatTime(secondsLeft)}
      </Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    track: {
      flex: 1,
      height: 8,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.border,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: theme.radius.full,
    },
    time: {
      minWidth: 56,
      textAlign: 'right',
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
  });

export default TurnTimer;
